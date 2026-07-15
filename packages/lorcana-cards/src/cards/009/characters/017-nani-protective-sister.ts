import type { CharacterCard } from "@tcg/lorcana-types";

export const naniProtectiveSister: CharacterCard = {
  abilities: [
    {
      id: "1fn-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 17,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "ba2f05538e1999601db469cfe0b44f78bcbdb61c",
  },
  franchise: "Lilo and Stitch",
  fullName: "Nani - Protective Sister",
  id: "1fn",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Nani",
  set: "009",
  strength: 3,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Protective Sister",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { naniProtectiveSister as ogNaniProtectiveSister } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// Export const naniProtectiveSister: LorcanitoCharacterCard = {
//   ...ogNaniProtectiveSister,
//   Id: "pws",
//   Reprints: [ogNaniProtectiveSister.id],
//   Number: 17,
//   Set: "009",
//   ExternalIds: {
//     TcgPlayer: 649965,
//   },
// };
//
