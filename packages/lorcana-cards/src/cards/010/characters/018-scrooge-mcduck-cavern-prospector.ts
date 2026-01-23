import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckCavernProspector: CharacterCard = {
  id: "1hq",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Cavern Prospector",
  fullName: "Scrooge McDuck - Cavern Prospector",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Scrooge McDuck.)\nSPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 18,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c1b31199a4eabc9db83d0b06451215bcffc9cd01",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { boostEffect } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const scroogeMcduckCavernProspector: LorcanitoCharacterCard = {
//   id: "dyj",
//   name: "Scrooge McDuck",
//   title: "Cavern Prospector",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 4\n\nSPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 4,
//   willpower: 7,
//   illustrator: "Giulia Riva",
//   number: 18,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658381,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     shiftAbility(4, "Scrooge McDuck"),
//     wheneverPlays({
//       name: "SPECULATION",
//       text: "Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.",
//       optional: true,
//       triggerTarget: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: ["character", "location"] },
//           { filter: "ability", value: "booster" },
//         ],
//       },
//       effects: [
//         boostEffect({
//           amount: 1,
//           isTargetUnderCard: false,
//           putTopCardOfDeck: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "trigger", value: "target" }],
//           },
//         }),
//       ],
//     }),
//   ],
// };
//
