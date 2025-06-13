import { Weapon, Armor, Character } from './character.js';

const weaponPool = [
  new Weapon("Miecz", 5, 10),
  new Weapon("Topór", 8, 12),
  new Weapon("Sztylet", 3, 7),
  new Weapon("Buława", 6, 11),
  new Weapon("Łuk", 4, 9)
];

const armorPool = [
  new Armor("Skórzana", 2),
  new Armor("Kolczuga", 4),
  new Armor("Płytowa", 6),
  new Armor("Szata", 1),
  new Armor("Zbroja magiczna", 3)
];

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCharacter(id) {
  const name = `Bohater_${id}`;
  const strength = getRandomInt(5, 15);
  const agility = getRandomInt(5, 15);
  const endurance = getRandomInt(5, 15);
  const hp = 50 + endurance * 2;
  const weapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
  const armor = armorPool[Math.floor(Math.random() * armorPool.length)];

  return new Character(name, strength, agility, endurance, hp, weapon, armor);
}
