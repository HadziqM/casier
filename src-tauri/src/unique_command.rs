use crate::crud;
use serde::{Deserialize, Serialize};
use tauri;
#[derive(Serialize, Deserialize)]
struct Cart {
    product: String,
    unit: i32,
}

#[derive(Serialize, Deserialize)]
struct ListCart {
    product: String,
    unit: i32,
    total: i128,
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
    total: i32,
    product: Vec<String>,
    full: bool,
    phone: Option<String>,
    address: Option<String>,
    debt: Option<i32>,
    due: Option<i32>,
}
#[derive(Serialize, Deserialize)]
struct TransactionList {
    items: Option<Vec<TransactionCreate>>,
}
#[derive(Serialize, Deserialize)]
struct InitialDataInput {
    product: String,
    cart: String,
    debt: String,
}
#[derive(Serialize, Deserialize)]
struct ProductUpdated {
    id: Option<String>,
    name: Option<String>,
    code: Option<i32>,
}
#[derive(Serialize)]
struct ProductCart {
    product: String,
    cart: String,
}
#[derive(Deserialize)]
struct CartProduct {
    stock: i32,
    price: i128,
}
#[derive(Deserialize)]
struct CartExpand {
    product: CartProduct,
}
#[derive(Deserialize)]
struct CartItem {
    product: String,
    unit: i32,
    expand: CartExpand,
}
#[derive(Deserialize)]
struct CartList {
    items: Option<Vec<CartItem>>,
}
#[derive(Serialize, Deserialize)]
struct CartDebt {
    cart: String,
    debt: String,
}
async fn get_prod_cart(con: &crud::Collection) -> String {
    let output = ProductCart {
        product: crud::Table::Product.list_all(con, Some("sort=name")).await,
        cart: crud::Table::Cart
            .list(con, Some("sort=-created&expand=product"))
            .await,
    };
    serde_json::to_string(&output).unwrap()
}
async fn get_cart_debt(con: &crud::Collection) -> String {
    let full_data = CartDebt {
        cart: crud::Table::Cart
            .list(con, Some("sort=-created&expand=product"))
            .await,
        debt: crud::Table::Transaction
            .list_all(con, Some("sort=-created&expand=customer,product.product"))
            .await,
    };
    serde_json::to_string(&full_data).unwrap()
}
#[tauri::command]
pub async fn buy_update(host: String, port: u16, rest: i32, unit: i32, id: String) -> String {
    let con = crud::Collection { host, port };
    crud::Table::Product
        .update(
            &con,
            &id,
            ["{\"stock\":", &rest.to_string(), "}"].concat().as_str(),
        )
        .await;
    let data_cart = Cart {
        product: String::from(&id),
        unit,
    };
    #[derive(Deserialize)]
    struct CheckId {
        id: String,
        unit: i32,
    }
    #[derive(Deserialize)]
    struct Checked {
        items: Vec<CheckId>,
    }
    let cart_check: Checked = serde_json::from_str(
        &crud::Table::Cart
            .list(&con, Some(&format!("filter=(product='{}')", &id)))
            .await,
    )
    .unwrap();
    if cart_check.items.len() == 0 {
        crud::Table::Cart
            .create(&con, &serde_json::to_string(&data_cart).unwrap())
            .await;
    } else {
        crud::Table::Cart
            .update(
                &con,
                &cart_check.items[0].id,
                [
                    "{\"unit\":",
                    (cart_check.items[0].unit + unit).to_string().as_ref(),
                    "}",
                ]
                .concat()
                .as_str(),
            )
            .await;
    }
    get_prod_cart(&con).await
}

