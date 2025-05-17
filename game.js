// game.js

let day = 1;
let health = 100;
let hunger = 0;
let thirst = 0;
let isSick = false;

let inventory = {
  wood: 0,
  stone: 0,
  water: 0,
  food: 0,
  campfire: 0,
  shelter: 0
};

const tasks = [
  { id: 1, text: "3 Odun Topla", done: false, check: () => inventory.wood >= 3 },
  { id: 2, text: "Kamp Ateşi Yap", done: false, check: () => inventory.campfire >= 1 },
  { id: 3, text: "Barınak Yap", done: false, check: () => inventory.shelter >= 1 },
  { id: 4, text: "Bir Gün Hayatta Kal", done: false, check: () => day > 1 },
];

function updateStats() {
  document.getElementById("stats").innerHTML = `
    Gün: ${day}<br>
    Sağlık: ${health}<br>
    Açlık: ${hunger}<br>
    Susuzluk: ${thirst}<br>
    Durum: ${isSick ? 'HASTA' : 'İyi'}
  `;
}

function updateInventory() {
  document.getElementById("inventory").innerHTML = `
    Odun: ${inventory.wood}, Taş: ${inventory.stone}, Su: ${inventory.water}, Yemek: ${inventory.food}<br>
    Kamp Ateşi: ${inventory.campfire}, Barınak: ${inventory.shelter}
  `;
}

function updateTasks() {
  tasks.forEach(task => {
    if (!task.done && task.check()) task.done = true;
  });
  document.getElementById("tasks").innerHTML =
    "Görevler:" +
    tasks.map(t => `<div class="${t.done ? 'task-done' : ''}">${t.text}</div>`).join('');
}

function showMessage(msg) {
  const messages = document.getElementById("messages");
  const p = document.createElement("p");
  p.innerText = `Gün ${day}: ${msg}`;
  messages.appendChild(p);
  messages.scrollTop = messages.scrollHeight;
}

function gather(type) {
  const amounts = { wood: 1, stone: 1, water: 1, food: 1 };
  inventory[type] += amounts[type] || 0;
  showMessage(`${type.toUpperCase()} topladınız.`);
  updateInventory();
  updateTasks();
}

function craft(item) {
  if (item === "campfire") {
    if (inventory.wood >= 3 && inventory.stone >= 2) {
      inventory.wood -= 3;
      inventory.stone -= 2;
      inventory.campfire++;
      showMessage("Kamp ateşi yaptınız.");
    } else {
      showMessage("Kamp ateşi için yeterli kaynak yok.");
    }
  } else if (item === "shelter") {
    if (inventory.wood >= 5 && inventory.stone >= 3) {
      inventory.wood -= 5;
      inventory.stone -= 3;
      inventory.shelter++;
      showMessage("Barınak yaptınız.");
    } else {
      showMessage("Barınak için yeterli kaynak yok.");
    }
  }
  updateInventory();
  updateTasks();
}

function useItem(item) {
  if (item === "water" && inventory.water > 0) {
    inventory.water--;
    thirst -= 30;
    if (thirst < 0) thirst = 0;
    showMessage("Su içtiniz.");
  } else if (item === "food" && inventory.food > 0) {
    inventory.food--;
    hunger -= 30;
    if (hunger < 0) hunger = 0;
    showMessage("Yemek yediniz.");
  } else {
    showMessage("Bu eşyadan yok.");
  }
  updateInventory();
  updateStats();
}

function endDay() {
  if (health <= 0) {
    alert("Sağlığınız tükendi. Hayatta kalamadınız...");
    resetGame();
    return;
  }

  day++;
  hunger += 15;
  thirst += 20;

  if (isSick) health -= 10;
  if (hunger >= 100) health -= 15;
  if (thirst >= 100) health -= 20;

  if (!isSick && Math.random() < 0.2) {
    isSick = true;
    showMessage("Hastalandınız! Sağlık her gün düşecek.");
  }

  updateStats();
  updateTasks();
  checkGameOver();
}

function checkGameOver() {
  if (health <= 0) {
    alert("Sağlığınız bitti. Hayatta kalmayı başaramadınız.");
    resetGame();
  }
}

function resetGame() {
  day = 1;
  health = 100;
  hunger = 0;
  thirst = 0;
  isSick = false;
  for (let key in inventory) inventory[key] = 0;
  tasks.forEach(t => t.done = false);
  updateStats();
  updateInventory();
  updateTasks();
  showMessage("Oyun sıfırlandı.");
}

