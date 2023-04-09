const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const input = document.querySelector(".input-box");
const shortBtn = document.querySelector(".short-btn");
const shortedLinks = document.querySelector(".shorted-links");
const addLink = document.querySelector(".add-link");
const originalLink = document.querySelector("#original-link");
hamburger.addEventListener("click", () => {
  if (menu.style.display === "" || menu.style.display === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
});
const getShorten = async () => {
  await fetch(`https://api.shrtco.de/v2/shorten?url=${input.value}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      create(
        data.result.full_short_link,
        data.result.original_link,
        data.result.code
      );
      setTimeout(() => {
        input.value = "";
      }, 1000);
    });
};
const create = (short_link, full_link, short_id) => {
  let div = document.createElement("div");
  div.classList.add("shorted");
  div.id = short_id;
  div.innerHTML = `
  <button class="delete-btn">delete</button>
  <p id="original-link">${full_link}</p>
  <hr />
  <div>
  <input id="shorted-link" value="${short_link}" />
  <button class="cta copy-btn">Copy</button>
  </div>`;
  shortedLinks.prepend(div);
  const copyBtn = document.querySelector(".copy-btn");
  const shortedLink = document.querySelector("#shorted-link");
  const deleteBtn = document.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", () => {
    const links = JSON.parse(localStorage.getItem("shortenedLinks"));

    const filtered = links.filter(
      (link) => link.short_id !== shortedLink.parentElement.parentElement.id
    );
    shortedLink.parentElement.parentElement.remove();
    localStorage.setItem("shortenedLinks", JSON.stringify(filtered));
  });

  copyBtn.addEventListener("click", () => {
    shortedLink.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied!";
    copyBtn.style.background = "hsl(260, 8%, 14%)";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
      copyBtn.style.background = "hsl(180, 66%, 49%)";
    }, 1000);
  });
  const shortened = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
  shortened.unshift({
    full_link,
    short_link,
    short_id,
  });
  localStorage.setItem("shortenedLinks", JSON.stringify(shortened));
};

document.forms["short"].addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.reportValidity()) {
    getShorten();
  }
});

const render = () => {
  const links = JSON.parse(localStorage.getItem("shortenedLinks"));
  if (links !== null) {
    links.forEach((link) => {
      let div = document.createElement("div");
      div.classList.add("shorted");
      div.id = link.short_id;
      div.innerHTML = `
      <button class="delete-btn">delete</button>
      <p id="original-link">${link.full_link}</p>
      <hr />
      <div>
      <input id="shorted-link" value="${link.short_link}" />
      <button class="cta copy-btn">Copy</button>
      </div>`;
      shortedLinks.append(div);
    });

    const copyBtn = document.querySelector(".copy-btn");
    const shortedLink = document.querySelector("#shorted-link");
    const deleteBtn = document.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      const filtered = links.filter(
        (link) => link.short_id !== shortedLink.parentElement.parentElement.id
      );
      localStorage.setItem("shortenedLinks", JSON.stringify(filtered));
      shortedLink.parentElement.parentElement.remove();
    });

    copyBtn.addEventListener("click", () => {
      shortedLink.select();
      document.execCommand("copy");
      copyBtn.textContent = "Copied!";
      copyBtn.style.background = "hsl(260, 8%, 14%)";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.style.background = "hsl(180, 66%, 49%)";
      }, 1000);
    });
  }
};
document.addEventListener("DOMContentLoaded", () => {
  render();
});
