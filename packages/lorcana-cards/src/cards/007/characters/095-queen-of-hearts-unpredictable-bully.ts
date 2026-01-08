import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsUnpredictableBully: CharacterCard = {
  id: "1pq",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Unpredictable Bully",
  fullName: "Queen of Hearts - Unpredictable Bully",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Queen of Hearts.)\nIF I LOSE MY TEMPER... Whenever another character is played, put a damage counter on them.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 95,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de884385b8d6949128ae14c3ed43527359b2d71d",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const queenOfHeartsUnpredictableBully: LorcanitoCharacterCard = {
//   id: "mky",
//   name: "Queen Of Hearts",
//   title: "Unpredictable Bully",
//   characteristics: ["floodborn", "villain", "queen"],
//   text: "Shift 3\nIF I LOSE MY TEMPER… Whenever another character is played, put a damage counter on them.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Queen Of Hearts"),
//     wheneverPlays({
//       name: "IF I LOSE MY TEMPER…",
//       text: "Whenever another character is played, put a damage counter on them.",
//       excludeSelf: true,
//       triggerTarget: {
//         type: "card",
//         excludeSelf: true,
//         value: 1,
//         filters: [{ filter: "type", value: "character" }],
//       },
//       effects: [
//         putDamageEffect(1, {
//           type: "card",
//           value: "all",
//           filters: [{ filter: "trigger", value: "target" }],
//         }),
//       ],
//     }),
//   ],
//   inkwell: false,
//
//   colors: ["emerald", "ruby"],
//   cost: 5,
//   strength: 2,
//   willpower: 6,
//   illustrator: "Alice Pisoni",
//   number: 95,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618320,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
