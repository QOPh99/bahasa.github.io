document.addEventListener('DOMContentLoaded', function() {
  // Use shared data from data.js
  const groupz = sharedData.groupz;
  const categories = sharedData.categories;
  const wordLists  = sharedData.wordLists;

const praise = [
  "Mantap!",
  "Keren!",
  "Selamat ya! Kamu hebat!",
  "Luar biasa! Kerja bagus!",
  "Bagus sekali! Mantap!",
  "Hebat! Kamu pintar!",
  "Keren banget! Bravo!"
];

const header = document.querySelector('.header');
const knop1 = document.querySelector('.knop1');
const knop2 = document.querySelector('.knop2');




const container = document.createElement("div");
container.className = "button2-container";



const title = document.getElementById("title");
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
let subMenuScroll = 0;
let currentCategory = "";
let current = "";

window.addEventListener('scroll', () => {
    if (!gameArea.classList.contains('hidden')) {
        subMenuScroll = window.scrollY;
    }
});

function buildMainMenu() {
  
  mainMenu.innerHTML = "";
  Object.keys(groupz).forEach(key => {
    const btn = document.createElement("button");
    btn.className = "button gradient";
    btn.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    btn.dataset.category = key;
    btn.onclick = () => openSubMenu2(key);
    
    mainMenu.appendChild(btn); 
   
    });
}


function openSubMenu2(catKey) { /* catKey is category name */
  
  header.classList.remove("hidden");
  knop1.classList.remove("hidden");
  knop2.classList.remove("hidden");
  
  

  currentCategory = catKey;
  current = catKey;
  title.textContent = catKey.charAt(0).toUpperCase() + catKey.slice(1);
  mainMenu.classList.add("hidden");
  gameArea.classList.remove("hidden");
  gameArea.innerHTML = "<div class='info'></div>";

  const clickedBtn = mainMenu.querySelector(`button[data-category="${currentCategory}"]`);
  
  const back = document.createElement("buttonback");
  back.className = "buttonback gradient";
  back.textContent = "← menu";

  back.onclick = () => {
  gameArea.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  container.classList.remove("hidden"); // keep this if you actually use .button2-container
  title.textContent = "";
  setTimeout(() => {
        const clickedBtn = mainMenu.querySelector(`button[data-category="${currentCategory}"]`);
        if (clickedBtn) {
            clickedBtn.scrollIntoView({
                behavior: 'smooth',
                block: 'center'         // centers vertically — feels natural & prominent
            });
        }
    }, 120); // 120–200 ms delay usually works well; increase to 200 if still jumpy
};
gameArea.appendChild(back);
  
  
  const subs = groupz[catKey].split(" ").filter(Boolean);
  subs.forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "button gradient";
    const niceName = sub.replace(/_/g, " ");
    btn.textContent = niceName.charAt(0).toUpperCase() + niceName.slice(1);
    btn.onclick = () => {
      if (categories[sub]) {
        openSubMenu(sub, catKey);
      } else {
        alert("Deze categorie is nog leeg.\nWoorden worden later toegevoegd.");
      }
    };
    gameArea.appendChild(btn);
  });
}



function openSubMenu(catKey, key) { /* catKey is category name */
  
  header.classList.remove("hidden");
  knop1.classList.remove("hidden");
  knop2.classList.remove("hidden");
  
  

  currentCategory = catKey;
  
  title.textContent = catKey.charAt(0).toUpperCase() + catKey.slice(1);
  mainMenu.classList.add("hidden");
  gameArea.classList.remove("hidden");
  gameArea.innerHTML = "<div class='info'></div>";

  const clickedBtn = mainMenu.querySelector(`button[data-category="${currentCategory}"]`);
  
  const back = document.createElement("buttonback");
  back.className = "buttonback gradient";
  back.textContent = "← " + key;

  back.onclick = () => {
  gameArea.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  container.classList.remove("hidden"); // keep this if you actually use .button2-container
  title.textContent = "";
  setTimeout(() => {
        const clickedBtn = mainMenu.querySelector(`button[data-category="${currentCategory}"]`);
        if (clickedBtn) {
            clickedBtn.scrollIntoView({
                behavior: 'smooth',
                block: 'center'         // centers vertically — feels natural & prominent
            });
        }
    }, 120); // 120–200 ms delay usually works well; increase to 200 if still jumpy
    openSubMenu2(key)
};
gameArea.appendChild(back);
  
  
  const subs = categories[catKey].split(" ").filter(Boolean);
  subs.forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "button gradient";
    const niceName = sub.replace(/_/g, " ");
    btn.textContent = niceName.charAt(0).toUpperCase() + niceName.slice(1);
    btn.onclick = () => {
      if (wordLists[sub]) {
        startGame(sub, wordLists[sub], key);
      } else {
        alert("Deze categorie is nog leeg.\nWoorden worden later toegevoegd.");
      }
    };
    gameArea.appendChild(btn);
  });
}

