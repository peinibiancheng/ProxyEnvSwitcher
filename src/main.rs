#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;
use serde::{Deserialize, Serialize};
use tauri::{State, Manager};
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
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

#[derive(Debug, Serialize, Deserialize, Clone)]
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

    tauri::Builder::default()
        .manage(AppState {
            proxy_configs: Mutex::new(vec![]),
            proxy_rules: Mutex::new(vec![]),
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
}

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