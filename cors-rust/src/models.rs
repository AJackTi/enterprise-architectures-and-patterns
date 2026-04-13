use anyhow::Result;
use spin_sdk::{http::conversions::IntoBody, key_value::Store};

use serde::{Deserialize, Serialize};

const ALL_ITEMS: &str = "ALL_ITEMS";

#[derive(Deserialize)]
pub(crate) struct NewItemModel {
    pub(crate) name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub(crate) struct Item {
    #[serde(skip_deserializing)]
    pub(crate) id: i64,
    pub(crate) name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Items {
    all: Vec<Item>,
}

impl Items {
    pub(crate) fn load() -> Result<Self> {
        let store = Store::open_default()?;
        Ok(match store.get_json::<Items>(ALL_ITEMS)? {
            Some(v) => v,
            None => Items::new(),
        })
    }

    pub(crate) fn save(&self) -> Result<()> {
        let store = Store::open_default()?;
        store.set_json(ALL_ITEMS, self)?;
        Ok(())
    }

    pub(crate) fn new() -> Self {
        Items { all: vec![] }
    }
    pub(crate) fn add(&mut self, item: Item) {
        self.all.push(item)
    }

    pub(crate) fn delete_by_id(&mut self, id: i64) {
        self.all.retain(|i| i.id != id);
    }

    pub(crate) fn next_id(&self) -> i64 {
        self.all
            .iter()
            .map(|i| i.id)
            .max()
            .map(|max| max + 1)
            .unwrap_or(1)
    }
}

impl IntoBody for Items {
    fn into_body(self) -> Vec<u8> {
        serde_json::to_vec(&self.all).expect("Could not serialize items")
    }
}
