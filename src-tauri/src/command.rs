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
    product: String,
    unit: i32,
    total: i128,
}
#[derive(Serialize, Deserialize)]
struct Nota {
    total: i128,
    items: Vec<ListCart>,
}
#[derive(Serialize, Deserialize)]
struct CompanyCreate {
    customer: String,
    name: String,
}
#[derive(Serialize, Deserialize)]
struct HistoryCreate {
    code: Option<i32>,
    error: Option<i32>,
    id: Option<String>,
}
#[derive(Serialize, Deserialize)]
struct TransactionCreate {
    customer: String,
    total: i128,
    paid: i128,
    product: Vec<String>,
    full: bool,
    debt: Option<i128>,
    due: Option<i128>,
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
    // customer-> company -> history -> transaction
    let customer_struct = crud::Collection {
        host: String::from(&host),
        port,
        collection: "customer".to_string(),
    };
    let history = crud::Collection {
        host: String::from(&host),
        port,
        collection: "history".to_string(),
    };
    let transaction_struct = crud::Collection {
        host: String::from(&host),
        port,
        collection: "transaction".to_string(),
    };
    let new_data: Nota = serde_json::from_str(&data).unwrap();
    let mut customer_data = Customer {
        id: None,
        name: String::from(&name),
        address,
        bought: 1,
    };
    let mut new_id = String::new();
    let check: CustomerData = serde_json::from_str(
        &customer_struct
            .list(Some(format!("filter=(name='{}')", String::from(&name))))
            .await,
    )
    .unwrap();
    if check.total_items == 0 {
        let get_id: Customer = serde_json::from_str(
            &customer_struct
                .create(serde_json::to_string(&customer_data).unwrap())
                .await,
        )
        .unwrap();
        new_id.push_str(&get_id.id.unwrap());
    } else {
        customer_data.change_bought(check.items[0].bought + 1);
        let first_item = check.items[0].id.as_ref().unwrap();
        new_id.push_str(
            &customer_struct
                .update(
                    String::from(first_item),
                    serde_json::to_string(&customer_data).unwrap(),
                )
                .await,
        );
    }
    if company.is_some() {
        let company_struct = crud::Collection {
            host: String::from(&host),
            port,
            collection: "company".to_string(),
        };
        let company_data = CompanyCreate {
            name: company.unwrap(),
            customer: String::from(&new_id),
        };
        company_struct
            .create(serde_json::to_string(&company_data).unwrap())
            .await;
    }
    let mut new_vect_id: Vec<String> = Vec::new();
    for i in &new_data.items {
        let history_data: HistoryCreate = serde_json::from_str(
            &history
                .create(serde_json::to_string(i.to_owned()).unwrap())
                .await,
        )
        .unwrap();
        if history_data.error.is_some() {
            return String::from("{\"error\":400}");
        } else if history_data.code.is_some() {
            return String::from("{\"error\":400}");
        } else {
            new_vect_id.push(history_data.id.unwrap());
        }
    }
    if new_data.total > paid {
        let transaction_data = TransactionCreate {
            customer: String::from(&new_id),
            total: new_data.total,
            paid,
            full: false,
            debt: Some(new_data.total - paid),
            due,
            product: new_vect_id,
        };
        transaction_struct
            .create(serde_json::to_string(&transaction_data).unwrap())
            .await;
    } else {
        let transaction_data = TransactionCreate {
            customer: String::from(&new_id),
            total: new_data.total,
            paid,
            full: true,
            debt: None,
            due: None,
            product: new_vect_id,
        };
        transaction_struct
            .create(serde_json::to_string(&transaction_data).unwrap())
            .await;
    }
    transaction_struct
        .list_all(Some("filter=(full=false)".to_string()))
        .await
}
