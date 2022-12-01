use crate::command::crud;
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
async fn get_prod_cart(product: crud::Collection, cart: crud::Collection) -> String {
    let output = ProductCart {
        product: product.list_all(Some("sort=name".to_string())).await,
        cart: cart
            .list(Some("sort=-created&expand=product".to_string()))
            .await,
    };
    serde_json::to_string(&output).unwrap()
}
async fn get_prod_cart_debt(
    product: crud::Collection,
    cart: crud::Collection,
    debt: crud::Collection,
) -> String {
    let full_data = InitialDataInput {
        product: product.list_all(Some("sort=name".to_string())).await,
        cart: cart
            .list(Some("sort=-created&expand=product".to_string()))
            .await,
        debt: debt
            .list_all(Some(
                "sort=-created&expand=customer,product.product".to_string(),
            ))
            .await,
    };
    serde_json::to_string(&full_data).unwrap()
}
async fn get_cart_debt(cart: crud::Collection, debt: crud::Collection) -> String {
    #[derive(Serialize, Deserialize)]
    struct CartDebt {
        cart: String,
        debt: String,
    }
    let full_data = CartDebt {
        cart: cart
            .list(Some("sort=-created&expand=product".to_string()))
            .await,
        debt: debt
            .list_all(Some(
                "sort=-created&expand=customer,product.product".to_string(),
            ))
            .await,
    };
    serde_json::to_string(&full_data).unwrap()
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
        &second
            .list(Some(format!("filter=(product='{}')", &id)))
            .await,
    )
    .unwrap();
    if cart_check.items.len() == 0 {
        second
            .create(serde_json::to_string(&data_cart).unwrap())
            .await;
    } else {
        second
            .update(
                String::from(&cart_check.items[0].id),
                [
                    "{\"unit\":",
                    (cart_check.items[0].unit + unit).to_string().as_ref(),
                    "}",
                ]
                .concat(),
            )
            .await;
    }
    get_prod_cart(user, second).await
}

#[tauri::command]
pub async fn transaction_all_debt(
    host: String,
    port: i32,
    name: String,
    paid: i32,
    total: i32,
    address: Option<String>,
    telp: Option<String>,
    due: Option<i32>,
) -> String {
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
    let cart = crud::Collection {
        host: String::from(&host),
        port,
        collection: "cart".to_string(),
    };
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
        &cart
            .list_all(Some("sort=-created&expand=product".to_string()))
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
                    &history
                        .create(serde_json::to_string(&history_data).unwrap())
                        .await,
                )
                .unwrap();
                history_id.push(history_create.id.unwrap())
            }
            cart.delete_all(None).await;
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
        transaction_struct
            .create(serde_json::to_string(&transaction_data).unwrap())
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
        transaction_struct
            .create(serde_json::to_string(&transaction_data).unwrap())
            .await;
    };
    get_cart_debt(cart, transaction_struct).await
}
#[tauri::command]
pub async fn debt_collected(host: String, port: i32, id: String, paid: i32) -> String {
    let transaction_struct = crud::Collection {
        host,
        port,
        collection: "transaction".to_string(),
    };
    let transactin_data: TransactionList = serde_json::from_str(
        &transaction_struct
            .list(Some(format!("filter=(id='{}')", &id)))
            .await,
    )
    .unwrap();
    let vec_data = transactin_data.items.unwrap();
    if vec_data[0].debt.as_ref().unwrap() > &paid {
        transaction_struct
            .update(
                String::from(&id),
                [
                    "{\"debt\":",
                    (vec_data[0].debt.as_ref().unwrap() - &paid)
                        .to_string()
                        .as_ref(),
                    "}",
                ]
                .concat(),
            )
            .await;
    } else {
        transaction_struct
            .update(String::from(&id), "{\"debt\":0,\"full\":true}".to_string())
            .await;
    }
    transaction_struct
        .list_all(Some(
            "sort=-created&expand=customer,product.product".to_string(),
        ))
        .await
}
#[tauri::command]
pub async fn get_all_data(host: String, port: i32) -> String {
    let product = crud::Collection {
        host: String::from(&host),
        port,
        collection: "product".to_string(),
    };
    let cart = crud::Collection {
        host: String::from(&host),
        port,
        collection: "cart".to_string(),
    };
    let debt = crud::Collection {
        host: String::from(&host),
        port,
        collection: "transaction".to_string(),
    };
    get_prod_cart_debt(product, cart, debt).await
}
#[tauri::command]
pub async fn delete_update(host: String, port: i32, id: String, unit: i32, pid: String) -> String {
    let cart = crud::Collection {
        host: String::from(&host),
        port,
        collection: "cart".to_string(),
    };
    let product = crud::Collection {
        host: String::from(&host),
        port,
        collection: "product".to_string(),
    };
    cart.delete(String::from(&id)).await;
    product
        .update(
            pid,
            ["{\"stock\":", unit.to_string().as_ref(), "}"].concat(),
        )
        .await;
    get_prod_cart(product, cart).await
}
#[tauri::command]
pub async fn cencel_all(host: String, port: i32) -> String {
    let cart = crud::Collection {
        host: String::from(&host),
        port,
        collection: "cart".to_string(),
    };
    let product = crud::Collection {
        host: String::from(&host),
        port,
        collection: "product".to_string(),
    };
    let cart_data: CartList =
        serde_json::from_str(&cart.list(Some("expand=product".to_string())).await).unwrap();
    if cart_data.items.is_some() {
        for cart_list in &cart_data.items.unwrap() {
            product
                .update(
                    cart_list.product.to_owned(),
                    [
                        "{\"stock\":",
                        (cart_list.unit + cart_list.expand.product.stock)
                            .to_string()
                            .as_ref(),
                        "}",
                    ]
                    .concat(),
                )
                .await;
        }
        cart.delete_all(None).await;
        get_prod_cart(product, cart).await
    } else {
        "{\"error\":400}".to_string()
    }
}
#[tauri::command]
pub async fn change_update(
    host: String,
    port: i32,
    rest: i32,
    unit: i32,
    id: String,
    cid: String,
) -> String {
    let product = crud::Collection {
        host: host.to_owned(),
        port,
        collection: "product".to_string(),
    };
    let cart = crud::Collection {
        host: host.to_owned(),
        port,
        collection: "cart".to_string(),
    };
    product
        .update(
            id.to_owned(),
            ["{\"stock\":", rest.to_string().as_ref(), "}"].concat(),
        )
        .await;
    cart.update(
        cid.to_owned(),
        ["{\"unit\":", unit.to_string().as_ref(), "}"].concat(),
    )
    .await;
    get_prod_cart(product, cart).await
}
