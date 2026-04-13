use models::Item;
use spin_contrib_http::cors::{
    CorsConfig, CorsResponseBuilder, CorsRouter, ALL_HEADERS, ALL_METHODS, NO_ORIGINS,
};
use spin_contrib_http::request::Contrib;
use spin_sdk::http::{IntoResponse, Params, Request, Response, ResponseBuilder, Router};
use spin_sdk::{http_component, variables};

use crate::models::{Items, NewItemModel};

mod models;
fn load_cors_config() -> CorsConfig {
    CorsConfig::new(
        variables::get("cors_allowed_origins").unwrap_or(NO_ORIGINS.into()),
        variables::get("cors_allowed_methods").unwrap_or(ALL_METHODS.into()),
        variables::get("cors_allowed_headers").unwrap_or(ALL_HEADERS.into()),
        variables::get("cors_allow_credentials")
            .unwrap_or("true".to_string())
            .parse()
            .unwrap_or(true),
        variables::get("cors_max_age")
            .ok()
            .and_then(|v| v.parse::<u32>().ok()),
    )
}

#[http_component]
fn handle_api(req: Request) -> anyhow::Result<impl IntoResponse> {
    let cfg = load_cors_config();
    println!("Using CORS config: {:?}", cfg);
    let mut router = Router::default();
    router.register_options_handler(&cfg);
    router.get("/items", get_items);
    router.post("/items", post_item);
    router.delete("/items/:id", delete_item);

    println!("Handing {:?} {:?}", req.method(), req.uri());
    let method = &req.method().clone();
    let request_origin = req.get_header_value_as_string("origin");

    Ok(router
        .handle(req)
        .into_builder()
        .build_with_cors(method, request_origin, &cfg))
}

fn get_items(_: Request, _: Params) -> anyhow::Result<impl IntoResponse> {
    let items = Items::load()?;
    Ok(ResponseBuilder::new(200)
        .header("content-type", "application/json")
        .body(items)
        .build())
}

fn post_item(req: Request, _params: Params) -> anyhow::Result<impl IntoResponse> {
    let Ok(payload) = serde_json::from_slice::<NewItemModel>(req.body()) else {
        return Ok(Response::new(500, "invalid payload received"));
    };
    let mut items = Items::load()?;
    let new_item = Item {
        id: items.next_id(),
        name: payload.name.clone(),
    };
    items.add(new_item.clone());
    Items::save(&items)?;
    Ok(ResponseBuilder::new(201)
        .header("location", format!("/items/{}", new_item.id))
        .build())
}

fn delete_item(_: Request, params: Params) -> anyhow::Result<impl IntoResponse> {
    let Some(id) = params.get("id") else {
        return Ok(Response::new(404, ()));
    };

    let Ok(id) = id.parse::<i64>() else {
        return Ok(Response::new(400, ()));
    };

    let mut items = Items::load()?;
    items.delete_by_id(id);
    Items::save(&items)?;
    Ok(Response::new(204, ()))
}
