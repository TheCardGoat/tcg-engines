import type { CharacterCard } from "@tcg/lorcana-types";

export const crikeeGoodLuckCharm: CharacterCard = {
  id: "1gx",
  cardType: "character",
  name: "Cri-Kee",
  version: "Good Luck Charm",
  fullName: "Cri-Kee - Good Luck Charm",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "010",
  text: "Alert (This character can challenge as if they had Evasive.)",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 142,
  inkable: true,
  externalIds: {
    ravensburger: "becfbb1f4251f07b2c92bee5465e8d8cbf12d90f",
  },
  abilities: [
    {
      id: "1gx-1",
      type: "keyword",
      keyword: "Alert",
      text: "Alert",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { alertAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const crikeeGoodLuckCharm: LorcanitoCharacterCard = {
//   id: "xht",
//   name: "Cri-Kee",
//   title: "Good Luck Charm",
//   characteristics: ["storyborn", "ally"],
//   text: "Alert (This character can challenge as if they had Evasive.)",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Kapik",
//   number: 142,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659454,
//   },
//   rarity: "common",
//   abilities: [alertAbility],
//   lore: 1,
// };
//
