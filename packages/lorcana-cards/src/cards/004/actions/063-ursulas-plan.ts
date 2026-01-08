import type { ActionCard } from "@tcg/lorcana-types";

export const ursulasPlan: ActionCard = {
  id: "ygy",
  cardType: "action",
  name: "Ursula’s Plan",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
  cost: 3,
  cardNumber: 63,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7c3ca633992bcba20ad4ad0c349c0e74c1e3f529",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { exertedSelfCharCantReadyNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ursulasPlan: LorcanitoActionCard = {
//   id: "qk9",
//   missingTestCase: true,
//   name: "Ursula's Plan",
//   characteristics: ["action"],
//   text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
//       responder: "opponent",
//       effects: [exertedSelfCharCantReadyNextTurn],
//     },
//   ],
//   flavour:
//     "With both the crown and the trident, together we would be unstoppable!",
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Eri Welli",
//   number: 63,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550572,
//   },
//   rarity: "uncommon",
// };
//
