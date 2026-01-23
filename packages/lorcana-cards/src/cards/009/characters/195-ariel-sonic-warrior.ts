import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSonicWarrior: CharacterCard = {
  id: "tfb",
  cardType: "character",
  name: "Ariel",
  version: "Sonic Warrior",
  fullName: "Ariel - Sonic Warrior",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Ariel.)\nAMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  cardNumber: 195,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6a0d7fa630c6ddef725f555467e4c5b51515a664",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { arielSonicWarrior as ogArielSonicWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/175-ariel-sonic-warrior";
//
// export const arielSonicWarrior: LorcanitoCharacterCard = {
//   ...ogArielSonicWarrior,
//   id: "hbk",
//   reprints: [ogArielSonicWarrior.id],
//   number: 195,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650128,
//   },
// };
//
