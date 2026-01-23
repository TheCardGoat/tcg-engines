import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnLoyalFriend: CharacterCard = {
  id: "1sm",
  cardType: "character",
  name: "Little John",
  version: "Loyal Friend",
  fullName: "Little John - Loyal Friend",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "002",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 84,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "e8f06c9f22b299b64fb4ee57e0e387f17cbf9daf",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const littleJohnLoyalFriend: LorcanitoCharacterCard = {
//   id: "rk6",
//
//   name: "Little John",
//   title: "Loyal Friend",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "What's the rush, Rob? Take a load off! There's plenty of time to go lookin' for lore lost in that crazy ink.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 6,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Cristian Romero",
//   number: 84,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527747,
//   },
//   rarity: "rare",
// };
//
