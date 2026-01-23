import type { CharacterCard } from "@tcg/lorcana-types";

export const yaoImperialSoldier: CharacterCard = {
  id: "ayj",
  cardType: "character",
  name: "Yao",
  version: "Imperial Soldier",
  fullName: "Yao - Imperial Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  externalIds: {
    ravensburger: "277f711b5cc9107e8bae7d0ab1d79e8e08ca13f3",
  },
  abilities: [
    {
      id: "ayj-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const yaoImperialSoldier: LorcanitoCharacterCard = {
//   id: "wch",
//   name: "Yao",
//   title: "Imperial Soldier",
//   characteristics: ["storyborn", "ally"],
//   text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_",
//   type: "character",
//   abilities: [challengerAbility(2)],
//   flavour: "I'm gonna hit you so hard, it'll make your ancestors dizzy.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Michela Cacciatore / Giulia Priori",
//   number: 194,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550622,
//   },
//   rarity: "common",
// };
//
