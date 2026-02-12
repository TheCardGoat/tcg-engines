import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentMonstrousDragon: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "b6l-1",
      text: "**MALEFICENT'S SCEPTER** You may banish chosen character.",
      type: "action",
    },
  ],
  cardNumber: 113,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Dragon"],
  cost: 9,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Maleficent - Monstrous Dragon",
  id: "gs4",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  name: "Maleficent",
  set: "001",
  strength: 7,
  text: "**Dragon Fire** When you play this character, you may banish chosen character.",
  version: "Monstrous Dragon",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { banishChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const maleficentMonstrousDragon: LorcanitoCharacterCard = {
//   Id: "gs4",
//   Reprints: ["c6o"],
//
//   Name: "Maleficent",
//   Title: "Monstrous Dragon",
//   Characteristics: ["storyborn", "villain", "dragon"],
//   Text: "**Dragon Fire** When you play this character, you may banish chosen character.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Dragon Fire",
//       Text: "When you play this character, you may banish chosen character.",
//       Optional: true,
//       Effects: [banishChosenCharacter],
//     }),
//   ],
//   Flavour:
//     "The ninth Rule of Villainy: When all else fails, turn into a dragon.",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 9,
//   Strength: 7,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Luis Huerta",
//   Number: 113,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492706,
//   },
//   Rarity: "legendary",
// };
//
