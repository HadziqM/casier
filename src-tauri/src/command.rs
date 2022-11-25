pub mod crud;

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
pub async fn get_all(collection: String, host: String, port: i32, param: Option<String>) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.list_all(param).await
}
#[tauri::command]
pub async fn delete_all(collection: String, host: String, port: i32) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.delete_all().await
}
