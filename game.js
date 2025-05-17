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
let health = 100;
let isNight = false;
let lastAttackMessage = "";

let structures = {
  well: 0,
  trap: 0,
  hut: 0
};

let inventory = {
  fire: false,
  knife: false,
  jar: false
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

function craft(item) {
  const cost = { fire: 3, knife: 5, jar: 4 };
  if (resources.wood >= cost[item] && !inventory[item]) {
    resources.wood -= cost[item];
    inventory[item] = true;
    document.getElementById("status").innerText = `${item} üretildi!`;
    updateDisplay();
  } else {
    document.getElementById("status").innerText = "Yeterli odunun yok ya da zaten ürettin!";
  }
}

function updateDisplay() {
  document.getElementById("resources").innerText =
    `Odun: ${resources.wood} | Su: ${resources.water} | Yemek: ${resources.food}`;

  document.getElementById("needs").innerText =
    `Susuzluk: ${Math.floor(needs.thirst)} | Açlık: ${Math.floor(needs.hunger)} | Üşüme: ${Math.floor(needs.cold)} | Can: ${Math.floor(health)}`;

  document.getElementById("structures").innerText =
    `Kuyular: ${structures.well} | Tuzaklar: ${structures.trap} | Barakalar: ${structures.hut}`;

  const statusText = alive
    ? (isNight ? `🌙 Gece... dikkatli ol! ${lastAttackMessage}` : "☀️ Gündüz. Topla, hazırla, yaşa.")
    : "☠️ Öldün... kurtuluş mümkün olmadı.";

  document.getElementById("status").innerText = statusText;

  document.body.style.backgroundColor = isNight ? "#111" : "#222";
}

function consumeResources() {
  if (!alive) return;

  needs.thirst -= 2;
  needs.hunger -= 1;
  needs.cold -= isNight ? (inventory.fire ? 1 : 2) : 1;

  if (resources.water > 0 && needs.thirst < 50) {
    resources.water--;
    needs.thirst += 10;
  }

  if (resources.food > 0 && needs.hunger < 50) {
    resources.food--;
    needs.hunger += 10;
  }

  if (structures.hut > 0 && needs.cold < 100 && isNight) {
    needs.cold += structures.hut * 1.5;
    if (needs.cold > 100) needs.cold = 100;
  }

  if (needs.thirst <= 0 || needs.hunger <= 0 || needs.cold <= 0) {
    health -= 10;
    if (health <= 0) alive = false;
  }

  updateDisplay();
}

function autoProduce() {
  if (!alive) return;

  resources.water += structures.well;
  resources.food += structures.trap;

  updateDisplay();
}

function triggerNightAttack() {
  if (!isNight || !alive) return;

  const attackChance = Math.random();
  if (attackChance < 0.4) {
    if (structures.hut >= 2) {
      lastAttackMessage = "Ama barakaların seni korudu.";
    } else {
      let damage = inventory.knife ? 7 : 15;
      health -= damage;
      needs.cold -= 5;
      needs.hunger -= 5;
      lastAttackMessage = `Bir şey sana saldırdı! (${damage} can kaybettin)`;
      if (health <= 0) alive = false;
    }
  } else {
    lastAttackMessage = "";
  }
}

function toggleDayNight() {
  isNight = !isNight;
  if (isNight) triggerNightAttack();
  updateDisplay();
}

setInterval(consumeResources, 5000);
setInterval(autoProduce, 10000);
setInterval(toggleDayNight, 30000);

updateDisplay();
