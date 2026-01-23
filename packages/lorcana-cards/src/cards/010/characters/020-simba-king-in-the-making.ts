import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaKingInTheMaking: CharacterCard = {
  id: "dbt",
  cardType: "character",
  name: "Simba",
  version: "King in the Making",
  fullName: "Simba - King in the Making",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "010",
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nTIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  cardNumber: 20,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "300970a7922a3db43c3c7f144ac6eb41c50cc42b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   wheneverYouPutACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { revealTopOfDeckPutInPlayOrDeck } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const simbaKingInTheMaking: LorcanitoCharacterCard = {
//   id: "vw6",
//   name: "Simba",
//   title: "King in the Making",
//   characteristics: ["storyborn", "hero", "prince", "whisper"],
//   text: "Boost 3 (Once during your turn, you may pay 3 to put the top card of your deck facedown under this character.) TIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 7,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Koni",
//   number: 20,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657894,
//   },
//   rarity: "super_rare",
//   lore: 3,
//   abilities: [
//     boostAbility(3),
//     wheneverYouPutACardUnder({
//       name: "TIMELY ALLIANCE",
//       text: "Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
//       optional: true,
//       effects: [
//         {
//           type: "scry",
//           amount: 1,
//           mode: "bottom",
//           tutorFilters: [
//             { filter: "zone", value: "deck" },
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//           ],
//           playFilters: [{ filter: "type", value: "character" }],
//           shouldRevealTutored: true,
//           limits: { ["bottom"]: 1, play: 1 },
//           target: self,
//         },
//         /*{
//           type: "reveal-and-play",
//           putInto: "deck",
//           exerted: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },*/
//       ],
//     }),
//   ],
// };
//
