import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaKakamoraLeader: CharacterCard = {
  id: "cew",
  cardType: "character",
  name: "Moana",
  version: "Kakamora Leader",
  fullName: "Moana - Kakamora Leader",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)\nGATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 1,
  cardNumber: 121,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2cbd4be598255ef11ca13055090452c77e2f618a",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { anyNumberOfYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   moveToLocation,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const moanaKakamoraLeader: LorcanitoCharacterCard = {
//   id: "j0b",
//   name: "Moana",
//   title: "Kakamora Leader",
//   characteristics: ["floodborn", "hero", "princess", "pirate", "captain"],
//   text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)\nGATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Moana"),
//     {
//       type: "resolution",
//       name: "Gathering Forces",
//       text: "When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
//       optional: true,
//       effects: [
//         {
//           ...moveToLocation(anyNumberOfYourCharacters),
//           forEach: [youGainLore(1)],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 7,
//   strength: 6,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Jared Mathews",
//   number: 121,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588360,
//   },
//   rarity: "rare",
// };
//
