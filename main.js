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

const create = (short_link, full_link) => {
  let div = document.createElement("div");
  div.classList.add("shorted");
  div.innerHTML = `<p id="original-link">${full_link}</p>
        <hr />
        <div>
        <input id="shorted-link" value="${short_link}" />
        <button class="cta copy-btn">Copy</button>
        </div>`;
  shortedLinks.append(div);
  const copyBtn = document.querySelector(".copy-btn");
  const shortedLink = document.querySelector("#shorted-link");
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
  shortened.push({
    full_link,
    short_link,
  });
  localStorage.setItem("shortenedLinks", JSON.stringify(shortened));
};

const getShorten = async () => {
  await fetch(`https://api.shrtco.de/v2/shorten?url=${input.value}`)
    .then((res) => res.json())
    .then((data) => {
      create(data.result.full_short_link, input.value);
      setTimeout(() => {
        input.value = "";
      }, 1000);
    });
};
document.forms["short"].addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.reportValidity()) {
    getShorten();
  }
});

const render = () => {
  const links = JSON.parse(localStorage.getItem("shortenedLinks"));

  links.forEach((link) => {
    let div = document.createElement("div");
    div.classList.add("shorted");
    div.innerHTML = `<p id="original-link">${link.full_link}</p>
        <hr />
        <div>
        <input id="shorted-link" value="${link.short_link}" />
        <button class="cta copy-btn">Copy</button>
        </div>`;
    shortedLinks.append(div);
  });

  const copyBtn = document.querySelector(".copy-btn");
  const shortedLink = document.querySelector("#shorted-link");
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
};
document.addEventListener("DOMContentLoaded", () => {
  render();
});
