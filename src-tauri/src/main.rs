#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#[derive(Deserialize)]
struct For_vect {
    collectionId: String,
    collectionName: String,
    created: String,
    created_at: String,
    field: String,
    id: String,
    money: u128,
    updated: String,
    username: String,
}

#[derive(Deserialize)]
struct User {
    page: i32,
    perPage: i32,
    totalItems: i32,
    totalPages: i32,
    items: Vec<For_vect>,
}

use reqwest;
use serde::{Deserialize, Serialize};
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem};
use tauri::{Manager, SystemTrayEvent};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
async fn get_user(url: String) -> String {
    let mut some_string = String::from(&url);
    some_string.push_str("/api/collections/user/records");
    let client = reqwest::Client::new();
    let resp = client
        .get(&some_string)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .expect("failed");
    format!("{}", resp)
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
        .add_item(show);
    let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .system_tray(system_tray)
        .invoke_handler(tauri::generate_handler![get_user, greet])
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = match app.get_window("main") {
                    Some(window) => match window.is_visible().expect("winvis") {
                        true => {
                            // hide the window instead of closing due to processes not closing memory leak: https://github.com/tauri-apps/wry/issues/590
                            window.hide().expect("winhide");
                            // window.close().expect("winclose");
                            return;
                        }
                        false => window.show().expect("error"),
                    },
                    None => return,
                };
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().expect("error");
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().expect("error");
                }
                _ => {}
            },
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
