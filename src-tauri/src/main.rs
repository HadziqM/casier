#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod crud;

// use reqwest;
// use serde::{Deserialize, Serialize};
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem};
use tauri::{Manager, SystemTrayEvent};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
async fn list_data(collection: String, host: String, port: i32, param: Option<String>) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.list(param)
}
#[tauri::command]
async fn select_data(collection: String, host: String, port: i32, id: String) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.select(id)
}
#[tauri::command]
async fn delete_data(collection: String, host: String, port: i32, id: String) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.delete(id)
}
#[tauri::command]
async fn create_data(collection: String, host: String, port: i32, data: String) -> String {
    let user = crud::Collection {
        host,
        port,
        collection,
    };
    user.create(data)
}
#[tauri::command]
async fn update_data(
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
    user.update(id, data)
}

fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("hide".to_string(), "Hide/Show"))
        // .add_item(CustomMenuItem::new(
        //     "resize".to_string(),
        //     "Maximize/Minimize",
        // ))
        .add_item(CustomMenuItem::new(
            "window".to_string(),
            "Fullscreen/Window",
        ));
    let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .system_tray(system_tray)
        .invoke_handler(tauri::generate_handler![
            greet,
            list_data,
            create_data,
            update_data,
            delete_data,
            select_data
        ])
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                match app.get_window("main") {
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
                    match app.get_window("main") {
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
                "window" => {
                    let window = app.get_window("main").unwrap();
                    match window.is_fullscreen().expect("idk") {
                        true => window
                            .set_fullscreen(false)
                            .expect("windows cant be fullscreen"),
                        false => window
                            .set_fullscreen(true)
                            .expect("windows cant be fullscreen"),
                    }
                }
                "resize" => {
                    let window = app.get_window("main").unwrap();
                    match window.is_maximized().expect("idk") {
                        true => window.maximize().expect("window isnt resizable"),
                        false => window.unmaximize().expect("window isnt resizable"),
                    }
                }
                _ => {}
            },
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
