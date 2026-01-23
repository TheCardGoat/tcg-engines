import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineSoothingPrincess: CharacterCard = {
  id: "1rh",
  cardType: "character",
  name: "Jasmine",
  version: "Soothing Princess",
  fullName: "Jasmine - Soothing Princess",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nUPLIFTING AURA Whenever this character quests, if there’s a card under her, remove up to 3 damage from each of your characters.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 149,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4d864eb426598356a81fd5ded859bbce0e09158",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const jasmineSoothingPrincess: LorcanitoCharacterCard = {
//   id: "fs1",
//   name: "Jasmine",
//   title: "Soothing Princess",
//   characteristics: ["storyborn", "hero", "princess", "whisper"],
//   text: "Boost 2 (Once during your turn, you may pay 2 to put the top card of your deck facedown under this character.) UPLIFTING AURA Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   illustrator: "Shannon Hallstein",
//   number: 149,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658216,
//   },
//   rarity: "uncommon",
//   lore: 2,
//   abilities: [
//     boostAbility(2),
//     wheneverThisCharacterQuests({
//       name: "UPLIFTING AURA",
//       text: "Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.",
//       conditions: [ifThereIsACardUnder],
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
