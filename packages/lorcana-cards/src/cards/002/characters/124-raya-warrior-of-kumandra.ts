import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaWarriorOfKumandra: CharacterCard = {
  id: "dyk",
  cardType: "character",
  name: "Raya",
  version: "Warrior of Kumandra",
  fullName: "Raya - Warrior of Kumandra",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  cardNumber: 124,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "3250060df7f4fd11ca6980bbeb750a59d5b24581",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const rayaWarriorOfKumandra: LorcanitoCharacterCard = {
//   id: "goj",
//   name: "Raya",
//   title: "Warrior of Kumandra",
//   characteristics: ["hero", "storyborn", "princess"],
//   type: "character",
//   flavour: "My ba dreams of a united Kumandra. I fight to honor that dream.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Matthew Robert Davies",
//   number: 124,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516427,
//   },
//   rarity: "uncommon",
// };
//
