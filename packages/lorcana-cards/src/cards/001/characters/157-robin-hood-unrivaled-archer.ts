import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodUnrivaledArcher: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "an opponent has more cards in their hand than you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "conditional",
      },
      id: "dq9-1",
      text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
      type: "action",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Hero", "Storyborn"],
  cost: 6,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Robin Hood - Unrivaled Archer",
  id: "dq9",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Robin Hood",
  set: "001",
  strength: 4,
  text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
  version: "Unrivaled Archer",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// Export const robinHoodUnrivaledArcher: LorcanitoCharacterCard = {
//   Id: "dq9",
//   Reprints: ["l10"],
//   Name: "Robin Hood",
//   Title: "Unrivaled Archer",
//   Characteristics: ["hero", "storyborn"],
//   Text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Feed The Poor",
//       Text: "When you play this character, if an opponent has more cards in their hand than you, draw a card.",
//       ResolutionConditions: [
//         {
//           Type: "hand",
//           Amount: "lt",
//         } as Condition,
//       ],
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//     WhileConditionThisCharacterGains({
//       Name: "Good Shot",
//       Text: "During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
//       Ability: evasiveAbility,
//       Conditions: [
//         {
//           Type: "during-turn",
//           Value: "self",
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     '"We never rob. We just sort of borrow a bit from those who can afford it."',
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 6,
//   Strength: 4,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "John Loren",
//   Number: 157,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492707,
//   },
//   Rarity: "super_rare",
// };
//
