import type { CharacterCard } from "@tcg/lorcana-types";

export const joshuaSweetTheDoctor: CharacterCard = {
  id: "1qp",
  cardType: "character",
  name: "Joshua Sweet",
  version: "The Doctor",
  fullName: "Joshua Sweet - The Doctor",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 5,
  inkable: true,
  externalIds: {
    ravensburger: "e1f557b29f945126b59c4ccace8ec9ba4c9e013a",
  },
  abilities: [
    {
      id: "1qp-1",
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
// export const joshuaSweetTheDoctor: LorcanitoCharacterCard = {
//   id: "xtr",
//   missingTestCase: true,
//   name: "Joshua Sweet",
//   title: "The Doctor",
//   characteristics: ["storyborn", "ally"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [bodyguardAbility],
//   flavour:
//     "Heading out to the Inklands? Come on back if youu need patching up.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Jeanne Plounevez",
//   number: 5,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537753,
//   },
//   rarity: "common",
// };
//
