import type { CharacterCard } from "@tcg/lorcana-types";

export const hookHandUnexpectedlyFriendly: CharacterCard = {
  id: "1fk",
  cardType: "character",
  name: "Hook Hand",
  version: "Unexpectedly Friendly",
  fullName: "Hook Hand - Unexpectedly Friendly",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 78,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "b9db12f9097a9ea423a29f99322eac89851d96a7",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const hookHandUnexpectedlyFriendly: LorcanitoCharacterCard = {
//   id: "zyg",
//   name: "Hook Hand",
//   title: "Unexpectedly Friendly",
//   characteristics: ["storyborn", "ally"],
//   text: "",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 6,
//   willpower: 5,
//   illustrator: "Jochem van Gool",
//   number: 78,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659185,
//   },
//   rarity: "uncommon",
//   abilities: [],
//   lore: 2,
// };
//
