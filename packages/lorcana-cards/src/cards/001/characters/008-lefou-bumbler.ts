import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouBumbler: CharacterCard = {
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Gaston",
        controller: "you",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
      },
      id: "9i4-1",
      name: "LOYAL",
      text: "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
      type: "static",
    },
  ],
  cardNumber: 8,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "224000dbb0cebd90c025c1855cfddd5fe747691f",
  },
  franchise: "Beauty and the Beast",
  fullName: "LeFou - Bumbler",
  id: "9i4",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "LeFou",
  set: "001",
  strength: 1,
  text: "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
  version: "Bumbler",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const lefouBumbler: LorcanitoCharacterCard = {
//   Id: "eal",
//   Name: "Lefou",
//   Title: "Bumbler",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**LOYAL** If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisForEachYouPayLess({
//       Name: "Loyal",
//       Text: "If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
//       Amount: 1,
//       Conditions: [ifYouHaveCharacterNamed("Gaston")],
//     }),
//   ],
//   Flavour: "You need a good toady to be a proper bad guy.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 2,
//   Lore: 2,
//   Illustrator: "Andrey Chomak",
//   Number: 8,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492738,
//   },
//   Rarity: "uncommon",
// };
//
