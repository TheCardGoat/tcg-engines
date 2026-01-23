import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarKeeperOfSecrets: CharacterCard = {
  id: "rau",
  cardType: "character",
  name: "Jafar",
  version: "Keeper of Secrets",
  fullName: "Jafar - Keeper of Secrets",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
  cost: 4,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 44,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
      id: "rau-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
    },
  ],
  classifications: ["Dreamborn", "Sorcerer", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jafarKeeperOfSecrets: LorcanitoCharacterCard = {
//   id: "rau",
//   reprints: ["f6f"],
//   name: "Jafar",
//   title: "Keeper of Secrets",
//   characteristics: ["dreamborn", "sorcerer", "villain"],
//   text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Hidden Wonders",
//       text: "This character gets +1 {S} for each card in your hand.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "There's more than one way to bury secrets.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   willpower: 5,
//   strength: 0,
//   lore: 2,
//   illustrator: "Marcel Berg",
//   number: 44,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507719,
//   },
//   rarity: "rare",
// };
//
