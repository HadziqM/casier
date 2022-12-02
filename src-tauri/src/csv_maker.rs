use crate::crud;
use csv;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, PartialEq)]
struct TransactionItems {
    id: String,
    name: String,
    customer: String,
    total: i64,
    product: Vec<String>,
    full: bool,
    phone: Option<String>,
    address: Option<String>,
    debt: Option<i32>,
    due: Option<i32>,
    created: String,
}
#[derive(Serialize, Deserialize, PartialEq)]
struct ProductExtend {
    name: String,
    price: i64,
    stock: i64,
}
#[derive(Serialize, Deserialize, PartialEq)]
struct Extend {
    product: ProductExtend,
}
#[derive(Serialize, Deserialize, PartialEq)]
struct HistoryItems {
    created: String,
    total: i64,
    unit: i32,
    id: String,
    expand: Extend,
}
#[derive(Serialize, Deserialize, PartialEq)]
struct HistoryList {
    items: Option<Vec<HistoryItems>>,
}
#[derive(Serialize, Deserialize, PartialEq)]
struct TransactionList {
    items: Option<Vec<TransactionItems>>,
}
#[derive(Serialize, Deserialize, PartialEq)]
struct Analytic {
    money: i64,
    debt: i64,
}
#[tauri::command]
pub async fn csv_history_writer(
    host: String,
    port: i32,
    start: String,
    stop: String,
    dir: String,
) -> String {
    let con = crud::Collection { port, host };
    let history_data: HistoryList = serde_json::from_str(
        &crud::Table::History
            .list_all(
                &con,
                Some(&format!("expand=product&filter=(created<'{}')", &stop)),
            )
            .await,
    )
    .unwrap();
    let history_check: HistoryList = serde_json::from_str(
        &crud::Table::History
            .list_all(
                &con,
                Some(&format!("expand=product&filter=(created>'{}')", &start)),
            )
            .await,
    )
    .unwrap();
    let mut writer = csv::Writer::from_path(dir).expect("idk");
    writer
        .write_record(&["id", "name", "bought", "total", "date"])
        .expect("idk");
    match history_data.items {
        Some(_) => match history_check.items {
            Some(_) => {
                let idk_why = &history_check.items.unwrap();
                for data in &history_data.items.unwrap() {
                    if idk_why.contains(data) {
                        writer
                            .write_record(&[
                                data.id.to_owned(),
                                data.expand.product.name.to_owned(),
                                data.unit.to_string(),
                                data.total.to_string(),
                                data.created.to_owned(),
                            ])
                            .expect("idk");
                    }
                }
                writer.flush().expect("idk");
                "success".to_string()
            }
            None => "failed".to_string(),
        },
        None => "failed".to_string(),
    }
}
#[tauri::command]
pub async fn analyze(host: String, port: i32, start: String, stop: String) -> String {
    let con = crud::Collection { port, host };
    let transaction_data: TransactionList = serde_json::from_str(
        &crud::Table::Transaction
            .list_all(&con, Some(&format!("filter=(created<'{}')", &stop)))
            .await,
    )
    .unwrap();
    let transaction_check: TransactionList = serde_json::from_str(
        &crud::Table::Transaction
            .list_all(&con, Some(&format!("filter=(created>'{}')", &start)))
            .await,
    )
    .unwrap();
    let mut money: i64 = 0;
    let mut debt: i64 = 0;
    match transaction_data.items {
        Some(_) => match transaction_check.items {
            Some(_) => {
                let checker = &transaction_check.items.unwrap();
                for data in &transaction_data.items.unwrap() {
                    if checker.contains(data) {
                        money += data.total as i64;
                        debt += data.debt.unwrap_or(0) as i64;
                    }
                }
                let out_data = Analytic { debt, money };
                serde_json::to_string(&out_data).unwrap()
            }
            None => "failed".to_string(),
        },
        None => "failed".to_string(),
    }
}
#[tauri::command]
pub async fn csv_transaction_writer(
    host: String,
    port: i32,
    start: String,
    stop: String,
    dir: String,
) -> String {
    let con = crud::Collection { port, host };
    let transaction_data: TransactionList = serde_json::from_str(
        &crud::Table::Transaction
            .list_all(&con, Some(&format!("filter=(created<'{}')", &stop)))
            .await,
    )
    .unwrap();
    let transaction_check: TransactionList = serde_json::from_str(
        &crud::Table::Transaction
            .list_all(&con, Some(&format!("filter=(created>'{}')", &start)))
            .await,
    )
    .unwrap();
    let mut writer = csv::Writer::from_path(dir).expect("idk");
    writer
        .write_record(&[
            "id", "name", "full", "total", "debt", "date", "phone", "address",
        ])
        .expect("idk");
    let mut money: i64 = 0;
    let mut debt: i64 = 0;
    match transaction_data.items {
        Some(_) => match transaction_check.items {
            Some(_) => {
                let checker = &transaction_check.items.unwrap();
                for data in &transaction_data.items.unwrap() {
                    if checker.contains(data) {
                        money += data.total as i64;
                        debt += data.debt.unwrap_or(0) as i64;
                        let full_data = match data.full {
                            true => "yes".to_string(),
                            false => "no".to_string(),
                        };
                        writer
                            .write_record(&[
                                data.id.to_owned(),
                                data.name.to_owned(),
                                full_data,
                                data.total.to_string(),
                                data.debt.unwrap_or(0).to_string(),
                                data.created.to_owned(),
                                data.phone.to_owned().unwrap_or("no phone".to_string()),
                                data.address.to_owned().unwrap_or("no address".to_string()),
                            ])
                            .expect("idk");
                    }
                }
                writer.flush().expect("idk");
                let out_data = Analytic { debt, money };
                serde_json::to_string(&out_data).unwrap()
            }
            None => "failed".to_string(),
        },
        None => "failed".to_string(),
    }
}
