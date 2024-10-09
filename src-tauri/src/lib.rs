use std::fs;
use tauri::Manager;

#[tauri::command]
fn save_api_key(app: tauri::AppHandle, key: String) -> Result<(), String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|_| "Failed to get config directory".to_string())?;
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;
    let key_path = config_dir.join("google_api_key.txt");
    fs::write(key_path, key).map_err(|e| format!("Failed to write API key: {}", e))
}

#[tauri::command]
fn load_api_key(app: tauri::AppHandle) -> Result<String, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|_| "Failed to get config directory".to_string())?;
    let key_path = config_dir.join("google_api_key.txt");
    fs::read_to_string(key_path).map_err(|e| format!("Failed to read API key: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![save_api_key, load_api_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