function startGame(subKey, pairs, key) {
  gameArea.innerHTML = "";
  
  let list = [...pairs];
  // shuffle
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }

  let index = 0;
  let score = 0;
  let wrongs = 0;

  const scoreEl = document.createElement("div");
  scoreEl.className = "score";
  scoreEl.textContent = "0 / " + list.length;
  gameArea.appendChild(scoreEl);

  const feedbackEl = document.createElement("div");
  feedbackEl.className = "feedback";
  gameArea.appendChild(feedbackEl);

  const wordEl = document.createElement("div");
  wordEl.className = "word";
  gameArea.appendChild(wordEl);

  const optsDiv = document.createElement("div");
  optsDiv.className = "options";
  gameArea.appendChild(optsDiv);

  const exitBtn = document.createElement("button");
  exitBtn.className = "stopbutton";
  exitBtn.textContent = "× Stoppen";
  exitBtn.onclick = () => {

    openSubMenu(currentCategory, key);
  };

  gameArea.appendChild(exitBtn);

  function updateScore() {
    scoreEl.textContent = score + " / " + list.length;
  }

  function showNext() {
  header.classList.add("hidden");
  knop1.classList.add("hidden");
  knop2.classList.add("hidden");
  
  
  if (index >= list.length) {
    const perc = list.length ? Math.round((score / list.length) * 100) : 0;
    container.classList.remove("hidden");
    gameArea.innerHTML = `
      <div class="end-screen">
        <div class="end-message">${praise[Math.floor(Math.random()*praise.length)]}</div>
        <div>
          Score: <b>${score} / ${list.length}</b><br>
          (${perc}%) • Fouten: ${wrongs}
        </div>
        <button class="button gradient" style="margin-top:2rem;">Terug naar ${currentCategory}</button>
      </div>
    `;
    gameArea.querySelector("button").onclick = () => openSubMenu(currentCategory, current);
    return;
  }

  feedbackEl.textContent = "";
  const [dutch, correct] = list[index];
  wordEl.textContent = dutch;

  // ─── Collect ALL Indonesian words once ───────────────────────────────
  const allIndonesianWords = [];
  Object.values(wordLists).forEach(subList => {
    subList.forEach(([d, i]) => {
      allIndonesianWords.push(i);
    });
  });
  const uniqueWords = [...new Set(allIndonesianWords)];

  // Pick 3 different wrong answers from the whole pool
  const wrongsOpts = [];
  while (wrongsOpts.length < 3) {
    const randWord = uniqueWords[Math.floor(Math.random() * uniqueWords.length)];
    if (randWord !== correct && !wrongsOpts.includes(randWord)) {
      wrongsOpts.push(randWord);
    }
  }

  const choices = [correct, ...wrongsOpts];
  choices.sort(() => Math.random() - 0.5);

  optsDiv.innerHTML = "";
  choices.forEach(text => {
    const b = document.createElement("button");
    b.className = "button gradient";
    b.textContent = text;
    b.onclick = () => {
      // ... (rest of the click handler stays exactly the same)
      optsDiv.querySelectorAll("button").forEach(btn => btn.disabled = true);
      if (text === correct) {
        feedbackEl.textContent = "✓ Correct!";
        feedbackEl.style.color = "#aaffaa";
        score++;
        index++;
        updateScore();
        setTimeout(() => {
          feedbackEl.textContent = "";
          showNext();
        }, 900);
      } else {
        wrongs++;
        score = Math.max(0, score - 1);
        updateScore();
        scoreEl.style.display = "none";
        wordEl.style.display = "none";
        optsDiv.style.display = "none";
        exitBtn.style.display = "none";
        feedbackEl.textContent = "";

        const reviewDiv = document.createElement("div");
        reviewDiv.className = "wrong-review";
        reviewDiv.innerHTML = `
          <div class="wrong-title">🙏🤦‍♀️</div>
          <div class="dutch-word">${dutch}</div>
          <div class="correct-word">${correct}</div>
          <button class="button gradient continue-btn">1 woord terug</button>
        `;
        gameArea.appendChild(reviewDiv);

        reviewDiv.querySelector(".continue-btn").onclick = () => {
          reviewDiv.remove();
          scoreEl.style.display = "block";
          wordEl.style.display = "block";
          optsDiv.style.display = "block";
          exitBtn.style.display = "block";
          if (index > 0) index--;
          showNext();
        };
      }
    };
    optsDiv.appendChild(b);
  });
}

  updateScore();
  showNext();
}

// Start

buildMainMenu();
});