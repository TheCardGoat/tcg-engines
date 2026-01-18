import type { CharacterCard } from "@tcg/lorcana-types";
import { moveCards, optional } from "../../ability-helpers";

export const mickeyMouseWaywardSorcerer: CharacterCard = {
  id: "kuw",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Wayward Sorcerer",
  fullName: "Mickey Mouse - Wayward Sorcerer",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "kuw-1",
      text: "**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
      effect: optional(
        moveCards("play", "hand", {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        }),
      ),
    },
  ],
  classifications: ["Dreamborn", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mickeyMouseWaywardSorcerer: LorcanitoCharacterCard = {
//   id: "kuw",
//
//   name: "Mickey Mouse",
//   title: "Wayward Sorcerer",
//   characteristics: ["dreamborn", "sorcerer"],
//   text: "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       name: "Animate Broom",
//       text: "You pay 1 {I} less to play Broom characters.",
//       ability: "effects",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "static",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["broom"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//     wheneverOneOfYourCharactersIsBanishedInAChallenge({
//       name: "Ceaseless Worker",
//       text: "Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
//       optional: true,
//       triggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "characteristics", value: ["broom"] },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "trigger" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "He always goes for the clean sweep.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Nicholas Kole",
//   number: 51,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492369,
//   },
//   rarity: "super_rare",
// };
//
