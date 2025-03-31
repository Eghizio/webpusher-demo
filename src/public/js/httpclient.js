export class HttpClient {
  constructor(baseUrl, defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }
  async request(endpoint, method, body) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = this.defaultHeaders;

    return fetch(url, { method, headers, body: JSON.stringify(body) })
      .then((response) => {
        if (response.ok) return response;
        throw new Error(response.statusText);
      })
      .then((response) =>
        response.headers.get("Content-Type")?.includes("application/json")
          ? response.json()
          : response.text()
      );
    // .catch(console.error);
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, body) {
    return this.request(endpoint, "POST", body);
  }

  async patch(endpoint, body) {
    return this.request(endpoint, "PATCH", body);
  }

  async delete(endpoint) {
    return this.request(endpoint, "DELETE");
  }
}
