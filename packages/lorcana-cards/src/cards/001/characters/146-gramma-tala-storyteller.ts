import type { CharacterCard } from "@tcg/lorcana-types";

export const grammaTalaStoryteller: CharacterCard = {
  id: "n00",
  cardType: "character",
  name: "Gramma Tala",
  version: "Storyteller",
  fullName: "Gramma Tala - Storyteller",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 146,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
      id: "n00-1",
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const grammaTalaStoryteller: LorcanitoCharacterCard = {
//   id: "n00",
//
//   name: "Gramma Tala",
//   title: "Storyteller",
//   characteristics: ["storyborn", "mentor"],
//   text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "I Will Be With You",
//       text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putThisCardIntoYourInkwellExerted],
//     }),
//   ],
//   flavour:
//     "Moana: Is there something you want to tell me?\nGramma Tala: Is there something you want to hear?",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Filipe Laurentino",
//   number: 146,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508842,
//   },
//   rarity: "uncommon",
// };
//
