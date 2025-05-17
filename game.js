let resources = {
  wood: 0,
  water: 0,
  food: 0
};

let needs = {
  thirst: 100,
  hunger: 100,
  cold: 100
};

let alive = true;

let structures = {
  well: 0,
  trap: 0,
  hut: 0
};

function gather(type) {
  if (!alive) return;

  if (type === "wood") resources.wood += 1;
  if (type === "water") resources.water += 1;
  if (type === "food") resources.food += 1;

  updateDisplay();
}

function build(type) {
  if (!alive) return;

  const cost = { well: 5, trap: 7, hut: 10 };
  if (resources.wood >= cost[type]) {
    resources.wood -= cost[type];
    structures[type]++;
    updateDisplay();
  } else {
    document.getElementById("status").innerText = "Yeterli odunun yok!";
  }
}

function updateDisplay() {
  document.getElementById("resources").innerText =
    `Odun: ${resources.wood} | Su: ${resources.water} | Yemek: ${resources.food}`;

  document.getElementById("needs").innerText =
    `Susuzluk: ${needs.thirst} | Açlık: ${needs.hunger} | Üşüme: ${needs.cold}`;

  document.getElementById("structures").innerText =
    `Kuyular: ${structures.well} | Tuzaklar: ${structures.trap} | Barakalar: ${structures.hut}`;

  if (!alive) {
    document.getElementById("status").innerText = "☠️ Öldün... Kurtuluş mümkün olmadı.";
  } else {
    document.getElementById("status").innerText = "🧍 Hayattasın...";
  }
}

function consumeResources() {
  if (!alive) return;

  needs.thirst -= 2;
  needs.hunger -= 1;
  needs.cold -= 1;

  if (resources.water > 0 && needs.thirst < 50) {
    resources.water--;
    needs.thirst += 10;
  }

  if (resources.food > 0 && needs.hunger < 50) {
    resources.food--;
    needs.hunger += 10;
  }

  if (needs.thirst <= 0 || needs.hunger <= 0 || needs.cold <= 0) {
    alive = false;
  }

  updateDisplay();
}

function autoProduce() {
  if (!alive) return;

  resources.water += structures.well;
  resources.food += structures.trap;

  if (structures.hut > 0 && needs.cold < 100) {
    needs.cold += structures.hut;
    if (needs.cold > 100) needs.cold = 100;
  }

  updateDisplay();
}

setInterval(consumeResources, 5000); // 5 saniyede bir ihtiyaçlar azalır
setInterval(autoProduce, 10000); // 10 saniyede bir otomatik kaynak üretimi

updateDisplay();
