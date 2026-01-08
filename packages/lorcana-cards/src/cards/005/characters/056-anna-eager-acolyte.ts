import type { CharacterCard } from "@tcg/lorcana-types";

export const annaEagerAcolyte: CharacterCard = {
  id: "1jh",
  cardType: "character",
  name: "Anna",
  version: "Eager Acolyte",
  fullName: "Anna - Eager Acolyte",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "GROWING POWERS When you play this character, each opponent chooses and exerts one of their ready characters.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 56,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c801dbdc4d416248bc9ca308a30a407246504470",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { opponentAsResponderExertOneOfTheirReadyCharacters } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const annaEagerAcolyte: LorcanitoCharacterCard = {
//   id: "eqi",
//   name: "Anna",
//   title: "Eager Acolyte",
//   characteristics: ["hero", "dreamborn", "queen"],
//   text: "**GROWING POWERS** When you play this character, each opponent chooses and exerts on of their ready characters.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "GROWING POWERS",
//       text: "When you play this character, each opponent choses and exerts on of their ready characters.",
//       responder: "opponent",
//       effects: [opponentAsResponderExertOneOfTheirReadyCharacters],
//     },
//   ],
//   flavour:
//     "Okay, I can totally move small stuff. I need something bigger... Where's Kristoff's sled?",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Leonardo Gimmichele",
//   number: 56,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561954,
//   },
//   rarity: "common",
// };
//
