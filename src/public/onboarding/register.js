import { Api } from "../js/api.js";

document
  .querySelector("form#register")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = event.target.elements["username"].value;
    await Api.registerUser(username);

    event.target.reset();

    window.location.replace("/");
  });
