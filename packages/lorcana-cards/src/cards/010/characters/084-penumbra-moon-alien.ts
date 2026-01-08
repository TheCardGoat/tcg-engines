import type { CharacterCard } from "@tcg/lorcana-types";

export const penumbraMoonAlien: CharacterCard = {
  id: "88t",
  cardType: "character",
  name: "Penumbra",
  version: "Moon Alien",
  fullName: "Penumbra - Moon Alien",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cost: 5,
  strength: 7,
  willpower: 6,
  lore: 2,
  cardNumber: 84,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "1db6d2ac3b79e966df8659e08b9a3ef5b8872725",
  },
  classifications: ["Storyborn", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const penumbraMoonAlien: LorcanitoCharacterCard = {
//   id: "nv9",
//   name: "Penumbra",
//   title: "Moon Alien",
//   characteristics: ["storyborn", "alien"],
//   text: undefined,
//   type: "character",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 7,
//   willpower: 6,
//   illustrator: "Mike Parker",
//   number: 84,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660366,
//   },
//   rarity: "rare",
//   abilities: [],
//   lore: 2,
// };
//
