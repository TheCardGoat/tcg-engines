import type { CharacterCard } from "@tcg/lorcana-types";

export const buckyNuttyRascal: CharacterCard = {
  id: "17v",
  cardType: "character",
  name: "Bucky",
  version: "Nutty Rascal",
  fullName: "Bucky - Nutty Rascal",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "POP! When this character is banished in a challenge, you may draw a card.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 60,
  inkable: true,
  externalIds: {
    ravensburger: "9e2af09893b0ca662b9ffaf6ed3e829170c038b7",
  },
  abilities: [
    {
      id: "17v-1",
      type: "triggered",
      name: "POP!",
      trigger: {
        event: "banish",
        timing: "when",
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
      text: "POP! When this character is banished in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const buckyNuttyRascal: LorcanitoCharacterCard = {
//   id: "tfn",
//   name: "Bucky",
//   title: "Nutty Rascal",
//   characteristics: ["dreamborn", "ally"],
//   text: "POP! When this character is banished in a challenge, you may draw a card.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanishedInAChallenge({
//       name: "POP!",
//       text: "When this character is banished in a challenge, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Kenneth Anderson",
//   number: 60,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619438,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
