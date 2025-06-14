// script.js

/**
 * Klasa reprezentująca postać w grze RPG.
 * Zawiera podstawowe parametry, metody do zarządzania ekwipunkiem i statystykami bojowymi.
 */
class Character {
    constructor(name, strength, dexterity, constitution, intelligence) {
        this.name = name;
        this.strength = strength;       // Siła: wpływa na obrażenia
        this.dexterity = dexterity;     // Zręczność: wpływa na szansę trafienia i uniku
        this.constitution = constitution; // Wytrzymałość: wpływa na HP i Staminę
        this.intelligence = intelligence; // Inteligencja: dla przyszłych rozszerzeń (np. magia)

        // Obliczanie bazowych statystyk na podstawie parametrów
        this.maxHp = 50 + (constitution * 10); // HP zwiększa się z wytrzymałością
        this.hp = this.maxHp;
        this.maxStamina = 50 + (constitution * 5); // Stamina zwiększa się z wytrzymałością
        this.stamina = this.maxStamina;
        this.baseDamage = 5 + (strength * 0.5); // Bazowe obrażenia zależne od siły
        this.baseDefense = 2 + (dexterity * 0.3); // Bazowa obrona zależna od zręczności

        this.equippedWeapon = null;
        this.equippedArmor = null;

        this.wins = 0;
        this.losses = 0;
    }

    /**
     * Wyposaża postać w broń.
     * @param {Weapon} weapon - Obiekt broni do wyposażenia.
     */
    equipWeapon(weapon) {
        this.equippedWeapon = weapon;
    }

    /**
     * Wyposaża postać w zbroję.
     * @param {Armor} armor - Obiekt zbroi do wyposażenia.
     */
    equipArmor(armor) {
        this.equippedArmor = armor;
    }

    /**
     * Oblicza całkowite obrażenia zadawane przez postać.
     * Uwzględnia bazowe obrażenia, siłę i modyfikator z broni.
     * @returns {number} Całkowite obrażenia.
     */
    getTotalDamage() {
        let total = this.baseDamage;
        if (this.equippedWeapon) {
            total += this.equippedWeapon.damageModifier;
        }
        // Zmęczenie wpływa na zadawane obrażenia
        if (this.stamina < (this.maxStamina / 4)) { // Znacznie mniej obrażeń przy niskiej staminie
            total *= 0.5;
        } else if (this.stamina < (this.maxStamina / 2)) { // Mniej obrażeń przy średniej staminie
            total *= 0.8;
        }
        return Math.max(1, total); // Minimalne obrażenia to 1
    }

    /**
     * Oblicza całkowitą obronę postaci.
     * Uwzględnia bazową obronę, zręczność i modyfikator ze zbroi.
     * @returns {number} Całkowita obrona.
     */
    getTotalDefense() {
        let total = this.baseDefense;
        if (this.equippedArmor) {
            total += this.equippedArmor.defenseModifier;
        }
        return total;
    }

    /**
     * Oblicza szansę na trafienie atakiem (w procentach).
     * Zależy od zręczności atakującego i broni.
     * @returns {number} Szansa na trafienie (0-100%).
     */
    getHitChance() {
        // Podstawowa szansa trafienia (np. 70%) + zręczność * modyfikator
        let chance = 70 + (this.dexterity * 0.5);
        if (this.equippedWeapon && this.equippedWeapon.type === 'bow') { // Przykład: łuki mogą mieć wyższą celność
            chance += 5;
        }
        return Math.min(95, chance); // Maksymalna szansa na trafienie 95%
    }

    /**
     * Oblicza szansę na uniknięcie ataku (w procentach).
     * Zależy od zręczności obrońcy.
     * @returns {number} Szansa na unik (0-100%).
     */
    getDodgeChance() {
        // Podstawowa szansa uniku (np. 10%) + zręczność * modyfikator
        let chance = 10 + (this.dexterity * 0.7);
        // Zmęczenie wpływa na szansę uniku
        if (this.stamina < (this.maxStamina / 3)) {
            chance *= 0.5; // Mniejsza szansa uniku przy niskiej staminie
        }
        return Math.min(75, chance); // Maksymalna szansa na unik 75%
    }

