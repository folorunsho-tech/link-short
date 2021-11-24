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
localStorage.setItem("shortenedLinks", JSON.stringify([]));
let shortened = JSON.parse(localStorage.getItem("shortenedLinks"));
if (!localStorage.getItem("shortenedLinks").length === 0) {
  shortened.forEach((link) => {
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
}
document.forms["short"].addEventListener("click", (e) => {
  e.preventDefault();
  if (input.reportValidity()) {
    let shortened = [];
    let value = input.value;
    const getShorten = async () => {
      await fetch(`https://api.shrtco.de/v2/shorten?url=${input.value}`)
        .then((res) => res.json())
        .then((data) => {
          let div = document.createElement("div");
          div.classList.add("shorted");
          div.innerHTML = `<p id="original-link">${value}</p>
        <hr />
        <div>
          <input id="shorted-link" value="${data.result.full_short_link}" />
          <button class="cta copy-btn">Copy</button>
        </div>`;
          shortedLinks.append(div);
          shortened.push({
            short_link: data.result.full_short_link,
            full_link: value,
          });
          localStorage.setItem("shortenedLinks", JSON.stringify(shortened));
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
    getShorten();

    setTimeout(() => {
      input.value = "";
    }, 1000);
  }
});
