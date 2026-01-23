import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDazzlingDancer: CharacterCard = {
  id: "git",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Dazzling Dancer",
  fullName: "Minnie Mouse - Dazzling Dancer",
  inkType: ["ruby"],
  set: "005",
  text: "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 126,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3b8ce9d853822f37f2a8ccdac5ba917bd8570611",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   wheneverACharNamedXChallengesAnotherChar,
//   wheneverChallengesAnotherChar,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const minnieMouseDazzlingDancer: LorcanitoCharacterCard = {
//   id: "z2q",
//   missingTestCase: true,
//   name: "Minnie Mouse",
//   title: "Dazzling Dancer",
//   characteristics: ["hero", "dreamborn"],
//   text: "**DANCE-OFF** Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverChallengesAnotherChar({
//       name: "DANCE-OFF",
//       text: "Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
//       effects: [youGainLore(1)],
//     }),
//     wheneverACharNamedXChallengesAnotherChar({
//       name: "DANCE-OFF",
//       text: "or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
//       effects: [youGainLore(1)],
//       characterNamed: "Mickey Mouse",
//     }),
//   ],
//   flavour: "She doesn’t seek the spotlight—the spotlight seeks her.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Raquel Villanueva",
//   number: 126,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 557294,
//   },
//   rarity: "uncommon",
// };
//
