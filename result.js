export function printResults(characters, totalFightsPerChar) {
  const sorted = characters.slice().sort((a, b) => b.wins - a.wins);

  console.log("Wyniki turnieju:");
  sorted.forEach(char => {
    const winRate = ((char.wins / totalFightsPerChar) * 100).toFixed(2);
    console.log(`${char.name}: ${char.wins} zwycięstw (${winRate}%)`);
  });
}
