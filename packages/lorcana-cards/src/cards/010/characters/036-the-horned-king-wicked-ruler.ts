import type { CharacterCard } from "@tcg/lorcana-types";

export const theHornedKingWickedRuler: CharacterCard = {
  id: "wsd",
  cardType: "character",
  name: "The Horned King",
  version: "Wicked Ruler",
  fullName: "The Horned King - Wicked Ruler",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named The Horned King.)\nARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 36,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "762bf4996db320a872b029620a950194a7fa82e0",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "King", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYourCharIsBanishedInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theHornedKingWickedRuler: LorcanitoCharacterCard = {
//   id: "e8u",
//   name: "The Horned King",
//   title: "Wicked Ruler",
//   characteristics: ["floodborn", "villain", "king", "sorcerer"],
//   text: "Shift 2 (You may pay 2 to play this on top of one of your characters named The Horned King.) ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Julian del Rey",
//   number: 36,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657897,
//   },
//   rarity: "super_rare",
//   lore: 2,
//   abilities: [
//     shiftAbility(2, "The Horned King"),
//     wheneverYourCharIsBanishedInChallenge({
//       name: "ARISE!",
//       text: "Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
//       optional: true,
//       excludeSelf: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "trigger" }],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               responder: "self",
//               effects: [discardACard],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
// };
//
