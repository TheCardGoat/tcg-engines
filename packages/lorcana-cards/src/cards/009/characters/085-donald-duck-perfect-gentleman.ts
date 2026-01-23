import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckPerfectGentleman: CharacterCard = {
  id: "wjj",
  cardType: "character",
  name: "Donald Duck",
  version: "Perfect Gentleman",
  fullName: "Donald Duck - Perfect Gentleman",
  inkType: ["emerald"],
  set: "009",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Donald Duck.)\nALLOW ME At the start of your turn, each player may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 85,
  inkable: true,
  externalIds: {
    ravensburger: "754975b423fd73f951d33d2a0b695136a1c5e3b8",
  },
  abilities: [
    {
      id: "wjj-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3 {I}",
    },
    {
      id: "wjj-2",
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
      text: "ALLOW ME At the start of your turn, each player may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { donaldDuckPerfectGentleman as donaldDuckPerfectGentlemanAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/077-donald-duck-perfect-gentleman";
//
// export const donaldDuckPerfectGentleman: LorcanitoCharacterCard = {
//   ...donaldDuckPerfectGentlemanAsOrig,
//   id: "g8a",
//   reprints: [donaldDuckPerfectGentlemanAsOrig.id],
//   number: 85,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650025,
//   },
// };
//
