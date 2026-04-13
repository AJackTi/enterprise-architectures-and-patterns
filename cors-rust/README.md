# Cross-Origin Resource Sharing (CORS)

This folder contains an HTTP API (written in Rust) with CORS support.

## What is Cross-Origin Resource Sharing (CORS)?

CORS, or Cross-Origin Resource Sharing, is a security mechanism implemented by web browsers to control access to resources located on different domains. As an API developer, understanding CORS is crucial when building web APIs that need to be accessed by client-side scripts from web browsers. CORS prevents a web page from making requests to a different domain than the one that served the page, known as the same-origin policy, unless explicitly permitted. This restriction helps mitigate certain types of cross-site scripting (XSS) attacks.

To enable cross-origin requests, you need to configure their servers to include specific HTTP headers in their responses. These headers, such as `Access-Control-Allow-Origin`, indicate which domains are allowed to access the API's resources. By setting appropriate CORS headers, you can define the level of access permitted, whether it's open to all origins (`*`) or limited to specific domains. Additionally, you should be aware that preflight requests may be sent by the browser for certain types of requests, such as those with custom headers or methods, and they need to handle these preflight requests appropriately to ensure seamless communication between client-side scripts and the API.

## Supported Platforms

- Local (`spin up`)
- [SpinKube](https://spinkube.dev)
- Akamai Functions

## Prerequisites

To use this sample you must have

- [Rust](https://www.rust-lang.org/) installed on your machine
  - The `wasm32-wasip1` target for Rust installed (`rustup target add wasm32-wasip1`)
- [Spin](https://spinframework.dev) CLI installed on your machine

## CORS Configuration

You can configure CORS according to your needs in [`spin.toml`](./spin.toml).
The API exposes the following endpoints

- `OPTIONS /*` - Handler for CORS preflight requests
- `GET /items` - Returns a list of items
- `POST /items` - Create a new item
- `DELETE /items/:id` - Delete an item using its identifier

All endpoints above return necessary HTTP response headers according to the CORS specification.

## Running the Sample

### Local (`spin up`)

To run the sample locally, follow the steps shown in the snippet below:

```bash
# Build the project
spin build

# Run the sample
spin up --sqlite @migrations.sql
Logging component stdio to ".spin/logs/"
Storing default SQLite data to ".spin/sqlite_db.db"

Serving http://127.0.0.1:3000
Available Routes:
  cors-rust: http://127.0.0.1:3000 (wildcard)
```

#### Overriding Allowed CORS Origins 

The Spin Manifest (`spin.toml`) defines a variable to inject allowed CORS origins using different variable providers (e.g., Environment Variables), allowing you to configure those origins without having to re-compile the app. 

See the following command, starting the same app but specifying different allowed CORS origins using the Spin Environment Variable Provider:

```bash
# Start the App with different allowed CORS origins
SPIN_VARIABLE_ALLOWED_ORIGINS=http://localhost:4200,http://localhost:5000 spin up --build --sqlite @migrations.sql
```

### Akamai Functions

You can deploy this sample to Akamai Functions following the steps below:

```bash
# Authenticate
spin aka login

# Deploy the sample to Akamai Funcitons
spin aka deploy
```
