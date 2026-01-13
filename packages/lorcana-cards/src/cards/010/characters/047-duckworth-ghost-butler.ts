import type { CharacterCard } from "@tcg/lorcana-types";

export const duckworthGhostButler: CharacterCard = {
  id: "1a3",
  cardType: "character",
  name: "Duckworth",
  version: "Ghost Butler",
  fullName: "Duckworth - Ghost Butler",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "Rush (This character can challenge the turn they're played.)\nFINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  cardNumber: 47,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a61ffd6081ddf7abbd9f662708d7db139dedca28",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { boostTargetCharOrLocationWithBoostAbility } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const duckworthGhostButler: LorcanitoCharacterCard = {
//   id: "j2j",
//   name: "Duckworth",
//   title: "Ghost Butler",
//   characteristics: ["storyborn", "ally", "ghost"],
//   text: "Rush (This character can challenge the turn they're played.) FINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
//   type: "character",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 1,
//   illustrator: "Brian Kesinger",
//   number: 47,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658331,
//   },
//   rarity: "uncommon",
//   lore: 2,
//   abilities: [
//     rushAbility,
//     whenThisCharacterBanished({
//       name: "FINAL ACT",
//       text: "During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
//       optional: true,
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       effects: [boostTargetCharOrLocationWithBoostAbility],
//     }),
//   ],
// };
//
