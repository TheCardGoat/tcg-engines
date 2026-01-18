import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../ability-helpers";

export const hadesKingOfOlympus: CharacterCard = {
  id: "1e5",
  cardType: "character",
  name: "Hades",
  version: "King of Olympus",
  fullName: "Hades - King of Olympus",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "001",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Hades.)\nSINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.",
  cost: 8,
  strength: 6,
  willpower: 7,
  lore: 1,
  cardNumber: 5,
  inkable: false,
  externalIds: {
    ravensburger: "b49576fe526d49f6abcdf5af9e3eb03f64505194",
  },
  abilities: [
    shift("1e5-1", 6, "Hades"),
    {
      id: "1e5-2",
      text: "SINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.",
      name: "SINISTER PLOT",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "classification-character-count",
          classification: "Villain",
          controller: "you",
        },
        target: "SELF",
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hadesKingOfOlympus: LorcanitoCharacterCard = {
//   id: "j9i",
//   name: "Hades",
//   title: "King of Olympus",
//   characteristics: ["floodborn", "villain", "king", "deity"],
//   text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Hades._)\n**Sinister plot** This character gets +1 {L} for every other Villain character you have in play.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Sinister plot",
//       text: "This character gets +1 {L} for every other Villain character you have in play.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           modifier: "add",
//           target: thisCharacter,
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["villain"] },
//             ],
//           },
//         },
//       ],
//     },
//     shiftAbility(6, "Hades"),
//   ],
//   flavour: "Oh hey, I'm gonna need new business cards.",
//   colors: ["amber"],
//   cost: 8,
//   strength: 6,
//   willpower: 7,
//   lore: 1,
//   illustrator: "Alex Accorsi",
//   number: 5,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 516775,
//   },
//   rarity: "rare",
// };
//
