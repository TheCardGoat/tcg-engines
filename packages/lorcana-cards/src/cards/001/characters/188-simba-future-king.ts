import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaFutureKing: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "q21-1",
      name: "GUESS WHAT?",
      text: "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 188,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 1,
  externalIds: {
    ravensburger: "5de9049716db6093e203ad3ba87b04894b400848",
  },
  franchise: "Lion King",
  fullName: "Simba - Future King",
  id: "q21",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Simba",
  set: "001",
  strength: 1,
  text: "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.",
  version: "Future King",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const simbaFutureKing: LorcanitoCharacterCard = {
//   Id: "umu",
//   Name: "Simba",
//   Title: "Future King",
//   Characteristics: ["hero", "storyborn", "prince"],
//   Text: "**GUESS WHAT?** When you play this character, you may draw a card, then choose and discard a card.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       ...youMayDrawThenChooseAndDiscard,
//       Name: "Guess What?",
//       Text: "When you play this character, you may draw a card, then choose and discard a card.",
//       Type: "resolution",
//     }),
//   ],
//   Flavour: "I'm gonna be the best king the Pride Lands have ever seen!",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 1,
//   Strength: 1,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Nicholas Kole",
//   Number: 188,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 502536,
//   },
//   Rarity: "common",
// };
//
