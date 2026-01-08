import type { CharacterCard } from "@tcg/lorcana-types";

export const mattiasArendelleGeneral: CharacterCard = {
  id: "f9s",
  cardType: "character",
  name: "Mattias",
  version: "Arendelle General",
  fullName: "Mattias - Arendelle General",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "PROUD TO SERVE Your Queen characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 155,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "370ac9a4fe75cd66bd7260022d0a49e58bd67d78",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Knight"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mattiasArendelleGeneral: LorcanitoCharacterCard = {
//   id: "nam",
//   name: "Mattias",
//   title: "Arendelle General",
//   characteristics: ["storyborn", "ally", "knight"],
//   text: "PROUD TO SERVE Your Queen characters gain Ward.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "PROUD TO SERVE",
//       text: "Your Queen characters gain Ward.",
//       gainedAbility: wardAbility,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "characteristics", value: ["queen"] },
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Samantha Edrini",
//   number: 155,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619494,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
