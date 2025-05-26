import * as Sqlite from "@spinframework/spin-sqlite"
import { CustomerDetailsModel, CustomerListModel } from "./models";
import { Context } from "hono";

const SQL_READ_ALL_CUSTOMERS = "SELECT Id, Name, Country, Scoring FROM Customers order by Name";
const SQL_READ_TOP_CUSTOMERS = "SELECT Id, Name, Country, Scoring FROM Customers order by Scoring desc, Name LIMIT ?";
const SQL_READ_CUSTOMER_BY_ID = "SELECT Id, Name, City, Country, Scoring FROM Customers WHERE Id=?";
const SQL_READ_CUSTOMER_COUNT = "SELECT COUNT(Id) AS CustomerCount FROM Customers";


export function getAllItems(c: Context) {
    const con = Sqlite.openDefault();
    const result = con.execute(SQL_READ_ALL_CUSTOMERS, []);
    const items = result.rows.map((row) => {
        return {
            id: row["Id"]?.toString(),
            name: row["Name"]?.toString(),
            country: row["Country"]?.toString(),
            scoring: Number(row["Scoring"]?.toString())

        } as CustomerListModel
    });
    return c.json(items);
}

export function getTopCustomers(c: Context) {
    const limit = c.req.param("limit");
    if (Number.isNaN(+limit)) {
        c.status(400)
        return c.text("Invalid parameter (limit) received")
    }
    let l = +limit;
    if (l < 1) {
        c.status(400)
        return c.text("Limit must be higher than 0")
    }
    const con = Sqlite.openDefault();
    const result = con.execute(SQL_READ_TOP_CUSTOMERS, [l]);
    const items = result.rows.map((row) => {
        return {
            id: row["Id"]?.toString(),
            name: row["Name"]?.toString(),
            country: row["Country"]?.toString(),
            scoring: Number(row["Scoring"]?.toString())

        } as CustomerListModel
    });
    return c.json(items);
}

export function getCustomerCount(c: Context) {
    const con = Sqlite.openDefault();
    const result = con.execute(SQL_READ_CUSTOMER_COUNT, []);
    const count = result.rows[0]["CustomerCount"];
    return c.json({
        count: Number(count)
    });
}

export function getCustomerById(c: Context) {
    const id = c.req.param("id");
    if (!id || !isGuid(id)) {
        c.status(400)
        return c.text("Invalid parameter (id) received")
    }

    const con = Sqlite.openDefault();
    const result = con.execute(SQL_READ_CUSTOMER_BY_ID, [id]);
    if (result.rows.length === 0) {
        return c.notFound();
    }
    const found = {
        id: result.rows[0]["Id"]?.toString(),
        name: result.rows[0]["Name"]?.toString(),
        city: result.rows[0]["City"]?.toString(),
        country: result.rows[0]["Country"]?.toString(),
        scoring: Number(result.rows[0]["Scoring"]?.toString())
    } as CustomerDetailsModel;

    return c.json(found);
}

function isGuid(id: string) {
    let m = id.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    console.log(JSON.stringify(m));
    return !!m;
}