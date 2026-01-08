import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentMonstrousDragon: CharacterCard = {
  id: "gs4",
  cardType: "character",
  name: "Maleficent",
  version: "Monstrous Dragon",
  fullName: "Maleficent - Monstrous Dragon",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Dragon Fire** When you play this character, you may banish chosen character.",
  cost: 9,
  strength: 7,
  willpower: 5,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "b6l-1",
      text: "**MALEFICENT'S SCEPTER** You may banish chosen character.",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { banishChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const maleficentMonstrousDragon: LorcanitoCharacterCard = {
//   id: "gs4",
//   reprints: ["c6o"],
//
//   name: "Maleficent",
//   title: "Monstrous Dragon",
//   characteristics: ["storyborn", "villain", "dragon"],
//   text: "**Dragon Fire** When you play this character, you may banish chosen character.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Dragon Fire",
//       text: "When you play this character, you may banish chosen character.",
//       optional: true,
//       effects: [banishChosenCharacter],
//     }),
//   ],
//   flavour:
//     "The ninth Rule of Villainy: When all else fails, turn into a dragon.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 9,
//   strength: 7,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Luis Huerta",
//   number: 113,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492706,
//   },
//   rarity: "legendary",
// };
//
