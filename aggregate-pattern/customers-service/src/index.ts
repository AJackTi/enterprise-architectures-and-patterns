import { Hono } from 'hono';
import type { Context } from 'hono'
import { getAllItems, getCustomerById, getCustomerCount, getTopCustomers } from './handlers';

let app = new Hono();

app.get("/customers/count", (c: Context) => getCustomerCount(c));
app.get("/customers/top/:limit", (c: Context) => getTopCustomers(c));
app.get("/customers/items", (c: Context) => getAllItems(c));
app.get("/customers/items/:id", (c: Context) => getCustomerById(c));

app.fire();

