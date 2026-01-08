import type { CharacterCard } from "@tcg/lorcana-types";

export const tongSurvivor: CharacterCard = {
  id: "qqa",
  cardType: "character",
  name: "Tong",
  version: "Survivor",
  fullName: "Tong - Survivor",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 0,
  cardNumber: 126,
  inkable: false,
  externalIds: {
    ravensburger: "605680cde1ad7c1f3add90d42b8193ca0e197da6",
  },
  abilities: [
    {
      id: "qqa-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const tongSurvivor: LorcanitoCharacterCard = {
//   id: "b8u",
//   name: "Tong",
//   title: "Survivor",
//   characteristics: ["storyborn", "ally"],
//   text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
//   type: "character",
//   abilities: [recklessAbility],
//   flavour: "I too wish to join this fellowship of Druun butt-kickery.",
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 6,
//   illustrator: "Mike Parker",
//   number: 126,
//   lore: 0,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550602,
//   },
//   rarity: "common",
// };
//
