import * as Sqlite from "@spinframework/spin-sqlite";
import { v4 as uuidv4 } from "uuid";
import { validate as uuidValidate } from "uuid";
import { json, text } from "itty-router";
const decoder = new TextDecoder();

const DB_NAME = "default";
const COMMAND_CREATE_ITEM =
  "INSERT INTO ITEMS (ID, NAME, ACTIVE) VALUES ($1, $2, $3)";
const COMMAND_READ_ALL_ITEMS =
  "SELECT ID, NAME, ACTIVE FROM ITEMS ORDER BY NAME";
const COMMAND_READ_SINGLE_ITEM =
  "SELECT ID, NAME, ACTIVE FROM ITEMS WHERE ID = $1";
const COMMAND_DELETE_SINGLE_ITEM = "DELETE FROM ITEMS WHERE ID = $1";
const COMMAND_DELETE_MANY_ITEMS = "DELETE FROM ITEMS WHERE ID IN";
const COMMAND_UPDATE_SINGLE_ITEM =
  "UPDATE ITEMS SET NAME = $1, ACTIVE = $2 WHERE ID = $3";

const getAllItems = (res) => {
  const db = Sqlite.open(DB_NAME);
  console.log("Loading all items from database");
  const queryResult = db.execute(COMMAND_READ_ALL_ITEMS, []);
  let items = queryResult.rows.map((row) => {
    return {
      id: row["ID"],
      name: row["NAME"],
      active: row["ACTIVE"] == 1,
    };
  });
  console.log(`Loaded ${items.length} items from database`);
  return json(items);
};

const badRequest = (message) => {
  return text(message, { status: 400 });
};

const notFound = (message) => {
  return text(message, { status: 404 });
};

const getItemById = (id, res) => {
  if (!uuidValidate(id)) {
    return badRequest("Invalid identifier received via URL");
  }
  const db = Sqlite.open(DB_NAME);
  console.log(`Loading item with id ${id} from database`);
  let queryResult = db.execute(COMMAND_READ_SINGLE_ITEM, [id]);
  if (queryResult.rows.length == 0) {
    console.log(`Item with id ${id} not found in database`);
    return notFound(`No item found with id ${id}`);
  }
  let first = queryResult.rows[0];
  let found = {
    id: first["ID"],
    name: first["NAME"],
    active: first["ACTIVE"] == 1,
  };
  console.log(`Found item with id ${id} in database`);
  return json(found);
};

const deleteItemById = (id, res) => {
  if (!uuidValidate(id)) {
    return badRequest("Invalid identifier received via URL");
  }
  const db = Sqlite.open(DB_NAME);
  console.log(`Removing item with id ${id} from database`);
  db.execute(COMMAND_DELETE_SINGLE_ITEM, [id]);
  return json(null, { status: 204 });
};

const deleteManyItems = (requestBody, res) => {
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
  const db = Sqlite.open(DB_NAME);
  console.log(
    `Removing items with ids (${payload.ids.join(",")}) from database`,
  );
  db.execute(cmd, parameters);
  return json(null, { status: 204 });
};

const createItem = (baseUrl, requestBody, res) => {
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
  const db = Sqlite.open(DB_NAME);
  console.log(`Inserting new item (${payload.name}) in database`);
  db.execute(COMMAND_CREATE_ITEM, [
    newItem.id,
    newItem.name,
    newItem.active ? 1 : 0,
  ]);

  return json(newItem, {
    status: 201,
    headers: {
      "content-type": "application/json",
      location: `${baseUrl}/items/${newItem.id}`,
    },
  });
};

const updateItemById = (baseUrl, id, requestBody, res) => {
  let payload = JSON.parse(decoder.decode(requestBody));
  if (!payload || !payload.name || typeof payload.active != "boolean") {
    return badRequest(
      'Invalid payload received. Expecting {"name":"some name", "active": true}',
    );
  }
  if (!uuidValidate(id)) {
    return badRequest("Invalid identifier received via URL");
  }
  const db = Sqlite.open(DB_NAME);
  console.log(`Updating item with id ${id} in database`);
  let item = {
    id: id,
    name: payload.name,
    active: payload.active,
  };
  db.execute(COMMAND_UPDATE_SINGLE_ITEM, [
    item.name,
    item.active ? 1 : 0,
    item.id,
  ]);

  return json(item);
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
