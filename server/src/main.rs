#[macro_use]
extern crate tracing;

use axum::{
    Router,
    extract::{Json, Path, State},
    http::Method,
    routing::{get, post},
};
use clap::Parser;
use serde::Deserialize;
use serde_json::{Value, json};
use std::{collections::HashMap, net::SocketAddr, sync::Arc};
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};
use tracing::level_filters::LevelFilter;

#[derive(Parser)]
#[command(version, about, long_about = None)]
struct Command {
    /// Service port
    #[arg(long, env = "PORT", default_value_t = 9001)]
    port: u16,

    /// Apikey for auth
    #[arg(long, env = "APIKEY")]
    apikey: String,

    /// ZeroPay service
    #[arg(long, env = "SERVICE", default_value = "https://api.zpaynow.com")]
    zp: String,
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    tracing_subscriber::fmt()
        .with_max_level(LevelFilter::INFO)
        .init();

    let args = Command::parse();

    let mut products = HashMap::new();
    products.insert(1, 200); // $2
    products.insert(2, 1000); // $10

    let app_state = Arc::new(AppState {
        apikey: args.apikey,
        zp: args.zp,
        products,
    });

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_origin(Any)
        .allow_headers(Any);

    let router = Router::new()
        .route("/products", post(buy_product))
        .route("/sessions/{id}", get(fetch_session))
        .route("/webhook", post(webhook))
        .route("/x402/requirements", post(x402_requirements))
        .route("/x402/payments", post(x402_payment))
        //.route("/x402/support", get(x402_support))
        //.route("/x402/discovery", get(x402_discovery))
        .with_state(app_state)
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], args.port));
    let listener = TcpListener::bind(&addr).await.unwrap();
    info!("🚀 Server is running on 0.0.0.0:{}", args.port);

    axum::serve(listener, router).await.unwrap()
}

#[derive(Clone)]
struct AppState {
    zp: String,
    apikey: String,
    products: HashMap<i32, i32>,
}

#[derive(Deserialize)]
struct BuyForm {
    product: i32,
    email: String,
}

async fn buy_product(State(app): State<Arc<AppState>>, Json(form): Json<BuyForm>) -> Json<Value> {
    let price = if let Some(price) = app.products.get(&form.product) {
        *price
    } else {
        return Json(json!({ "error": "no product" }));
    };

    let data = json!({
        "customer": form.email,
        "amount": price,
    });

    let client = reqwest::Client::new();
    let url = format!("{}/sessions?apikey={}", app.zp, app.apikey);
    match client.post(url).json(&data).send().await {
        Ok(res) => match res.json().await {
            Ok(res) => Json(res),
            Err(_) => Json(json!({ "error": "response error" })),
        },
        Err(_) => Json(json!({ "error": "netowkr error" })),
    }
}

async fn fetch_session(State(app): State<Arc<AppState>>, Path(id): Path<i32>) -> Json<Value> {
    let url = format!("{}/sessions/{}?apikey={}", app.zp, id, app.apikey);
    match reqwest::get(url).await {
        Ok(res) => match res.json().await {
            Ok(res) => Json(res),
            Err(_) => Json(json!({ "error": "response error" })),
        },
        Err(_) => Json(json!({ "error": "netowkr error" })),
    }
}

async fn webhook() -> Json<Value> {
    Json(json!({ "status": "success" }))
}

async fn x402_requirements(State(app): State<Arc<AppState>>, Json(form): Json<BuyForm>) -> Json<Value> {
    let price = if let Some(price) = app.products.get(&form.product) {
        *price
    } else {
        return Json(json!({ "errorReason": "no product" }));
    };

    let data = json!({
        "customer": form.email,
        "amount": price,
    });

    let client = reqwest::Client::new();
    let url = format!("{}/x402/requirements?apikey={}", app.zp, app.apikey);
    match client.post(url).json(&data).send().await {
        Ok(res) => match res.json().await {
            Ok(res) => Json(res),
            Err(_) => Json(json!({ "errorReason": "response error" })),
        },
        Err(_) => Json(json!({ "errorReason": "netowkr error" })),
    }
}

async fn x402_payment(State(app): State<Arc<AppState>>, data: String) -> Json<Value> {
    let value: Value = if let Ok(value) = serde_json::from_str(&data) {
        value
    } else {
        return Json(json!({ "errorReason": "invalid data" }));
    };

    let client = reqwest::Client::new();
    let url = format!("{}/x402/payments?apikey={}", app.zp, app.apikey);
    match client.post(url).json(&value).send().await {
        Ok(res) => {
            match res.json().await {
                Ok(res) => Json(res),
                Err(_) => Json(json!({ "errorReason": "response error" })),
            }
        },
        Err(_) => Json(json!({ "errorReason": "netowkr error" })),
    }
}
