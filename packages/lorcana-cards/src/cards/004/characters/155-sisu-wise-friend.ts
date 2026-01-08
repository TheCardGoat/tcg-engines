import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuWiseFriend: CharacterCard = {
  id: "1x9",
  cardType: "character",
  name: "Sisu",
  version: "Wise Friend",
  fullName: "Sisu - Wise Friend",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 155,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "f9066489842cd5114638475ac90dd1dd703af293",
  },
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const sisuWiseFriend: LorcanitoCharacterCard = {
//   id: "lgb",
//   name: "Sisu",
//   title: "Wise Friend",
//   characteristics: ["hero", "storyborn", "dragon", "deity"],
//   type: "character",
//   flavour:
//     "It may feel impossible, but sometimes, you just have to take the first step, even before you're ready.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 6,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Roger Pérez / Hayley Evans",
//   number: 155,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550527,
//   },
//   rarity: "uncommon",
// };
//
