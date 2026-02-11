import type { CharacterCard } from "@tcg/lorcana-types";

export const annaHeirToArendelle: CharacterCard = {
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Elsa",
        controller: "you",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        duration: "until-start-of-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "ibd-1",
      name: "LOVING HEART",
      text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 35,
  cardType: "character",
  classifications: ["Hero", "Queen", "Storyborn"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Frozen",
  fullName: "Anna - Heir to Arendelle",
  id: "ibd",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Anna",
  set: "001",
  strength: 2,
  text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
  version: "Heir to Arendelle",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { haveElsaInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const annaHeirToArendelle: LorcanitoCharacterCard = {
//   Id: "ibd",
//   Name: "Anna",
//   Title: "Heir to Arendelle",
//   Characteristics: ["hero", "queen", "storyborn"],
//   Text: "**LOVING HEART** When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       ResolutionConditions: [haveElsaInPlay],
//       Name: "Loving Heart",
//       Text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
//       Effects: [
//         {
//           Type: "restriction",
//           Restriction: "ready-at-start-of-turn",
//           Duration: "next_turn",
//           Target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   Flavour: "Two sisters, one mind.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Valerio Buonfantino",
//   Number: 35,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 504444,
//   },
//   Rarity: "uncommon",
// };
//
