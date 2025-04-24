async function submitForm(event) {
  csrfmiddlewaretoken = document.getElementsByName("csrfmiddlewaretoken")[0];
  title = document.getElementById("title");
  event.target.disabled = true;
  const submitSpinner = document.getElementById("submitSpinner");
  submitSpinner.classList.remove('hide')
  
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
    event.target.disabled = false;
    submitSpinner.classList.add('hide')
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

async function deleteTodo(event, id) {
  csrfmiddlewaretoken = document.getElementsByName("csrfmiddlewaretoken")[0];
  event.target.disabled = true;
  const itemSpinner = document.getElementById("itemSpinner" + id);
  itemSpinner.classList.remove('hide')
  try {
    const response = await fetch(`/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfmiddlewaretoken.value,
      },
    });

    event.target.disabled = false;
    itemSpinner.classList.add('hide')
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
  const itemSpinner = document.getElementById("itemSpinner" + id);
  itemSpinner.classList.remove('hide')
  try {
    const response = await fetch(`/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfmiddlewaretoken.value,
      },
    });
    itemSpinner.classList.add('hide')
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
