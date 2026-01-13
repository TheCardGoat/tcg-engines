import type { CharacterCard } from "@tcg/lorcana-types";

export const annaHeirToArendelle: CharacterCard = {
  id: "ibd",
  cardType: "character",
  name: "Anna",
  version: "Heir to Arendelle",
  fullName: "Anna - Heir to Arendelle",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      id: "ibd-1",
      type: "triggered",
      name: "LOVING HEART",
      text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
    },
  ],
  classifications: ["Hero", "Queen", "Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { haveElsaInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const annaHeirToArendelle: LorcanitoCharacterCard = {
//   id: "ibd",
//   name: "Anna",
//   title: "Heir to Arendelle",
//   characteristics: ["hero", "queen", "storyborn"],
//   text: "**LOVING HEART** When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       resolutionConditions: [haveElsaInPlay],
//       name: "Loving Heart",
//       text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "ready-at-start-of-turn",
//           duration: "next_turn",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "Two sisters, one mind.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Valerio Buonfantino",
//   number: 35,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 504444,
//   },
//   rarity: "uncommon",
// };
//
