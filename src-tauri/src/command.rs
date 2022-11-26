pub mod crud;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
struct Cart {
    product: String,
    unit: i32,
}
#[derive(Serialize, Deserialize)]
struct Customer {
    id: Option<String>,
    name: String,
    address: Option<String>,
    bought: i32,
}
impl Customer {
    fn change_bought(&mut self, bought: i32) {
        self.bought = bought;
    }
}
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CustomerData {
    total_items: i32,
    items: Vec<Customer>,
}
#[derive(Serialize, Deserialize)]
struct Company {
    name: String,
    customer: String,
}
#[derive(Serialize, Deserialize)]
struct ListCart {
    id: String,
    unit: i32,
    total: i128,
}
#[derive(Serialize, Deserialize)]
struct Nota {
    total: i128,
    items: Vec<ListCart>,
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
#[tauri::command]
pub async fn transaction_all(
    host: String,
    port: i32,
    data: String,
    name: String,
    paid: i128,
    address: Option<String>,
    company: Option<String>,
    due: Option<i128>,
) -> String {
    let new_data: Nota = serde_json::from_str(&data).unwrap();
    let customer_data = Customer {
        id: None,
        name: String::from(&name),
        address,
        bought: 1,
    };
    let customer_struct = crud::Collection {
        host: String::from(&host),
        port,
        collection: "customer".to_string(),
    };
    let mut new_id = String::new();
    let check: CustomerData = serde_json::from_str(&customer_struct.list(Some(format!("filter=(name='{}')", String::from(&name)))).await).unwrap();
    if check.total_items == 0 {
        let get_id:Customer = ;
    } else {
        customer_data.change_bought(check.items[0].bought.unwrap()+1);
        new_id.push_str(&customer_struct.update(check.items[0].id.unwrap(), serde_json::to_string(&customer_data).unwrap()).await);
    }
    if company.is_some() {}
}
