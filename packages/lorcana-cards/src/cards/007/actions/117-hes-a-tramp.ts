import type { ActionCard } from "@tcg/lorcana-types";

export const hesATramp: ActionCard = {
  id: "1mv",
  cardType: "action",
  name: "He's a Tramp",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "Chosen character gets +1 {S} this turn for each character you have in play.",
  actionSubtype: "song",
  cost: 1,
  cardNumber: 117,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2e7b04e55be924e0bc9c07444cacc89c38ba255",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { hesATrampAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const hesATramp: LorcanitoActionCard = {
//   id: "s0z",
//   name: "He's A Tramp",
//   characteristics: ["action", "song"],
//   text: "(A character with cost 1 or more can {E} to sing this song for free.)\nChosen character gets +1 {S} this turn for each character you have in play.",
//   type: "action",
//   abilities: [hesATrampAbility],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Isaiah Mesq",
//   number: 117,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618165,
//   },
//   rarity: "common",
// };
//
