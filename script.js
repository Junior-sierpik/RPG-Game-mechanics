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