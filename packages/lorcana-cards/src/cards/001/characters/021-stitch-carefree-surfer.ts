import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchCarefreeSurfer: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          comparison: "greater-or-equal",
          controller: "you",
          count: 2,
          type: "has-character-count",
          // Note: The ability text says "2 or more OTHER characters"
          // The engine should check characters excluding self when resolving
        },
        then: {
          chooser: "CONTROLLER",
          effect: {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          type: "optional",
        },
        type: "conditional",
      },
      id: "jzu-1",
      name: "OHANA",
      text: "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Alien"],
  cost: 7,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Stitch - Carefree Surfer",
  id: "jzu",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Stitch",
  set: "001",
  strength: 4,
  text: "**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
  version: "Carefree Surfer",
  willpower: 8,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const stichtCarefreeSurfer: LorcanitoCharacterCard = {
//   Id: "jzu",
//   Reprints: ["jdo"],
//   Name: "Stitch",
//   Title: "Carefree Surfer",
//   Characteristics: ["hero", "dreamborn", "alien"],
//   Text: "**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Ohana",
//       Text: "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
//       ResolutionConditions: [
//         { type: "play", comparison: { operator: "gte", value: 3 } },
//       ],
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 2,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "So you're from outer space, huh? I hear the surfing's choice.\n−David",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 7,
//   Strength: 4,
//   Willpower: 8,
//   Lore: 2,
//   Illustrator: "Marcel Berg",
//   Number: 21,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 502009,
//   },
//   Rarity: "legendary",
// };
//
