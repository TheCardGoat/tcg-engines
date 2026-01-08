import type { ItemCard } from "@tcg/lorcana-types";

export const recoveredPage: ItemCard = {
  id: "1xi",
  cardType: "item",
  name: "Recovered Page",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "010",
  text: "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.\nWHISPERED POWER 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
  cost: 2,
  cardNumber: 30,
  inkable: true,
  externalIds: {
    ravensburger: "f91a3a07c482663d66dd0687ea10a6afc04a9f4e",
  },
  abilities: [
    {
      id: "1xi-1",
      text: "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "WHAT IS TO COME",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "look-at-cards",
        amount: 1,
        from: "top-of-deck",
        target: "CONTROLLER",
        then: {
          action: "put-in-hand",
          filter: {
            type: "card-type",
            cardType: "character",
          },
        },
      },
    },
    {
      id: "1xi-2",
      text: "WHISPERED POWER {d} {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
      name: "WHISPERED POWER",
      type: "activated",
      cost: {
        ink: 0,
        banishSelf: true,
      },
      effect: {
        type: "put-under",
        source: "top-of-deck",
        under: {
          selector: "chosen",
          owner: "you",
          filter: [
            {
              type: "has-keyword",
              keyword: "Boost",
            },
          ],
          count: 1,
        },
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { boostTargetCharOrLocationWithBoostAbility } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const recoveredPage: LorcanitoItemCard = {
//   id: "x4n",
//   name: "Recovered Page",
//   characteristics: ["item"],
//   text: "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order. WHISPERED POWER 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
//   type: "item",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Kasia Brzezinska",
//   number: 30,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658330,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenYouPlayThis({
//       name: "WHAT IS TO COME",
//       text: "When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 4,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: {
//             type: "player",
//             value: "self",
//           },
//           limits: {
//             bottom: 4,
//             inkwell: 0,
//             top: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "deck" },
//           ],
//         },
//       ],
//     }),
//     {
//       type: "activated",
//       name: "WHISPERED POWER",
//       text: "1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
//       costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
//       effects: [boostTargetCharOrLocationWithBoostAbility],
//     },
//   ],
// };
//
