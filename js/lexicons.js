// javascript.js — with "Alles inklappen" button + fold button under each sub-category word list
const menu = document.getElementById("menu");
const openGroups = new Set();
const openCategories = new Set();

// Safe loading from data.js
const groupz = sharedData?.groupz || {};
const categories = sharedData?.categories || {};
const wordLists = sharedData?.wordLists || {};

// ────────────────────────────────────────────────
// Create button helper (unchanged)
// ────────────────────────────────────────────────
function createButton(text, extraClasses = [], onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.classList.add("button", "gradient");
    extraClasses.filter(Boolean).forEach(cls => btn.classList.add(cls));
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
}

function createWordButton(nl, id) {
    const wordBtn = document.createElement("button");
    wordBtn.innerHTML = `
        <span class="dutch">${nl}</span>
        <span class="bahasa">${id}</span>
    `;
    wordBtn.style.display = "flex";
    wordBtn.style.justifyContent = "space-between";
    wordBtn.style.alignItems = "center";
    wordBtn.style.width = "100%";
    wordBtn.style.padding = "10px 16px";
    wordBtn.classList.add("button", "gradient");
    wordBtn.style.minWidth = "220px";
    wordBtn.style.margin = "6px 0";
    wordBtn.addEventListener("click", () => wordBtn.classList.toggle("clicked"));
    return wordBtn;
}

// ────────────────────────────────────────────────
// Main render function
// ────────────────────────────────────────────────
function render() {
    menu.innerHTML = "";
    if (Object.keys(groupz).length === 0) {
        menu.innerHTML = '<p style="padding:20px;color:#777;">Geen groepen gevonden in data.js</p>';
        return;
    }

    Object.keys(groupz).forEach(groupKey => {
        const isGroupOpen = openGroups.has(groupKey);
        const groupClasses = ["main-group"];
        if (isGroupOpen) groupClasses.push("open");

        const groupBtn = createButton(
            groupKey,
            groupClasses,
            () => {
                if (isGroupOpen) {
                    openGroups.delete(groupKey);
                    (groupz[groupKey] || "").split(/\s+/).filter(Boolean).forEach(cat => {
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

        const catKeys = (groupz[groupKey] || "").split(/\s+/).filter(Boolean);
        if (catKeys.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "Geen categorieën in deze groep";
            empty.style.color = "#888";
            empty.style.padding = "12px 32px";
            menu.appendChild(empty);
            return;
        }

        catKeys.forEach(catKey => {
            const isCatOpen = openCategories.has(catKey);
            const catClasses = ["category"];
            if (isCatOpen) catClasses.push("open");

            const displayName = catKey.replace(/_/g, " ");
            const catBtn = createButton(
                displayName.charAt(0).toUpperCase() + displayName.slice(1),
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

            const directWords = wordLists[catKey];
            if (Array.isArray(directWords) && directWords.length > 0) {
                directWords.forEach(([nl, tr]) => {
                    menu.appendChild(createWordButton(nl, tr));
                });
                return;
            }

            const subKeys = (categories[catKey] || "").split(/\s+/).filter(Boolean);
            if (subKeys.length > 0) {
                subKeys.forEach(subKey => {
                    const isSubOpen = openCategories.has(subKey);
                    const subClasses = ["sub-category"];
                    if (isSubOpen) subClasses.push("open");

                    const subBtn = createButton(
                        subKey.replace(/_/g, " "),
                        subClasses,
                        () => {
                            if (isSubOpen) openCategories.delete(subKey);
                            else openCategories.add(subKey);
                            render();
                        }
                    );
                    menu.appendChild(subBtn);

                    if (isSubOpen) {
                        const subWords = wordLists[subKey];
                        if (Array.isArray(subWords) && subWords.length > 0) {
                            subWords.forEach(([nl, id]) => {
                                const wordBtn = createWordButton(nl, id);
                                menu.appendChild(wordBtn);
                            });

                            // ── NEW: "Sluit deze lijst" button ────────────────────────────────
                            const foldBtn = createButton(
                                "Sluit ⬆ lijst",
                                ["fold-sub-list-btn"],   // ← tag/class you can style in CSS
                                () => {
                                    openCategories.delete(subKey);
                                    render();
                                }
                            );
                            menu.appendChild(foldBtn);
                            // ────────────────────────────────────────────────────────────────

                        } else {
                            const msg = document.createElement("p");
                            msg.textContent = `(nog geen woorden voor "${subKey}")`;
                            msg.style.color = "#aaa";
                            msg.style.padding = "8px 0 8px 100px";
                            msg.style.fontStyle = "italic";
                            menu.appendChild(msg);
                        }
                    }
                });
            } else {
                const msg = document.createElement("p");
                msg.textContent = `Nog geen inhoud voor "${catKey}"`;
                msg.style.color = "#999";
                msg.style.padding = "12px 48px";
                msg.style.fontSize = "0.9rem";
                menu.appendChild(msg);
            }
        });
    });
}

// ────────────────────────────────────────────────
// "Alles inklappen" button
// ────────────────────────────────────────────────
function createCollapseAllButton() {
    const btn = document.createElement("button");
    btn.textContent = "Alles inklappen";
    btn.classList.add("collapse-all-btn");
    btn.title = "Sluit alle geopende groepen en categorieën";
    btn.addEventListener("click", () => {
        openGroups.clear();
        openCategories.clear();
        render();
    });

    const updateVisibility = () => {
        btn.style.display = (openGroups.size > 0 || openCategories.size > 0) ? "block" : "none";
    };

    const observer = new MutationObserver(updateVisibility);
    observer.observe(menu, { childList: true, subtree: true });
    updateVisibility();
    document.body.appendChild(btn);
}

// ────────────────────────────────────────────────
// Movable "To Top" button (unchanged)
// ────────────────────────────────────────────────
function createToTopButton() {
    const btn = document.createElement("button");
    btn.textContent = "↑";
    btn.classList.add("to-top-btn");
    btn.title = "Naar boven\nSleep om te verplaatsen";
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    btn.addEventListener("pointerdown", e => {
        if (e.button !== 0) return;
        isDragging = true;
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        btn.style.transition = "none";
        btn.setPointerCapture(e.pointerId);
    });

    document.addEventListener("pointermove", e => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        const maxX = window.innerWidth - btn.offsetWidth - 16;
        const maxY = window.innerHeight - btn.offsetHeight - 16;
        currentX = Math.max(16, Math.min(currentX, maxX));
        currentY = Math.max(16, Math.min(currentY, maxY));
        btn.style.left = currentX + "px";
        btn.style.top = currentY + "px";
    });

    document.addEventListener("pointerup", () => {
        isDragging = false;
        btn.style.transition = "all 0.2s ease";
    });

    btn.addEventListener("click", e => {
        if (Math.abs(e.movementX || 0) > 5 || Math.abs(e.movementY || 0) > 5) return;
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    currentX = window.innerWidth - 80;
    currentY = window.innerHeight / 2 - 28;
    btn.style.left = currentX + "px";
    btn.style.top = currentY + "px";
    document.body.appendChild(btn);
}

// ─── Start ───────────────────────────────────────
render();
createCollapseAllButton();
createToTopButton();