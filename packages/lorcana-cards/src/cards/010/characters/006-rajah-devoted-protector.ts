import type { CharacterCard } from "@tcg/lorcana-types";

export const rajahDevotedProtector: CharacterCard = {
  id: "1gk",
  cardType: "character",
  name: "Rajah",
  version: "Devoted Protector",
  fullName: "Rajah - Devoted Protector",
  inkType: ["amber"],
  franchise: "Aladdin",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  externalIds: {
    ravensburger: "05432111c47bf28eb52d76930eb2c603642d13e9",
  },
  abilities: [
    {
      id: "1gk-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const rajahDevotedProtector: LorcanitoCharacterCard = {
//   id: "fbf",
//   name: "Rajah",
//   title: "Devoted Protector",
//   characteristics: ["storyborn", "ally"],
//   text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Andrea Femerstrand",
//   number: 6,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659444,
//   },
//   rarity: "common",
//   abilities: [bodyguardAbility],
//   lore: 1,
// };
//
