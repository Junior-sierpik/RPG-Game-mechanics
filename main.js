import { generateCharacter } from './generator.js';
import { simulateTournament } from './battle.js';
import { printResults } from './results.js';

const NUM_CHARACTERS = 20;
const FIGHTS_PER_PAIR = 100;

const characters = [];

for (let i = 1; i <= NUM_CHARACTERS; i++) {
  characters.push(generateCharacter(i));
}

simulateTournament(characters, FIGHTS_PER_PAIR);
printResults(characters, FIGHTS_PER_PAIR * (NUM_CHARACTERS - 1));