    /**
     * Postać otrzymuje obrażenia.
     * @param {number} amount - Ilość obrażeń do przyjęcia.
     */
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }

    /**
     * Sprawdza, czy postać jest pokonana (HP <= 0).
     * @returns {boolean} True, jeśli postać jest pokonana, w przeciwnym razie false.
     */
    isDefeated() {
        return this.hp <= 0;
    }

    /**
     * Zmniejsza staminę postaci o podaną wartość.
     * @param {number} amount - Ilość staminy do zużycia.
     */
    consumeStamina(amount) {
        this.stamina -= amount;
        if (this.stamina < 0) {
            this.stamina = 0;
        }
    }

    /**
     * Regeneruje staminę postaci o podaną wartość, nie przekraczając maxStamina.
     * @param {number} amount - Ilość staminy do zregenerowania.
     */
    regenerateStamina(amount) {
        this.stamina += amount;
        if (this.stamina > this.maxStamina) {
            this.stamina = this.maxStamina;
        }
    }

    /**
     * Resetuje HP i staminę postaci do wartości początkowych przed nową walką.
     */
    resetForFight() {
        this.hp = this.maxHp;
        this.stamina = this.maxStamina;
    }
}

/**
 * Klasa reprezentująca broń.
 */
class Weapon {
    constructor(name, damageModifier, type = 'melee') {
        this.name = name;
        this.damageModifier = damageModifier;
        this.type = type; // np. 'melee', 'ranged', 'magic'
    }
}

/**
 * Klasa reprezentująca zbroję.
 */
class Armor {
    constructor(name, defenseModifier, type = 'light') {
        this.name = name;
        this.defenseModifier = defenseModifier;
        this.type = type; // np. 'light', 'medium', 'heavy'
    }
}

/**
 * Generuje losową postać z unikalnym imieniem i losowymi parametrami.
 * Parametry są generowane w realistycznym zakresie.
 * @param {string} name - Imię postaci.
 * @returns {Character} Nowa instancja postaci.
 */
function generateRandomCharacter(name) {
    // Siła: 10-25
    const strength = Math.floor(Math.random() * 16) + 10;
    // Zręczność: 10-25
    const dexterity = Math.floor(Math.random() * 16) + 10;
    // Wytrzymałość: 10-25
    const constitution = Math.floor(Math.random() * 16) + 10;
    // Inteligencja: 10-25 (dla przyszłych rozszerzeń)
    const intelligence = Math.floor(Math.random() * 16) + 10;

    return new Character(name, strength, dexterity, constitution, intelligence);
}

/**
 * Tworzy pulę dostępnych broni.
 * @returns {Array<Weapon>} Tablica obiektów broni.
 */
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

/**
 * Tworzy pulę dostępnych zbroi.
 * @returns {Array<Armor>} Tablica obiektów zbroi.
 */
function generateArmors() {
    return [
        new Armor('Skórzana Zbroja', 3, 'light'),
        new Armor('Kolczuga', 7, 'medium'),
        new Armor('Płytowa Zbroja', 12, 'heavy'),
        new Armor('Tunika Maga', 2, 'light'),
        new Armor('Haftowana Szata', 4)
    ];
}

/**
 * Przypisuje losową broń i zbroję do postaci.
 * @param {Character} character - Postać, której zostanie przypisany ekwipunek.
 * @param {Array<Weapon>} weapons - Pula dostępnych broni.
 * @param {Array<Armor>} armors - Pula dostępnych zbroi.
 */
function assignRandomEquipment(character, weapons, armors) {
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    const randomArmor = armors[Math.floor(Math.random() * armors.length)];
    character.equipWeapon(randomWeapon);
    character.equipArmor(randomArmor);
}

/**
 * Symuluje jedną turę walki.
 * @param {Character} attacker - Postać atakująca.
 * @param {Character} defender - Postać broniąca się.
 */
function simulateTurn(attacker, defender) {
    const hitChance = attacker.getHitChance();
    const dodgeChance = defender.getDodgeChance();
    const hitRoll = Math.random() * 100; // Rzut na trafienie
    const dodgeRoll = Math.random() * 100; // Rzut na unik

    attacker.consumeStamina(10); // Zużycie staminy na atak
    defender.regenerateStamina(5); // Lekka regeneracja staminy co turę

    if (hitRoll > hitChance) {
        return; // Chybił
    }

    if (dodgeRoll < dodgeChance) {
        defender.consumeStamina(5); // Zużycie staminy na unik
        return; // Uniknął
    }

    const rawDamage = attacker.getTotalDamage();
    const finalDamage = Math.max(1, rawDamage - defender.getTotalDefense()); // Obrażenia nie mogą być mniejsze niż 1

    defender.takeDamage(finalDamage);
}

