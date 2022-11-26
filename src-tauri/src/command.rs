pub mod crud;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
struct Cart {
    product: String,
    unit: i32,
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
pub async fn list_data(
    collection: String,
    host: String,
    port: i32,
    param: Option<String>,
) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.list(param).await
}
#[tauri::command]
pub async fn select_data(collection: String, host: String, port: i32, id: String) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.select(id).await
}
#[tauri::command]
pub async fn delete_data(collection: String, host: String, port: i32, id: String) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.delete(id).await
}
#[tauri::command]
pub async fn create_data(collection: String, host: String, port: i32, data: String) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.create(data).await
}
#[tauri::command]
pub async fn update_data(
    collection: String,
    host: String,
    port: i32,
    data: String,
    id: String,
) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.update(id, data).await
}
#[tauri::command]
pub async fn update_or_create(
    collection: String,
    host: String,
    port: i32,
    data: String,
    id: String,
) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.update_or_create(id, data).await
}
#[tauri::command]
pub async fn get_all(collection: String, host: String, port: i32, param: Option<String>) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.list_all(param).await
}
#[tauri::command]
pub async fn delete_all(
    collection: String,
    host: String,
    port: i32,
    param: Option<String>,
) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.delete_all(param).await
}
#[tauri::command]
pub async fn buy_update(host: String, port: i32, rest: i32, unit: i32, id: String) -> String {
    let user = crud::Collection {
        host: String::from(&host),
        port,
        collection: "product".to_string(),
    };
    user.update(
        String::from(&id),
        ["{\"stock\":", &rest.to_string(), "}"].concat(),
    )
    .await;
    let second = crud::Collection {
        host: String::from(&host),
        port,
        collection: "cart".to_string(),
    };
    let data_cart = Cart {
        product: String::from(&id),
        unit,
    };
    second
        .create(serde_json::to_string(&data_cart).unwrap())
        .await;
    second.list_all(Some("expand=product".to_string())).await
}
