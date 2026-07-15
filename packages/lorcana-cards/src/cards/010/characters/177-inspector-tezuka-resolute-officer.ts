import type { CharacterCard } from "@tcg/lorcana-types";

export const inspectorTezukaResoluteOfficer: CharacterCard = {
  abilities: [
    {
      id: "15o-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 177,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Detective"],
  cost: 2,
  externalIds: {
    ravensburger: "9644b567eec1691484deb7950ab8728fb6fdc9a8",
  },
  franchise: "Ducktales",
  fullName: "Inspector Tezuka - Resolute Officer",
  id: "15o",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Inspector Tezuka",
  set: "010",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Resolute Officer",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const inspectorTezukaResoluteOfficer: LorcanitoCharacterCard = {
//   Id: "e5q",
//   Name: "Inspector Tezuka",
//   Title: "Resolute Officer",
//   Characteristics: ["storyborn", "ally", "detective"],
//   Text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 3,
//   Illustrator: "SOWSOW",
//   Number: 177,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659404,
//   },
//   Rarity: "common",
//   Abilities: [bodyguardAbility],
//   Lore: 1,
// };
//