#[tauri::command]
pub async fn transaction_all_debt(
    host: String,
    port: u16,
    name: String,
    paid: i32,
    total: i32,
    address: Option<String>,
    telp: Option<String>,
    due: Option<i32>,
) -> String {
    let con = crud::Collection { host, port };
    #[derive(Serialize, Deserialize)]
    struct HistoryData {
        id: Option<String>,
        total: i128,
        product: String,
        unit: i32,
    }
    //Create Transaction History and Delete the Cart
    let mut history_id: Vec<String> = Vec::new();
    let cart_data: CartList = serde_json::from_str(
        &crud::Table::Cart
            .list_all(&con, Some("sort=-created&expand=product"))
            .await,
    )
    .unwrap();
    match cart_data.items {
        Some(items) => {
            for item in &items {
                let history_data = HistoryData {
                    total: item.expand.product.price * item.unit as i128,
                    product: item.product.to_owned(),
                    unit: item.unit,
                    id: None,
                };
                let history_create: HistoryData = serde_json::from_str(
                    &crud::Table::History
                        .create(&con, &serde_json::to_string(&history_data).unwrap())
                        .await,
                )
                .unwrap();
                history_id.push(history_create.id.unwrap())
            }
            crud::Table::Cart.delete_all(&con, None).await;
        }
        None => return "{\"error\":400}".to_string(),
    }
    //Create Transaction Data Given input
    if total > paid {
        let transaction_data = TransactionCreate {
            customer: name.to_owned(),
            total,
            full: false,
            debt: Some(total - paid),
            due,
            product: history_id,
            address: address.to_owned(),
            phone: telp.to_owned(),
        };
        crud::Table::Transaction
            .create(&con, &serde_json::to_string(&transaction_data).unwrap())
            .await;
    } else {
        let transaction_data = TransactionCreate {
            customer: name.to_owned(),
            total,
            full: true,
            debt: None,
            due: None,
            product: history_id,
            address: address.to_owned(),
            phone: telp.to_owned(),
        };
        crud::Table::Transaction
            .create(&con, &serde_json::to_string(&transaction_data).unwrap())
            .await;
    };
    get_cart_debt(&con).await
}
#[tauri::command]
pub async fn debt_collected(host: String, port: u16, id: String, paid: i32) -> String {
    let con = crud::Collection { host, port };
    let transactin_data: TransactionList = serde_json::from_str(
        &crud::Table::Transaction
            .list(&con, Some(&format!("filter=(id='{}')", &id)))
            .await,
    )
    .unwrap();
    let vec_data = transactin_data.items.unwrap();
    if vec_data[0].debt.as_ref().unwrap() > &paid {
        crud::Table::Transaction
            .update(
                &con,
                &id,
                [
                    "{\"debt\":",
                    (vec_data[0].debt.as_ref().unwrap() - &paid)
                        .to_string()
                        .as_ref(),
                    "}",
                ]
                .concat()
                .as_str(),
            )
            .await;
    } else {
        crud::Table::Transaction
            .update(&con, &id, "{\"debt\":0,\"full\":true}")
            .await;
    }
    crud::Table::Transaction
        .list_all(&con, Some("sort=-created&expand=customer,product.product"))
        .await
}
#[tauri::command]
pub async fn get_all_data(host: String, port: u16) -> String {
    let connection = crud::Collection { port, host };
    let full_data = InitialDataInput {
        product: crud::Table::Product
            .list_all(&connection, Some("sort=name"))
            .await,
        cart: crud::Table::Cart
            .list_all(&connection, Some("sort=-created&expand=product"))
            .await,
        debt: crud::Table::Transaction
            .list_all(
                &connection,
                Some("sort=-created&expand=customer,product.product"),
            )
            .await,
    };
    serde_json::to_string(&full_data).unwrap()
}
#[tauri::command]
pub async fn delete_update(host: String, port: u16, id: String, unit: i32, pid: String) -> String {
    let con = crud::Collection { host, port };
    crud::Table::Cart.delete(&con, &id).await;
    crud::Table::Product
        .update(
            &con,
            &pid,
            ["{\"stock\":", unit.to_string().as_ref(), "}"]
                .concat()
                .as_str(),
        )
        .await;
    get_prod_cart(&con).await
}
#[tauri::command]
pub async fn cencel_all(host: String, port: u16) -> String {
    let con = crud::Collection {
        host: String::from(&host),
        port,
    };
    let cart_data: CartList =
        serde_json::from_str(&crud::Table::Cart.list(&con, Some("expand=product")).await).unwrap();
    if cart_data.items.is_some() {
        for cart_list in &cart_data.items.unwrap() {
            crud::Table::Product
                .update(
                    &con,
                    cart_list.product.as_str(),
                    [
                        "{\"stock\":",
                        (cart_list.unit + cart_list.expand.product.stock)
                            .to_string()
                            .as_ref(),
                        "}",
                    ]
                    .concat()
                    .as_str(),
                )
                .await;
        }
        crud::Table::Cart.delete_all(&con, None).await;
        get_prod_cart(&con).await
    } else {
        "{\"error\":400}".to_string()
    }
}
#[tauri::command]
pub async fn change_update(
    host: String,
    port: u16,
    rest: i32,
    unit: i32,
    id: String,
    cid: String,
) -> String {
    let con = crud::Collection { host, port };
    crud::Table::Product
        .update(
            &con,
            &id,
            ["{\"stock\":", rest.to_string().as_ref(), "}"]
                .concat()
                .as_str(),
        )
        .await;
    crud::Table::Cart
        .update(
            &con,
            &cid,
            ["{\"unit\":", unit.to_string().as_ref(), "}"]
                .concat()
                .as_str(),
        )
        .await;
    get_prod_cart(&con).await
}
