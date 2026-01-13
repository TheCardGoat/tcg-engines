import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodUnrivaledArcher: CharacterCard = {
  id: "dq9",
  cardType: "character",
  name: "Robin Hood",
  version: "Unrivaled Archer",
  fullName: "Robin Hood - Unrivaled Archer",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
      id: "dq9-1",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has more cards in their hand than you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Hero", "Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// export const robinHoodUnrivaledArcher: LorcanitoCharacterCard = {
//   id: "dq9",
//   reprints: ["l10"],
//   name: "Robin Hood",
//   title: "Unrivaled Archer",
//   characteristics: ["hero", "storyborn"],
//   text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Feed The Poor",
//       text: "When you play this character, if an opponent has more cards in their hand than you, draw a card.",
//       resolutionConditions: [
//         {
//           type: "hand",
//           amount: "lt",
//         } as Condition,
//       ],
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//     whileConditionThisCharacterGains({
//       name: "Good Shot",
//       text: "During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
//       ability: evasiveAbility,
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//     }),
//   ],
//   flavour:
//     '"We never rob. We just sort of borrow a bit from those who can afford it."',
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "John Loren",
//   number: 157,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492707,
//   },
//   rarity: "super_rare",
// };
//
