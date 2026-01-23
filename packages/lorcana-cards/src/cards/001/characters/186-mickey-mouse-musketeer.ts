import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseMusketeer: CharacterCard = {
  id: "9h9",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Musketeer",
  fullName: "Mickey Mouse - Musketeer",
  inkType: ["steel"],
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nALL FOR ONE Your other Musketeer characters get +1 {S}.",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  cardNumber: 186,
  inkable: true,
  externalIds: {
    ravensburger: "222a49ab00ebfa5c98e9df4f600b676cbbeb4f6d",
  },
  abilities: [
    {
      id: "9h9-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "9h9-2",
      text: "ALL FOR ONE Your other Musketeer characters get +1 {S}.",
      name: "ALL FOR ONE",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mickeyMouseMusketeer: LorcanitoCharacterCard = {
//   id: "o71",
//   name: "Mickey Mouse",
//   title: "Musketeer",
//   characteristics: ["hero", "dreamborn", "musketeer"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n**ALL FOR ONE** Your other Musketeer characters\rget +1 {S}.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "All For One",
//       text: "Your other Musketeer characters get +1 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["musketeer"] },
//             ],
//           },
//         },
//       ],
//     },
//     bodyguardAbility,
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 2,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Jochem Van Gool",
//   number: 186,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494141,
//   },
//   rarity: "rare",
// };
//
