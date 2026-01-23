import type { CharacterCard } from "@tcg/lorcana-types";

export const ulfMime: CharacterCard = {
  id: "111",
  cardType: "character",
  name: "Ulf",
  version: "Mime",
  fullName: "Ulf - Mime",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  text: "SILENT PERFORMANCE This character can't {E} to sing songs.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 73,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "85817c98f4f43a007a486a14f7afd0a47aeec8a4",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { voicelessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const ulfMime: LorcanitoCharacterCard = {
//   id: "hyz",
//   name: "Ulf",
//   title: "Mime",
//   characteristics: ["ally"],
//   text: "**SILENT PERFORMANCE** This character can't {E} to sing songs.",
//   type: "character",
//   abilities: [voicelessAbility],
//   flavour: "His performances are unspeakably good.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Matt Chapman",
//   number: 73,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561159,
//   },
//   rarity: "common",
// };
//
