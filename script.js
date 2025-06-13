class Character {
    constructor(name, strength, daxterity, constitution, intelligence) {
        this.name = name;
        this.strength = strength; // Siła
        this.daxterity = daxterity; // Zręczność
        this.constitution = constitution; // Wytrzymałość
        this.intelligence = intelligence; // Inteligencja

        this.maxHp = 50 + (constitution * 10); // Zdrowie zwiększa się w momencie gdy jest większa wytrzymałość
        this.hp = this.hp;
        this.maxStamina = 50 + (constitution * 5); // Wytrzymałość poprawia stamine
        this.stamina = this.maxStamina;
        this.baseDamage = 5 + (strength * 0.5); // Bazowe obrażenia zależne od siły
        this.baseDefense = 5 + (daxterity * 0.3); // Bazowa obrona zależna od zręczności

        this.equippedWeapon = null;
        this.equippedArmor = null;

        this.wins = 0;
        this.losses = 0;
    }

    equipWeapon(weapon) {
        this.equipWeapon = weapon;
    }

    equipArmor(armor) {
        this.equipArmor = armor;
    }

    getTotalDamage() {
        let total = this.baseDamage;
        if (this.equipWeapon) {
            total += this.equipWeapon.damageModifier;
        }

        if (this.stamina < (this.maxStamina / 4)) {
            total *= 0.5;
        } else if (this.stamina < (this.maxStamina) / 2) {
            total *= 0.8;
        }
        return Math.max(1, total);
    }

    getTotalDefense() {
        let total = this.baseDefense;
        if (this.equipArmor) {
            total += this.equipArmor.defenseModifier;
        }
        return total;
    }

    getHitChance() {
        let chance = 70 + (this.daxterity * 0.5);
        if (this.equippedWeapon && this.equippedWeapon.type === 'bow') {
            chance += 5;
        }
        return Math.min(95, chance);
    }

    getDodgeChance() {
        let chance = 10 + (this.daxterity * 0.7);
        if (this.stamina < (this.maxStamina / 3)) {
            chance += 0.5;
        }
        return Math.min(75, chance);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) {
            this.hp = 0;
        } 
    }

    isDefeated() {
        return this.hp <= 0;
    }

    consumeStamina(amount) {
        this.stamina -= amount;
        if (this.stamina < 0) {
            this.stamina = 0;
        }
    }

    regenerateStamina(amount) {
        this.stamina += amount;
        if (this.stamina > this.maxStamina) {
            this.stamina = this.maxStamina;
        }
    }

    resetForFight() {
        this.hp = this.maxHp;
        this.stamina = this.maxStamina;
    }
}

class Weapon {
    constructor(name, damageModifier, type = 'melee') {
        this.name = name;
        this.damageModifier = damageModifier;
        this.type = type;
    }
}

class Armor {
    constructor(name, defenseModifier, type = 'light') {
        this.name = name;
        this.defenseModifier = defenseModifier;
        this.type = type; 
    }
}

function generateRandomCharacter(name) {
    const strength = Math.floor(Math.random() * 16) + 10;
    const dexterity = Math.floor(Math.random() * 16) + 10;
    const constitution = Math.floor(Math.random() * 16) + 10;
    const intelligence = Math.floor(Math.random() * 16) + 10;

    return new Character(name, strength, dexterity, constitution, intelligence);
}

function generateWeapons() {
    return [
        new Weapon('Drewniany Miecz', 5),
        new Weapon('Żelazny Topór', 10),
        new Weapon('Sztylet Zręczności', 7, 'melee'),
        new Weapon('Krótki Łuk', 8, 'bow'),
        new Weapon('Wielki Miecz', 15),
        new Weapon('Kostur Maga', 6, 'magic'),
        new Weapon('Srebrny Sztylet', 9)
    ];
}

function generateArmors() {
    return [
        new Armor('Skórzana Zbroja', 3, 'light'),
        new Armor('Kolczuga', 7, 'medium'),
        new Armor('Płytowa Zbroja', 12, 'heavy'),
        new Armor('Tunika Maga', 2, 'light'),
        new Armor('Haftowana Szata', 4)
    ];
}

function assignRandomEquipment(character, weapons, armors) {
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    const randomArmor = armors[Math.floor(Math.random() * armors.length)];
    character.equipWeapon(randomWeapon);
    character.equipArmor(randomArmor);
}

