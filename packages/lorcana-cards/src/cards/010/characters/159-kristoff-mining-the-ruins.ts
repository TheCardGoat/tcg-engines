import type { CharacterCard } from "@tcg/lorcana-types";

export const kristoffMiningTheRuins: CharacterCard = {
  id: "abh",
  cardType: "character",
  name: "Kristoff",
  version: "Mining the Ruins",
  fullName: "Kristoff - Mining the Ruins",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nWORTH MINING Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 159,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25306da70d3153e36ca5d991f62a889aab375668",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kristoffMiningTheRuins: LorcanitoCharacterCard = {
//   id: "fnv",
//   name: "Kristoff",
//   title: "Mining the Ruins",
//   characteristics: ["storyborn", "ally"],
//   text: "Boost 1 {I}\n\nA TREASURE THAT MUST BE EARNED Whenever this character quests, if there is a card under it, put the top card of your deck into your inkwell, facedown and exerted.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Alejandro Hernandez",
//   number: 159,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659386,
//   },
//   rarity: "rare",
//   abilities: [
//     boostAbility(1),
//     wheneverThisCharacterQuests({
//       name: "A TREASURE THAT MUST BE EARNED",
//       text: "Whenever this character quests, if there is a card under it, put the top card of your deck into your inkwell, facedown and exerted.",
//       conditions: [ifThereIsACardUnder],
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//     }),
//   ],
//   lore: 2,
// };
//
