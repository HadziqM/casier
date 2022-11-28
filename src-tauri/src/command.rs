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
async fn get_prod_cart(product: crud::Collection, cart: crud::Collection) -> String {
    let output = ProductCart {
        product: product.list_all(Some("sort=name".to_string())).await,
        cart: cart
            .list(Some("sort=-created&expand=product".to_string()))
            .await,
    };
    serde_json::to_string(&output).unwrap()
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
        .list_all(Some("filter=(full=false)&sort=-due".to_string()))
        .await
}
#[tauri::command]
pub async fn debt_collected(host: String, port: i32, id: String, paid: i128) -> String {
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
            "filter=(full=false)&sort=-due&expand=customer".to_string(),
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
    let full_data = InitialDataInput {
        product: product.list_all(Some("sort=name".to_string())).await,
        cart: cart
            .list(Some("sort=-created&expand=product".to_string()))
            .await,
        debt: debt
            .list_all(Some(
                "filter=(full=false)&sort=-due&expand=customer".to_string(),
            ))
            .await,
    };
    serde_json::to_string(&full_data).unwrap()
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
    #[derive(Deserialize)]
    struct CartProduct {
        stock: i32,
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
