export function simulateBattle(char1, char2) {
  char1.resetHp();
  char2.resetHp();

  let attacker = Math.random() < 0.5 ? char1 : char2;
  let defender = attacker === char1 ? char2 : char1;

  while (char1.currentHp > 0 && char2.currentHp > 0) {
    const hitChance = 0.7 + (attacker.agility - defender.agility) * 0.01;
    if (Math.random() < hitChance) {
      const baseDamage = attacker.weapon.getDamage() + attacker.strength;
      const totalDamage = Math.max(0, baseDamage - defender.armor.defense);
      defender.currentHp -= totalDamage;
    }

    [attacker, defender] = [defender, attacker];
  }

  const winner = char1.currentHp > 0 ? char1 : char2;
  winner.wins++;
}

export function simulateTournament(characters, fightsPerPair = 100) {
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      for (let k = 0; k < fightsPerPair; k++) {
        simulateBattle(characters[i], characters[j]);
      }
    }
  }
}