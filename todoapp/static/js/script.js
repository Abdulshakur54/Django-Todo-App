async function submitForm() {
  csrfmiddlewaretoken = document.getElementsByName("csrfmiddlewaretoken")[0];
  title = document.getElementById("title");
  console.log(title.value);
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfmiddlewaretoken.value,
      },
      body: JSON.stringify({
        "title": title.value
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const rawHtml = `<li id="task${data.id}">
          <label class="task">
            <input type="checkbox" />
            <span class="checkmark"></span>
            <span class="task-text">${data.title}</span>
          </label>
          <span class="close" onclick="deleteTodo('${data.id}')">X</span>
          </li>`;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = rawHtml.trim();
    const listItem = wrapper.firstElementChild;
    document.getElementById("parentlist").appendChild(listItem);
    title.value = "";
    csrfmiddlewaretoken.value = data.csrfmiddlewaretoken;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the function

async function deleteTodo(id) {
  csrfmiddlewaretoken = document.getElementsByName("csrfmiddlewaretoken")[0];
  try {
    const response = await fetch(`/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfmiddlewaretoken.value,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    csrfmiddlewaretoken.value = data.csrfmiddlewaretoken;
    document.getElementById(`task${id}`).remove();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function checkTodo(id) {
  csrfmiddlewaretoken = document.getElementsByName("csrfmiddlewaretoken")[0];
  try {
    const response = await fetch(`/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfmiddlewaretoken.value,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    csrfmiddlewaretoken.value = data.csrfmiddlewaretoken;
    document
      .getElementById(`task${id}`)
      .getElementsByTagName("label")[0]
      .classList.add("disabled");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the function
