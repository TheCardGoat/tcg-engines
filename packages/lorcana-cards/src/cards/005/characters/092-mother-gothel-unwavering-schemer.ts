import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelUnwaveringSchemer: CharacterCard = {
  id: "1l4",
  cardType: "character",
  name: "Mother Gothel",
  version: "Unwavering Schemer",
  fullName: "Mother Gothel - Unwavering Schemer",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mother Gothel.)\nTHE WORLD IS DARK When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 92,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cdbf26f3c024f49ca1be07d416db32bede4c8d3b",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { returnCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const motherGothelUnwaveringSchemer: LorcanitoCharacterCard = {
//   id: "uis",
//   missingTestCase: true,
//   name: "Mother Gothel",
//   title: "Unwavering Schemer",
//   characteristics: ["floodborn", "villain"],
//   text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Mother Gothel.)_ **THE WORLD IS DARK** When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Mother Gothel"),
//     {
//       type: "resolution",
//       name: "**THE WORLD IS DARK**",
//       text: "When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
//       responder: "opponent",
//       effects: [returnCardToHand(chosenCharacterOfYours)],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 4,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Dylan Bonner",
//   number: 92,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561633,
//   },
//   rarity: "super_rare",
// };
//
