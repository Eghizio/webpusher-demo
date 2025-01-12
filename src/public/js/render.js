// Polyfill.
const removeChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
};
const replaceChildren = (element, ...children) => {
  removeChildren(element);
  children.forEach((child) => element.appendChild(child));
};

export const renderUsers = (users) => {
  const usersList = document.querySelector("#users");

  const items = users.map(({ id, username, subscribed }) => {
    const li = document.createElement("li");
    const status = subscribed ? "✅" : "❌";
    li.textContent = `${status} ${username} - #${id}`;
    return li;
  });

  // usersList.replaceChildren(...items);
  replaceChildren(usersList, ...items);
};
