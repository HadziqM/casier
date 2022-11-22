#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem};
use tauri::{Manager, SystemTrayEvent};

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);
    let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .system_tray(system_tray)
        .invoke_handler(tauri::generate_handler![greet])
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
                    window.hide().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
