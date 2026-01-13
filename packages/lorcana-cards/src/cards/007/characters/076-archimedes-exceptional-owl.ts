import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesExceptionalOwl: CharacterCard = {
  id: "crp",
  cardType: "character",
  name: "Archimedes",
  version: "Exceptional Owl",
  fullName: "Archimedes - Exceptional Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "007",
  text: "MORE TO LEARN Whenever an opponent chooses this character for an action or ability, you may draw a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 76,
  inkable: true,
  externalIds: {
    ravensburger: "2e059909be50ae3de97d3674f118f6da8e648180",
  },
  abilities: [
    {
      id: "crp-1",
      type: "triggered",
      name: "MORE TO LEARN",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "MORE TO LEARN Whenever an opponent chooses this character for an action or ability, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenThisIsTargeted } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const archimedesExceptionalOwl: LorcanitoCharacterCard = {
//   id: "vig",
//   name: "Archimedes",
//   title: "Exceptional Owl",
//   characteristics: ["storyborn", "ally"],
//   text: "LEARN MORE Whenever an opponent chooses this character for an action or ability, you may draw a card.",
//   type: "character",
//   abilities: [
//     whenThisIsTargeted({
//       name: "LEARN MORE",
//       text: "Whenever an opponent chooses this character for an action or ability, you may draw a card.",
//       effects: drawACard,
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Luis Huerta",
//   number: 76,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618700,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