/**
 * Symuluje pełną walkę między dwoma postaciami.
 * @param {Character} characterA - Pierwsza postać.
 * @param {Character} characterB - Druga postać.
 * @returns {Character|null} Zwycięzca walki lub null w przypadku remisu/przekroczenia limitu tur.
 */
function simulateFight(characterA, characterB) {
    // Resetuj HP i staminę bohaterów przed każdą walką
    characterA.resetForFight();
    characterB.resetForFight();

    let turn = 0;
    const maxTurns = 200; // Limit tur, aby uniknąć nieskończonych pętli

    while (!characterA.isDefeated() && !characterB.isDefeated() && turn < maxTurns) {
        turn++;

        // Tura A
        if (!characterA.isDefeated()) {
            simulateTurn(characterA, characterB);
            if (characterB.isDefeated()) {
                return characterA;
            }
        }

        // Tura B
        if (!characterB.isDefeated()) {
            simulateTurn(characterB, characterA);
            if (characterA.isDefeated()) {
                return characterB;
            }
        }
    }

    return null; // Remis lub przekroczenie limitu tur
}

/**
 * Przeprowadza pełną symulację walk "każdy z każdym" dla puli bohaterów
 * i oblicza prawdopodobieństwo zwycięstwa dla każdego z nich.
 * Wyniki są wyświetlane na stronie.
 * @param {Array<Character>} heroes - Tablica bohaterów do symulacji.
 * @param {number} numSimulationsPerPair - Liczba symulacji dla każdej pary bohaterów.
 * @param {HTMLElement} outputElement - Element HTML do wyświetlania wyników.
 */
function runOverallSimulation(heroes, numSimulationsPerPair, outputElement) {
    outputElement.innerHTML = ''; // Wyczyść poprzednie wyniki
    const appendToOutput = (text) => {
        outputElement.innerHTML += text + '\n';
    };

    const battleResults = new Map();

    heroes.forEach(hero => {
        battleResults.set(hero.name, { wins: 0, losses: 0, draws: 0, totalFights: 0 });
    });

    appendToOutput("Rozpoczynanie symulacji...");
    appendToOutput(`Przeprowadzam ${numSimulationsPerPair} walk na każdą parę bohaterów.`);
    appendToOutput("--------------------------\n");

    for (let i = 0; i < heroes.length; i++) {
        for (let j = i + 1; j < heroes.length; j++) { // Iteracja przez wszystkie unikalne pary
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
                } else { // Remis
                    battleResults.get(hero1.name).draws++;
                    battleResults.get(hero2.name).draws++;
                }
                battleResults.get(hero1.name).totalFights++;
                battleResults.get(hero2.name).totalFights++;
            }
        }
    }

    appendToOutput("--- Wyniki Symulacji ---");
    appendToOutput("--------------------------");

    const sortedResults = Array.from(battleResults.entries()).sort((a, b) => {
        const probA = a[1].totalFights > 0 ? (a[1].wins / a[1].totalFights) : 0;
        const probB = b[1].totalFights > 0 ? (b[1].wins / b[1].totalFights) : 0;
        return probB - probA; // Sortowanie malejące wg prawdopodobieństwa zwycięstwa
    });

    sortedResults.forEach(([name, data]) => {
        const winProbability = data.totalFights > 0 ? (data.wins / data.totalFights) * 100 : 0;
        appendToOutput(`${name}: Wygrane: ${data.wins}, Przegrane: ${data.losses}, Remisy: ${data.draws}, Walki ogółem: ${data.totalFights}`);
        appendToOutput(`Prawdopodobieństwo zwycięstwa: ${winProbability.toFixed(2)}%`);
        appendToOutput("--------------------------");
    });

    appendToOutput("\nSymulacja zakończona!");
}

// Funkcja uruchamiająca całą symulację
function startSimulation() {
    const startButton = document.getElementById('startButton');
    const resultsContainer = document.getElementById('results-container');
    const simulationOutput = document.getElementById('simulation-output');

    startButton.disabled = true; // Wyłącz przycisk po kliknięciu
    resultsContainer.style.display = 'block'; // Pokaż kontener wyników

    simulationOutput.textContent = 'Generowanie bohaterów i ekwipunku...';

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
    runOverallSimulation(heroes, numberOfSimulationsPerPair, simulationOutput);

    startButton.disabled = false; // Włącz przycisk ponownie po zakończeniu symulacji
}

// Podłączanie funkcji startSimulation do przycisku po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startSimulation);
});
