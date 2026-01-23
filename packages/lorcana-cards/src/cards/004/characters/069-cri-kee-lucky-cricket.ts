import type { CharacterCard } from "@tcg/lorcana-types";

export const crikeeLuckyCricket: CharacterCard = {
  id: "dzo",
  cardType: "character",
  name: "Cri-Kee",
  version: "Lucky Cricket",
  fullName: "Cri-Kee - Lucky Cricket",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "004",
  text: "SPREADING GOOD FORTUNE When you play this character, your other characters get +3 {S} this turn.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 3,
  cardNumber: 69,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "326ceeec1de2883d7a709f109d2aaca1246a9156",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { yourOtherCharactersGainStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const criKeeLuckyCricket: LorcanitoCharacterCard = {
//   id: "ep2",
//   missingTestCase: true,
//   name: "Cri-Kee",
//   title: "Lucky Cricket",
//   characteristics: ["storyborn", "ally"],
//   text: "**SPREADING GOOD FORTUNE** When you play this character, your other characters get +3 {S} this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Spreading Good Fortune",
//       text: "When you play this character, your other characters get +3 {S} this turn.",
//       effects: [yourOtherCharactersGainStrengthThisTurn(3)],
//     },
//   ],
//   flavour: "Everyone feels better just knowing he's around.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Heidi Neunhoffer",
//   number: 69,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547783,
//   },
//   rarity: "rare",
// };
//
