import type { ActionCard } from "@tcg/lorcana-types";

export const restoringTheCrown: ActionCard = {
  id: "1ss",
  cardType: "action",
  name: "Restoring the Crown",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
  cost: 6,
  cardNumber: 83,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e9790e95ed228e5ba1499db77a02cb0f08ae189b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { restoringTheCrownAbilities } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const restoringTheCrown: LorcanitoActionCard = {
//   id: "oyt",
//   name: "Restoring The Crown",
//   characteristics: ["action"],
//   text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
//   type: "action",
//   abilities: restoringTheCrownAbilities,
//   inkwell: false,
//   colors: ["amethyst", "steel"],
//   cost: 6,
//   illustrator: "Jochen van Gool",
//   number: 83,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619450,
//   },
//   rarity: "rare",
// };
//
