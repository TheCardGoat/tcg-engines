import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesLordOfTheUnderworld: CharacterCard = {
  id: "1yp",
  cardType: "character",
  name: "Hades",
  version: "Lord of the Underworld",
  fullName: "Hades - Lord of the Underworld",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "001",
  text: "WELL OF SOULS When you play this character, return a character card from your discard to your hand.",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: false,
  externalIds: {
    ravensburger: "fee01a363b4de2d6f92c340520d2adaea461f380",
  },
  abilities: [
    {
      id: "1yp-1",
      text: "WELL OF SOULS When you play this character, return a character card from your discard to your hand.",
      name: "WELL OF SOULS",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-from-discard",
        cardType: "character",
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hadesLordOfUnderworld: LorcanitoCharacterCard = {
//   id: "kaz",
//   name: "Hades",
//   title: "Lord of the Underworld",
//   characteristics: ["storyborn", "villain", "deity"],
//   text: "**WELL OF SOULS** When you play this character, return a character card from your discard to your hand.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "WELL OF SOULS",
//       text: "When you play this character, return a character card from your discard to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           exerted: false,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     '"Production is up, costs are down, the rivers are full. Time to talk expansion."',
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Randy Bishop",
//   number: 6,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493480,
//   },
//   rarity: "rare",
// };
//
