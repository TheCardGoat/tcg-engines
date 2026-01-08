import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckFocusedFlatfoot: CharacterCard = {
  id: "htc",
  cardType: "character",
  name: "Donald Duck",
  version: "Focused Flatfoot",
  fullName: "Donald Duck - Focused Flatfoot",
  inkType: ["sapphire"],
  set: "005",
  text: "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 155,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4034b1ebebc8be7b47cefd7197cffd40f1b428db",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const donaldDuckFocusedFlatfoot: LorcanitoCharacterCard = {
//   id: "ulv",
//   name: "Donald Duck",
//   title: "Focused Flatfoot",
//   characteristics: ["hero", "dreamborn", "detective"],
//   text: "**BAFFLING MYSTERY** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "BAFFLING MYSTERY",
//       text: "When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//     },
//   ],
//   flavour:
//     '"There’s just gotta be one of those chromi-thingies around here somewhere!"',
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Luigi Aimé",
//   number: 155,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561650,
//   },
//   rarity: "common",
// };
//
