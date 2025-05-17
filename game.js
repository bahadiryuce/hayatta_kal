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
