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

    
}