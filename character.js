export class Weapon {
  constructor(name, damageMin, damageMax) {
    this.name = name;
    this.damageMin = damageMin;
    this.damageMax = damageMax;
  }

  getDamage() {
    return Math.floor(Math.random() * (this.damageMax - this.damageMin + 1)) + this.damageMin;
  }
}

export class Armor {
  constructor(name, defense) {
    this.name = name;
    this.defense = defense;
  }
}

export class Character {
  constructor(name, strength, agility, endurance, hp, weapon, armor) {
    this.name = name;
    this.strength = strength;
    this.agility = agility;
    this.endurance = endurance;
    this.maxHp = hp;
    this.currentHp = hp;
    this.weapon = weapon;
    this.armor = armor;
    this.wins = 0;
  }

  resetHp() {
    this.currentHp = this.maxHp;
  }
}
