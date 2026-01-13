import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinBarrelingThrough: CharacterCard = {
  id: "1tr",
  cardType: "character",
  name: "Aladdin",
  version: "Barreling Through",
  fullName: "Aladdin - Barreling Through",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nReckless (This character can't quest and must challenge each turn if able.)\nONLY THE BOLD While there's a card under this character, your characters with Reckless gain \"{E} — Gain 1 lore.\"",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 0,
  cardNumber: 123,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed0e8b252efd03eae187446ea108525112c0df0b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   recklessAbility,
//   targetCharacterGains,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const aladdinBarrelingThrough: LorcanitoCharacterCard = {
//   id: "aqr",
//   name: "Aladdin",
//   title: "Barreling Through",
//   characteristics: ["storyborn", "hero", "whisper"],
//   text: 'Boost 1\n\nReckless\n\nONLY THE BOLD While there\'s a card under this character, your characters with Reckless gain " {E} — Gain 1 lore."',
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 4,
//   illustrator: "E. Melaranci / Mario O. Gabriele",
//   number: 123,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659243,
//   },
//   rarity: "rare",
//   lore: 0,
//   abilities: [
//     boostAbility(1),
//     recklessAbility,
//     targetCharacterGains({
//       name: "ONLY THE BOLD",
//       conditions: [ifThereIsACardUnder],
//       text: 'While there\'s a card under this character, your characters with Reckless gain " {E} — Gain 1 lore."',
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: false,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           { filter: "ability", value: "reckless" },
//         ],
//       },
//       gainedAbility: {
//         name: "ONLY THE BOLD",
//         type: "activated",
//         text: "{E} — Gain 1 lore.",
//         costs: [{ type: "exert" }],
//         effects: [youGainLore(1)],
//       },
//     }),
//   ],
// };
//
