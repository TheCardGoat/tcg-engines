import type { ActionCard } from "@tcg/lorcana-types";

export const helpingHand: ActionCard = {
  id: "1wv",
  cardType: "action",
  name: "Helping Hand",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  text: "Chosen character gains Support this turn. Draw a card. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  cardNumber: 164,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f86b89b67c0d769c407b76fcf395e4d3a14bbd31",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacterGainsSupport,
//   drawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const helpingHand: LorcanitoActionCard = {
//   id: "vl0",
//   name: "Helping Hand",
//   characteristics: ["action"],
//   text: "Chosen character gains Support this turn. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Helping Hand",
//       text: "Chosen character gains Support this turn. Draw a card.",
//       resolveEffectsIndividually: true,
//       effects: [chosenCharacterGainsSupport("turn"), drawACard],
//     },
//   ],
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Therese Vildefall",
//   number: 164,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 586975,
//   },
//   rarity: "common",
// };
//
