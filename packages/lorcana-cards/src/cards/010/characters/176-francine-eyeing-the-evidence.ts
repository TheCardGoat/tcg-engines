import type { CharacterCard } from "@tcg/lorcana-types";

export const francineEyeingTheEvidence: CharacterCard = {
  id: "1bg",
  cardType: "character",
  name: "Francine",
  version: "Eyeing the Evidence",
  fullName: "Francine - Eyeing the Evidence",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 176,
  inkable: true,
  externalIds: {
    ravensburger: "ab013cade204fc90400f1cb148720c2a1914fe37",
  },
  abilities: [
    {
      id: "1bg-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const francineEyeingTheEvidence: LorcanitoCharacterCard = {
//   id: "h3k",
//   name: "Francine",
//   title: "Eyeing the Evidence",
//   characteristics: ["storyborn", "ally", "detective"],
//   text: "Resist +1",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Sandra Rios",
//   number: 176,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659422,
//   },
//   rarity: "common",
//   abilities: [resistAbility(1)],
//   lore: 1,
// };
//
