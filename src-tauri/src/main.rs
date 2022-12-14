#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem};
use tauri::{Manager, SystemTrayEvent};
pub mod crud;
pub mod csv_maker;
pub mod unique_command;
fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("hide".to_string(), "Hide/Show"))
        .add_item(CustomMenuItem::new(
            "window".to_string(),
            "Fullscreen/Window",
        ));
    let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .system_tray(system_tray)
        .invoke_handler(tauri::generate_handler![
            unique_command::buy_update,
            unique_command::transaction_all_debt,
            unique_command::debt_collected,
            unique_command::get_all_data,
            unique_command::delete_update,
            unique_command::change_update,
            unique_command::cencel_all,
            unique_command::update_test,
            csv_maker::csv_transaction_writer,
            csv_maker::csv_history_writer,
            csv_maker::analyze,
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
                                window.hide().expect("winhide");
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
