let resources = { water: 0, food: 0, wood: 0 };
let needs = { thirst: 100, hunger: 100, cold: 100 };
let alive = true;

function gather(type) {
  if (!alive) return;
  resources[type]++;
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("resources").innerText =
    `Su: ${resources.water} | Yemek: ${resources.food} | Odun: ${resources.wood}`;

  document.getElementById("needs").innerText =
    `Susuzluk: ${needs.thirst} | Açlık: ${needs.hunger} | Üşüme: ${needs.cold}`;
}

function consumeNeeds() {
  if (!alive) return;

  needs.thirst -= 1;
  needs.hunger -= 1;
  needs.cold -= 1;

  if (needs.thirst <= 0 || needs.hunger <= 0 || needs.cold <= 0) {
    alive = false;
    document.getElementById("status").innerText = "ÖLDÜN. Hayatta kalamadın.";
  }

  updateDisplay();
}

// Her 5 saniyede ihtiyaçlar azalır
setInterval(consumeNeeds, 5000);

// İlk gösterim
updateDisplay();
