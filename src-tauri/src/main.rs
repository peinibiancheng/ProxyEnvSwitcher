#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;
use serde::{Deserialize, Serialize};
use tauri::{Manager, State, Menu, MenuItem, Submenu, CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, SystemTrayMenuItem};
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize)]
struct ProxyConfig {
    id: String,
    name: String,
    protocol: String,
    host: String,
    port: u16,
    username: Option<String>,
    password: Option<String>,
    enabled: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct ProxyRule {
    id: String,
    name: String,
    rule_type: String,
    value: String,
    action: String,
    priority: u32,
}

struct AppState {
    proxy_configs: Mutex<Vec<ProxyConfig>>,
    proxy_rules: Mutex<Vec<ProxyRule>>,
}

fn main() {
    env_logger::init();
    info!("Starting Proxy Env Switcher...");

    // 创建系统托盘菜单
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show", "显示窗口"))
        .add_item(CustomMenuItem::new("hide", "隐藏窗口"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("enable_proxy", "启用代理"))
        .add_item(CustomMenuItem::new("disable_proxy", "禁用代理"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_submenu(Submenu::new(
            "切换代理",
            Menu::new()
                .add_item(CustomMenuItem::new("proxy_1", "代理 1"))
                .add_item(CustomMenuItem::new("proxy_2", "代理 2"))
                .add_item(CustomMenuItem::new("proxy_3", "代理 3"))
        ))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "退出"));

    let system_tray = SystemTray::new()
        .with_menu(tray_menu)
        .with_tooltip("Proxy Env Switcher");

    tauri::Builder::default()
        .manage(AppState {
            proxy_configs: Mutex::new(vec![]),
            proxy_rules: Mutex::new(vec![]),
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                if window.is_visible().unwrap_or(false) {
                    window.hide().unwrap();
                } else {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").unwrap();
                match id.as_str() {
                    "show" => {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    "hide" => {
                        window.hide().unwrap();
                    }
                    "enable_proxy" => {
                        info!("启用代理");
                        // 实现启用代理逻辑
                    }
                    "disable_proxy" => {
                        info!("禁用代理");
                        // 实现禁用代理逻辑
                    }
                    "quit" => {
                        info!("退出应用");
                        std::process::exit(0);
                    }
                    _ => {
                        info!("点击了菜单项: {}", id);
                    }
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            get_proxy_configs,
            add_proxy_config,
            update_proxy_config,
            delete_proxy_config,
            get_proxy_rules,
            add_proxy_rule,
            update_proxy_rule,
            delete_proxy_rule
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

#[tauri::command]
async fn get_proxy_configs(state: State<'_, AppState>) -> Result<Vec<ProxyConfig>, String> {
    Ok(state.proxy_configs.lock().unwrap().clone())
}

#[tauri::command]
async fn add_proxy_config(
    state: State<'_, AppState>,
    config: ProxyConfig
) -> Result<ProxyConfig, String> {
    let mut configs = state.proxy_configs.lock().unwrap();
    configs.push(config.clone());
    Ok(config)
}

#[tauri::command]
async fn update_proxy_config(
    state: State<'_, AppState>,
    config: ProxyConfig
) -> Result<ProxyConfig, String> {
    let mut configs = state.proxy_configs.lock().unwrap();
    if let Some(index) = configs.iter().position(|c| c.id == config.id) {
        configs[index] = config.clone();
        Ok(config)
    } else {
        Err("Proxy config not found".to_string())
    }
}

#[tauri::command]
async fn delete_proxy_config(
    state: State<'_, AppState>,
    id: String
) -> Result<(), String> {
    let mut configs = state.proxy_configs.lock().unwrap();
    if let Some(index) = configs.iter().position(|c| c.id == id) {
        configs.remove(index);
        Ok(())
    } else {
        Err("Proxy config not found".to_string())
    }
}

#[tauri::command]
async fn get_proxy_rules(state: State<'_, AppState>) -> Result<Vec<ProxyRule>, String> {
    Ok(state.proxy_rules.lock().unwrap().clone())
}

#[tauri::command]
async fn add_proxy_rule(
    state: State<'_, AppState>,
    rule: ProxyRule
) -> Result<ProxyRule, String> {
    let mut rules = state.proxy_rules.lock().unwrap();
    rules.push(rule.clone());
    Ok(rule)
}

#[tauri::command]
async fn update_proxy_rule(
    state: State<'_, AppState>,
    rule: ProxyRule
) -> Result<ProxyRule, String> {
    let mut rules = state.proxy_rules.lock().unwrap();
    if let Some(index) = rules.iter().position(|r| r.id == rule.id) {
        rules[index] = rule.clone();
        Ok(rule)
    } else {
        Err("Proxy rule not found".to_string())
    }
}

#[tauri::command]
async fn delete_proxy_rule(
    state: State<'_, AppState>,
    id: String
) -> Result<(), String> {
    let mut rules = state.proxy_rules.lock().unwrap();
    if let Some(index) = rules.iter().position(|r| r.id == id) {
        rules.remove(index);
        Ok(())
    } else {
        Err("Proxy rule not found".to_string())
    }
}