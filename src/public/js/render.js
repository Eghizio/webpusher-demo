export const renderUsers = (users) => {
  const usersList = document.querySelector("#users");

  const items = users.map(({ id, username, subscribed }) => {
    const li = document.createElement("li");
    const status = subscribed ? "✅" : "❌";
    li.textContent = `${status} ${username} - #${id}`;
    return li;
  });

  usersList.replaceChildren(...items);
};
