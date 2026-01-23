import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseDetective: CharacterCard = {
  id: "aec",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Detective",
  fullName: "Mickey Mouse - Detective",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      id: "aec-1",
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mickeyMouseDetective: LorcanitoCharacterCard = {
//   id: "aec",
//   reprints: ["crp"],
//   name: "Mickey Mouse",
//   title: "Detective",
//   characteristics: ["hero", "dreamborn", "detective"],
//   text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Get a Clue",
//       text: "When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//     }),
//   ],
//   flavour:
//     "Wherever the seaweed had come from, Mickey was sure of one thing: something fishy was going on.",
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jared Nickerl",
//   number: 154,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508863,
//   },
//   rarity: "common",
// };
//
