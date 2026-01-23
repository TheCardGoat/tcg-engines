import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderFrenemy: CharacterCard = {
  id: "2t5",
  cardType: "character",
  name: "Flynn Rider",
  version: "Frenemy",
  fullName: "Flynn Rider - Frenemy",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  text: "NARROW ADVANTAGE At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 106,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0a20b1d4aed57d1908ea2d27b2a70c90e2ff9be8",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const flynnRiderFrenemy: LorcanitoCharacterCard = {
//   id: "n71",
//   name: "Flynn Rider",
//   title: "Frenemy",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**NARROW AVANTAGE** At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
//   type: "character",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Narrow Advantage",
//       text: "At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
//       optional: false,
//       conditions: [{ type: "have-strongest-character" }],
//       effects: [youGainLore(3)],
//     }),
//   ],
//   flavour:
//     '"You guys look busy − I\'ll just keep an eye on this lore for you."',
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Mike Mu",
//   number: 106,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550591,
//   },
//   rarity: "super_rare",
// };
//
