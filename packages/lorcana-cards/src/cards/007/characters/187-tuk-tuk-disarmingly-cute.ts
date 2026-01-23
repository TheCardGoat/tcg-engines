import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukDisarminglyCute: CharacterCard = {
  id: "1xz",
  cardType: "character",
  name: "Tuk Tuk",
  version: "Disarmingly Cute",
  fullName: "Tuk Tuk - Disarmingly Cute",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  cost: 2,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 187,
  inkable: false,
  externalIds: {
    ravensburger: "fc3303c43ff9b9600d46c652cda744f6e999e753",
  },
  abilities: [
    {
      id: "1xz-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "1xz-2",
      text: "Resist +2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   bodyguardAbility,
//   resistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const tukTukDisarminglyCute: LorcanitoCharacterCard = {
//   id: "v8s",
//   name: "Tuk Tuk",
//   title: "Disarmingly Cute",
//   characteristics: ["storyborn", "ally"],
//   text: "Bodyguard\nResist +2",
//   type: "character",
//   abilities: [bodyguardAbility, resistAbility(2)],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   strength: 0,
//   willpower: 1,
//   illustrator: "Maria Dresden",
//   number: 187,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619514,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
