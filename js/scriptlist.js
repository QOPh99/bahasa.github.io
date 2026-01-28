



const menu = document.getElementById("menu");
const openMain  = new Set();
const openGroups = new Set();

// Use the shared data directly
const categories = sharedData.categories;
const wordLists  = sharedData.wordLists;

function createButton(text, extraClasses = [], onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;

  // Always apply base + gradient style
  btn.classList.add("button", "gradient");

  // Add any additional classes passed in (main-category, group, word, open, clicked…)
  extraClasses
    .filter(cls => cls && typeof cls === "string" && cls.trim() !== "")
    .forEach(cls => btn.classList.add(cls));

  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

function render() {
  menu.innerHTML = "";

  Object.keys(categories).forEach(key => {
    const isOpen = openMain.has(key);

    // Main category button
    const mainClasses = ["main-category"];
    if (isOpen) mainClasses.push("open");

    const mainBtn = createButton(
      key.charAt(0).toUpperCase() + key.slice(1),
      mainClasses,
      () => {
        if (isOpen) {
          openMain.delete(key);
          categories[key].split(/\s+/).forEach(g => openGroups.delete(g.trim()));
        } else {
          openMain.add(key);
        }
        render();
      }
    );
    menu.appendChild(mainBtn);

    if (!isOpen) return;

    // Sub-groups
    const groups = categories[key].split(/\s+/).filter(Boolean);

    groups.forEach(group => {
      if (!wordLists[group]) return;

      const isGroupOpen = openGroups.has(group);

      const groupClasses = ["group"];
      if (isGroupOpen) groupClasses.push("open");

      const groupBtn = createButton(
        group.replace(/_/g, " "),
        groupClasses,
        () => {
          if (isGroupOpen) openGroups.delete(group);
          else openGroups.add(group);
          render();
        }
      );
      menu.appendChild(groupBtn);

      if (!isGroupOpen) return;

      // Word pairs
      wordLists[group].forEach(([nl, id]) => {
    const wordBtn = createButton("", ["word"], () => {
        wordBtn.classList.add("clicked");
    });

    wordBtn.innerHTML = `
        <span class="dutch">${nl}</span>
        <span class="bahasa">${id}</span>
    `;
        menu.appendChild(wordBtn);
      });
    });
  });
}

// Example buttons at the bottom

// Variant: creates <a> styled like your buttons
function createLinkButton(text, url, extraClasses = []) {
  const link = document.createElement("a");
  link.href = url;
  link.textContent = text;
  link.classList.add("button", "gradient");     // same base look

  // Add your extra classes
  extraClasses
    .filter(cls => cls && typeof cls === "string" && cls.trim() !== "")
    .forEach(cls => link.classList.add(cls));

  // Prevent default underline + make it look like button
  link.style.textDecoration = "none";
  link.style.display = "inline-block";

  return link;
}



// Start
render();