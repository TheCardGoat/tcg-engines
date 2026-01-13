import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraPullingTheStrings: CharacterCard = {
  id: "kv6",
  cardType: "character",
  name: "Megara",
  version: "Pulling the Strings",
  fullName: "Megara - Pulling the Strings",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
      id: "kv6-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const megaraPullingTheStrings: LorcanitoCharacterCard = {
//   id: "kv6",
//   reprints: ["g7m"],
//   name: "Megara",
//   title: "Pulling the Strings",
//   characteristics: ["dreamborn", "ally"],
//   text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
//   type: "character",
//   illustrator: "Aubrey Archer",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Wonder Boy",
//       text: "When you play this character, chosen character gets +2 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "A deal's a deal. But falling in love was never supposed to be part of it.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   number: 87,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507124,
//   },
//   rarity: "common",
// };
//
