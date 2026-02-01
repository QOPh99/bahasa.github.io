// javascript.js

const menu = document.getElementById("menu");

const openGroups    = new Set();   // which main groups are open
const openCategories = new Set();  // which categories (sub-items from groupz) are open

// sharedData comes from js/data.js (already loaded before this script)
const groupz     = sharedData.groupz;
const categories = sharedData.categories;
const wordLists  = sharedData.wordLists;

function createButton(text, extraClasses = [], onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.classList.add("button", "gradient");

  extraClasses
    .filter(cls => cls && typeof cls === "string" && cls.trim() !== "")
    .forEach(cls => btn.classList.add(cls));

  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

function createWordButton(nl, translation) {
  const btn = createButton("", ["word"]);
  
  btn.innerHTML = `
    <span class="dutch">${nl}</span>
    <span class="bahasa">${translation}</span>
  `;
  
  // optional: click to highlight/toggle something (like in your original)
  btn.addEventListener("click", () => {
    btn.classList.toggle("clicked");
  });
  
  return btn;
}

function render() {
  menu.innerHTML = "";

  Object.keys(groupz).forEach(groupKey => {
    const isGroupOpen = openGroups.has(groupKey);

    // Main group button (top level)
    const groupClasses = ["main-group"];
    if (isGroupOpen) groupClasses.push("open");

    const groupBtn = createButton(
      groupKey,
      groupClasses,
      () => {
        if (isGroupOpen) {
          openGroups.delete(groupKey);
          // also close all categories inside this group
          groupz[groupKey].split(/\s+/).filter(Boolean).forEach(cat => {
            openCategories.delete(cat);
          });
        } else {
          openGroups.add(groupKey);
        }
        render();
      }
    );
    menu.appendChild(groupBtn);

    if (!isGroupOpen) return;

    // Category buttons (from groupz[groupKey])
    const catKeys = groupz[groupKey].split(/\s+/).filter(Boolean);
    catKeys.forEach(catKey => {
      const isCatOpen = openCategories.has(catKey);

      const catClasses = ["category"];
      if (isCatOpen) catClasses.push("open");

      const catBtn = createButton(
        catKey.replace(/_/g, " "),
        catClasses,
        () => {
          if (isCatOpen) {
            openCategories.delete(catKey);
          } else {
            openCategories.add(catKey);
          }
          render();
        }
      );
      menu.appendChild(catBtn);

      if (!isCatOpen) return;

      // Word list (only if wordLists[catKey] exists)
      if (!wordLists[catKey] || !Array.isArray(wordLists[catKey])) return;

      wordLists[catKey].forEach(([nl, translation]) => {
        const wordBtn = createWordButton(nl, translation || "—");
        menu.appendChild(wordBtn);
      });
    });
  });

  // If nothing is open yet → optional welcome text
  if (menu.children.length === 0) {
    const info = document.createElement("p");
    info.textContent = "Klik op een groep om te beginnen...";
    info.style.color = "#777";
    info.style.padding = "20px";
    menu.appendChild(info);
  }
}

// Create small floating "back to top" button (always visible, bottom right)
function createToTopButton() {
  const btn = document.createElement("button");
  btn.textContent = "↑ Top";
  btn.classList.add("to-top-btn");
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(btn);
}

// Start
render();
createToTopButton();