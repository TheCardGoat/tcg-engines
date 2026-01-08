import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodEphemeralArcher: CharacterCard = {
  id: "1pw",
  cardType: "character",
  name: "Robin Hood",
  version: "Ephemeral Archer",
  fullName: "Robin Hood - Ephemeral Archer",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nEXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 171,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "df1c98b7c8a1c176ffb2e7a8dc37a3f540f9244d",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const robinHoodEphemeralArcher: LorcanitoCharacterCard = {
//   id: "ohf",
//   name: "Robin Hood",
//   title: "Ephemeral Archer",
//   characteristics: ["storyborn", "hero", "whisper"],
//   text: "Boost 1\n\nEXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Stefano Spagnuolo",
//   number: 171,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657893,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     boostAbility(1),
//     wheneverThisCharacterQuests({
//       name: "EXPERT SHOT",
//       text: "Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
//       conditions: [ifThereIsACardUnder],
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 2,
//             upTo: true,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
