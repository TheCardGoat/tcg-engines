import type { CharacterCard } from "@tcg/lorcana-types";

export const kodaTalkativeCub: CharacterCard = {
  id: "r5m",
  cardType: "character",
  name: "Koda",
  version: "Talkative Cub",
  fullName: "Koda - Talkative Cub",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  text: "TELL EVERYBODY During opponents' turns, you can't lose lore.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  cardNumber: 1,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "61dfa38413220473e46c109bcc7a62ead1bddf58",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const kodaTalkativeCub: LorcanitoCharacterCard = {
//   id: "ftx",
//   missingTestCase: true,
//   name: "Koda",
//   title: "Talkative Cub",
//   characteristics: ["storyborn", "ally"],
//   text: "**TELL EVERYBODY** During opponents' turns, you can't lose lore.",
//   type: "character",
//   abilities: [
//     // TODO: I'm not implementing this
//     // {
//     //   name: "**TELL EVERYBODY** During opponents' turns, you can't lose lore.",
//     // },
//   ],
//   flavour: "I mean, I don't want to brag or nothing, but I got some moves.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Therese Vildefall",
//   number: 1,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560505,
//   },
//   rarity: "rare",
// };
//