function simulateTurn(attacker, defender) {
    const hitChance = attacker.getHitChance();
    const dodgeChance = defender.getDodgeChance();
    const hitRoll = Math.random() * 100;
    const dodgeRoll = Math.random() * 100;

    attacker.consumeStamina(10);
    defender.regenerateStamina(5);

    if (hitRoll > hitChance) {
        return;
    }

    if (dodgeRoll < dodgeChance) {
        defender.consumeStamina(5);
        return;
    }

    const rawDamage = attacker.getTotalDamage();
    const finalDamage = Math.max(1, rawDamage - defender.getTotalDefense());

    defender.takeDamage(finalDamage);
}

function simulateFight(characterA, characterB) {
    characterA.resetForFight();
    characterB.resetForFight();

    let turn = 0;
    const maxTurns = 200;

    while (!characterA.isDefeated() && !characterB.isDefeated() && turn < maxTurns) {
        turn++;

        if (!characterA.isDefeated()) {
            simulateTurn(characterA, characterB);
            if (characterB.isDefeated()) {
                return characterA;
            }
        }

        if (!characterB.isDefeated()) {
            simulateTurn(characterB, characterA);
            if (characterA.isDefeated()) {
                return characterB;
            }
        }
    }

    return null;
}

function runOVerallSimulation(heroes, numSimulationsPerPair, outputElement) {
    outputElement.innerHtml = '';
    const appendToOutput = (text) => {
        outputElement.innerHtml += text + '\n';
    }

    const battleResults = new Map();

    heroes.forEach(hero => {
        battleResults.set(hero.name, {wins: 0, losses: 0, draws: 0, totalFights: 0});
    });

    appendToOutput("Rozpoczynanie symulacji...");
    appendToOutput(`Przeprowadzam ${numSimulationsPerPair} walk na każdą parę bohaterów.`);
    appendToOutput("-----------------------\n");

    for (let i = 0; i < heroes.length; i++) {
        for (let j = i + 1; j < heroes.length; j++) {
            const hero1 = heroes[i];
            const hero2 = heroes[j];

            for (let k = 0; k < numSimulationsPerPair; k++) {
                const winner = simulateFight(hero1, hero2);

                if (winner === hero1) {
                    battleResults.get(hero1.name).wins++;
                    battleResults.get(hero2.name).losses++;
                } else if (winner === hero2) {
                    battleResults.get(hero2.name).wins++;
                    battleResults.get(hero1.name).losses++;
                } else {
                    battleResults.get(hero1.name).draws++;
                    battleResults.get(hero2.name).draws++;
                }
                battleResults.get(hero1.name).totalFights++;
                battleResults.get(hero2.name).totalFights++;
            }
        }
    }

    appendToOutput("---Wynik Symulacji ---");
    appendToOutput("-----------------");

    const sortedResults = Array.from(battleResults.entries()).sort((a,b) => {
        const probA = a[1].totalFights > 0 ? (a[1].wins / a[1].totalFights) : 0;
        const probB = b[1].totalFights > 0 ? (a[1].wins / a[1].totalFights) : 0;
        return probB - probA;
    })

    sortedResults.forEach(([name, data]) => {
        const winProbability = data.totalFights > 0 ? (data.wins / data.totalFights) * 100 : 0;
        appendToOutput(`${name}: Wygrane: ${data.wins}, Przegrane: ${data.losses}, Remisy: ${data.draws}, Walki ogółem: ${data.totalFights}`);
        appendToOutput(`Prawdopodobieństwo zwycięstwa: ${winProbability.toFixed(2)}%`);
        appendToOutput("--------------------------");
    });

    appendToOutput("\nSymulacja zakończona!");
}

function startSimulation() {
    const startButton = document.getElementById('startButton');
    const resultsContainer = document.getElementById('results-container');
    const simulationOutput = document.getElementById('simulation-output');

    startButton.disabled = true;
    resultsContainer.style.display = 'block';

    simulationOutput.textContent = 'Generowanie bohaterów i ekwipunku...'

    const heroes = [];
    for (let i = 1; i <= 20; i++) {
        heroes.push(generateRandomCharacter(`Bohater_${i}`));
    }

    const weaponsPool = generateWeapons();
    const armorsPool = generateArmors();

    heroes.forEach(hero => {
        assignRandomEquipment(hero, weaponsPool, armorsPool);
    });

    const numberOfSimulationsPerPair = 500;
    runOVerallSimulation(heroes, numberOfSimulationsPerPair, simulationOutput);

    startButton.disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startSimulation);
});