import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaSnowQueen: CharacterCard = {
  id: "u2z",
  cardType: "character",
  name: "Elsa",
  version: "Snow Queen",
  fullName: "Elsa - Snow Queen",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Freeze** {E} - Exert chosen opposing character.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 41,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Hero", "Dreamborn", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const elsaSnowQueen: LorcanitoCharacterCard = {
//   id: "u2z",
//   reprints: ["hcz"],
//   name: "Elsa",
//   title: "Snow Queen",
//   characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
//   text: "**Freeze** {E} - Exert chosen opposing character.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "Freeze",
//       text: "Exert chosen opposing character.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "Recreated by magical ink, Elsa found herself in an unfamiliar new world. Fortunately, ice works the same way everywhere.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Nicholas Kole",
//   number: 41,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492705,
//   },
//   rarity: "uncommon",
// };
//
