## HTTP CRUD Sample

This is a sample implementation of CRUD (Create, Read, Update, Delete) in Go.

The sample is using SQLite for persistence and provides the following API endpoints via HTTP:

- `GET /items` - To retrieve a list of all items
- `GET /items/:id` - To retrieve a item using its identifier
- `POST /items` - To create a new item
- `PUT /items/:id` - To update an existing item using its identifier
- `DELETE /items/batch` - To delete multiple items providing an array of identifiers as payload
- `DELETE /items/:id` - To delete an existing item using its identifier

Send data to `POST /items` and `PUT /items/:id` using the following structure:

```jsonc
{
    "name": "item name",
    // boolean (either true or false)
    "active": true
}
```

## Supported Platforms

- Local (`spin up`) requires a running redis cache

## Prerequisites

To run the sample on your local machine, you must have the following software installed:

 - Latest [Spin](https://spinframework.dev) CLI
 - [TinyGo](https://tinygo.org/)

## Running this Sample 

### Local (`spin up`)

To run the sample locally, you must provide `@migrations.sql` using the `--sqlite` flag to seed the database as shown in the snippet below:

```bash
# Build the project
spin build

# Run the sample
spin up --sqlite @migrations.sql
Logging component stdio to ".spin/logs/"
Storing default SQLite data to ".spin/sqlite_db.db"

Serving http://127.0.0.1:3000
Available Routes:
  http-crud-go-sqlite: http://127.0.0.1:3000 (wildcard)
```
