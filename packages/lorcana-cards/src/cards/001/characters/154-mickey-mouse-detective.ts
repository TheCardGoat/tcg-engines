import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseDetective: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "aec-1",
      text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Detective"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Mickey Mouse - Detective",
  id: "aec",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Mickey Mouse",
  set: "001",
  strength: 1,
  text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Detective",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mickeyMouseDetective: LorcanitoCharacterCard = {
//   Id: "aec",
//   Reprints: ["crp"],
//   Name: "Mickey Mouse",
//   Title: "Detective",
//   Characteristics: ["hero", "dreamborn", "detective"],
//   Text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Get a Clue",
//       Text: "When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//     }),
//   ],
//   Flavour:
//     "Wherever the seaweed had come from, Mickey was sure of one thing: something fishy was going on.",
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Jared Nickerl",
//   Number: 154,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508863,
//   },
//   Rarity: "common",
// };
//
