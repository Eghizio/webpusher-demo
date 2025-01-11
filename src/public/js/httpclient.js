const API_URL = "http://localhost:3000/api/v1";

const headers = { "Content-Type": "application/json" };

const createHttpClient = (apiUrl, defaultHeaders) => ({
  async request(url, method, body) {
    return fetch(`${apiUrl}${url}`, {
      headers: defaultHeaders,
      method,
      body: JSON.stringify(body),
    })
      .then((response) =>
        response.headers.get("Content-Type")?.includes("application/json")
          ? response.json()
          : response.text()
      )
      .catch(console.error);
  },
  async get(endpoint) {
    return this.request(endpoint);
  },
  async post(endpoint, body) {
    return this.request(endpoint, "POST", body);
  },
  async patch(endpoint, body) {
    return this.request(endpoint, "PATCH", body);
  },
  async delete(endpoint) {
    return this.request(endpoint, "DELETE");
  },
});

export const HttpClient = createHttpClient(API_URL, headers);
