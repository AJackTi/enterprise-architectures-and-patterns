import * as Postgres from "@spinframework/spin-postgres";
import { json, text } from "itty-router";
import { v4 as uuidv4 } from "uuid";
import { validate as uuidValidate } from "uuid";
const decoder = new TextDecoder();

const COMMAND_CREATE_ITEM =
  "INSERT INTO Items (Id, Name, Active) VALUES ($1, $2, $3)";
const COMMAND_READ_ALL_ITEMS =
  "SELECT Id, Name, Active FROM Items ORDER BY Name";
const COMMAND_READ_SINGLE_ITEM =
  "SELECT Id, Name, Active FROM Items WHERE Id = $1";
const COMMAND_DELETE_SINGLE_ITEM = "DELETE FROM Items WHERE Id = $1";
const COMMAND_DELETE_MANY_ITEMS = "DELETE FROM Items WHERE Id IN";
const COMMAND_UPDATE_SINGLE_ITEM =
  "UPDATE Items SET Name = $1, Active = $2 WHERE Id = $3";

const getAllItems = (config) => {
  let con = Postgres.open(config.dbConnectionString);
  const queryResult = con.query(COMMAND_READ_ALL_ITEMS, []);
  let items = queryResult.rows.map((row) => {
    return {
      id: row["id"],
      name: row["name"],
      active: row["active"],
    };
  });
  return json(items);
};

const badRequest = (message) => {
  return text(message, { status: 400 });
};

const notFound = (message) => {
  return text(message, { status: 404 });
};

const getItemById = (config, id, res) => {
  if (!uuidValidate(id)) {
    return badRequest("Invalid identifier received via URL");
  }
  let con = Postgres.open(config.dbConnectionString);
  let queryResult = con.query(COMMAND_READ_SINGLE_ITEM, [id]);
  if (queryResult.rows.length == 0) {
    return notFound(`No item found with id ${id}`);
  }
  let found = {
    id: queryResult.rows[0]["id"],
    name: queryResult.rows[0]["name"],
    active: queryResult.rows[0]["active"],
  };

  return json(found);
};

const deleteItemById = (config, id, res) => {
  if (!uuidValidate(id)) {
    return badRequest("Invalid identifier received via URL");
  }
  let con = Postgres.open(config.dbConnectionString);
  con.execute(COMMAND_DELETE_SINGLE_ITEM, [id]);
  return json(null, { status: 204 });
};

const deleteManyItems = (config, requestBody, res) => {
  let payload = JSON.parse(decoder.decode(requestBody));
  if (
    !Array.isArray(payload.ids) ||
    payload.ids.length == 0 ||
    !payload.ids.every((id) => uuidValidate(id))
  ) {
    return badRequest(
      "Invalid payload received. Expecting an array with valid uuids",
    );
  }

  let cmd = `${COMMAND_DELETE_MANY_ITEMS} (`;
  let parameters = [];
  for (let i = 0; i < payload.ids.length; i++) {
    cmd = `${cmd}\$${i + 1}`;
    if (i < payload.ids.length - 1) {
      cmd = `${cmd},`;
    }
    parameters.push(payload.ids[i]);
  }
  cmd = `${cmd})`;
  let con = Postgres.open(config.dbConnectionString);
  con.execute(cmd, parameters);
  return json(null, { status: 204 });
};

const createItem = (config, baseUrl, requestBody, res) => {
  let payload = JSON.parse(decoder.decode(requestBody));

  if (!payload || !payload.name || typeof payload.active != "boolean") {
    return badRequest(
      'Invalid payload received. Expecting {"name":"some name", "active": true}',
    );
  }

  const newItem = {
    id: uuidv4(),
    name: payload.name,
    active: payload.active,
  };

  let con = Postgres.open(config.dbConnectionString);
  con.execute(COMMAND_CREATE_ITEM, [newItem.id, newItem.name, newItem.active]);

  return json(newItem, {
    status: 201,
    headers: {
      "content-type": "application/json",
      location: `${baseUrl}/items/${newItem.id}`,
    },
  });
};

const updateItemById = (config, baseUrl, id, requestBody, res) => {
  let payload = JSON.parse(decoder.decode(requestBody));
  if (!payload || !payload.name || typeof payload.active != "boolean") {
    return badRequest(
      'Invalid payload received. Expecting {"name":"some name", "active": true}',
    );
  }
  if (!uuidValidate(id)) {
    return badRequest("Invalid identifier received via URL");
  }

  const item = {
    id: id,
    name: payload.name,
    active: payload.active,
  };
  let con = Postgres.open(config.dbConnectionString);
  con.execute(COMMAND_UPDATE_SINGLE_ITEM, [item.name, item.active, item.id]);

  return json(item, {
    headers: {
      "content-type": "application/json",
      location: `${baseUrl}/items/${id}`,
    },
  });
};

export {
  createItem,
  deleteItemById,
  deleteManyItems,
  getAllItems,
  getItemById,
  badRequest,
  notFound,
  updateItemById,
};
