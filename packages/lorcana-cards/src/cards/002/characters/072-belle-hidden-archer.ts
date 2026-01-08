import type { CharacterCard } from "@tcg/lorcana-types";

export const belleHiddenArcher: CharacterCard = {
  id: "1gg",
  cardType: "character",
  name: "Belle",
  version: "Hidden Archer",
  fullName: "Belle - Hidden Archer",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nTHORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  cardNumber: 72,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd18d714f4de80dd5f926b8fafd9324dd2543d23",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { discardAllCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const belleHiddenArcher: LorcanitoCharacterCard = {
//   id: "y10",
//   name: "Belle",
//   title: "Hidden Archer",
//   characteristics: ["hero", "floodborn", "princess"],
//   text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Belle.)_<br>\n**THORNY ARROWS** Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "belle"),
//     whenChallenged({
//       name: "Thorny Arrows",
//       text: "Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
//       responder: "opponent",
//       effects: [discardAllCards],
//     }),
//   ],
//   flavour: "She slips through the trees as easily as shadow.",
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 3,
//   illustrator: "Aisha Durmagambetova",
//   number: 72,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516417,
//   },
//   rarity: "legendary",
// };
//
