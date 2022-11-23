use reqwest;
use tokio;

pub struct Collection {
    pub(crate) host: String,
    pub(crate) port: i32,
    pub(crate) collection: String,
}
impl Collection {
    fn construct_headers(&self) -> reqwest::header::HeaderMap {
        let mut headers = reqwest::header::HeaderMap::new();
        headers.insert(
            reqwest::header::CONTENT_TYPE,
            reqwest::header::HeaderValue::from_static("application/json"),
        );
        headers
    }
    fn url_struct(&self) -> String {
        format!(
            "{}:{}/api/collections/{}/records",
            &self.host, &self.port, &self.collection
        )
    }
    #[tokio::main]
    pub async fn list(&self) -> String {
        let client = reqwest::Client::new();
        client
            .get(&self.url_struct())
            .send()
            .await
            .unwrap()
            .text()
            .await
            .expect("failed to get list")
    }
    #[tokio::main]
    pub async fn select(&self, id: String) -> String {
        let url = [&self.url_struct(), "/", &id].concat();
        let client = reqwest::Client::new();
        client
            .get(&url)
            .send()
            .await
            .unwrap()
            .text()
            .await
            .expect("failed to select")
    }
    #[tokio::main]
    pub async fn create(&self, data: String) -> String {
        let client = reqwest::Client::new();
        client
            .post(&self.url_struct())
            .headers(self.construct_headers())
            .body(data)
            .send()
            .await
            .unwrap()
            .text()
            .await
            .expect("failed to create")
    }
    #[tokio::main]
    pub async fn update(&self, id: String, data: String) -> String {
        let url = [&self.url_struct(), "/", &id].concat();
        let client = reqwest::Client::new();
        client
            .patch(&url)
            .headers(self.construct_headers())
            .body(data)
            .send()
            .await
            .unwrap()
            .text()
            .await
            .expect("failed to create")
    }
    #[tokio::main]
    pub async fn delete(&self, id: String) -> String {
        let url = [&self.url_struct(), "/", &id].concat();
        let client = reqwest::Client::new();
        client
            .delete(&url)
            .headers(self.construct_headers())
            .send()
            .await
            .unwrap()
            .text()
            .await
            .expect("failed to delete")
    }
}