// İlk gün başlat
updateStats();
updateInventory();
updateTasks();
let resources = {
    odun: 10,
    taş: 5,
    yemek: 8,
    su: 10
};

let needs = {
    açlık: 0,
    susuzluk: 0,
    yorgunluk: 0
};

let alive = true;
let health = 100;
let isNight = false;
let lastAttackMessage = "";
let isSick = false;
let craftedItems = [];

const craftRecipes = {
    "balta": { odun: 2, taş: 1 },
    "mızrak": { odun: 1, taş: 2 },
    "ateş": { odun: 3 },
    "çadır": { odun: 10, taş: 5, yemek: 2 }
};

function updateStats() {
    document.getElementById("wood").innerText = `Odun: ${resources.odun}`;
    document.getElementById("stone").innerText = `Taş: ${resources.taş}`;
    document.getElementById("food").innerText = `Yemek: ${resources.yemek}`;
    document.getElementById("water").innerText = `Su: ${resources.su}`;
    document.getElementById("hunger").innerText = `Açlık: ${needs.açlık}`;
    document.getElementById("thirst").innerText = `Susuzluk: ${needs.susuzluk}`;
    document.getElementById("fatigue").innerText = `Yorgunluk: ${needs.yorgunluk}`;
    document.getElementById("health").innerText = `Sağlık: ${health}`;
    document.getElementById("status").innerText = alive ? "Durum: Hayatta" : "Durum: Ölü";
    document.getElementById("crafted").innerText = `Üretilenler: ${craftedItems.join(", ") || "Yok"}`;
    document.getElementById("log").innerText = lastAttackMessage;
}

function logMessage(message) {
    lastAttackMessage = message;
    updateStats();
}

function craft(itemName) {
    const recipe = craftRecipes[itemName];
    if (!recipe) {
        logMessage(`❌ Bu eşya craft edilemez.`);
        return;
    }

    for (const resource in recipe) {
        if (!resources[resource] || resources[resource] < recipe[resource]) {
            logMessage(`❌ Yetersiz kaynak: ${resource}`);
            return;
        }
    }

    for (const resource in recipe) {
        resources[resource] -= recipe[resource];
    }

    craftedItems.push(itemName);
    logMessage(`✅ ${itemName} başarıyla craft edildi.`);
}

function performTask(task) {
    if (!alive) return;

    let result = "";

    switch(task) {
        case "odun":
            let odunMiktarı = craftedItems.includes("balta") ? 5 : 3;
            resources.odun += odunMiktarı;
            result = `🌲 ${odunMiktarı} odun topladın.`;
            break;
        case "taş":
            resources.taş += 2;
            result = "🪨 2 taş topladın.";
            break;
        case "yemek":
            resources.yemek += 2;
            result = "🍖 2 yemek buldun.";
            break;
        case "su":
            resources.su += 2;
            result = "💧 2 su buldun.";
            break;
    }

    needs.açlık += 5;
    needs.susuzluk += 5;
    needs.yorgunluk += 5;

    updateStats();
    logMessage(result);
}

function endDay() {
    if (!alive) return;

    isNight = true;

    // Gecelik ihtiyaçlar
    let açlıkArtışı = craftedItems.includes("çadır") ? 4 : 8;
    let susuzlukArtışı = craftedItems.includes("çadır") ? 4 : 8;
    let yorgunlukArtışı = craftedItems.includes("çadır") ? 3 : 6;

    needs.açlık += açlıkArtışı;
    needs.susuzluk += susuzlukArtışı;
    needs.yorgunluk += yorgunlukArtışı;

    // Gece hastalanma
    let hastalanmaIhtimali = craftedItems.includes("ateş") ? 0.2 : 0.5;
    if (Math.random() < hastalanmaIhtimali) {
        isSick = true;
        health -= 10;
        logMessage("🤒 Gece hastalandın. Sağlığın azaldı.");
    } else {
        isSick = false;
    }

    // Gece saldırısı
    let saldırıVar = Math.random() < 0.3;
    if (saldırıVar) {
        let zarar = craftedItems.includes("mızrak") ? 10 : 20;
        health -= zarar;
        logMessage(`👹 Gece saldırısı oldu! ${zarar} hasar aldın.`);
    }

    if (needs.açlık >= 100 || needs.susuzluk >= 100 || health <= 0) {
        alive = false;
        logMessage("☠️ Hayatta kalamadın...");
    }

    updateStats();
    isNight = false;
}
