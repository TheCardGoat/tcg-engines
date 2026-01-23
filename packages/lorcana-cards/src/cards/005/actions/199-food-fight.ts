import type { ActionCard } from "@tcg/lorcana-types";

export const foodFight: ActionCard = {
  id: "1ww",
  cardType: "action",
  name: "Food Fight!",
  inkType: ["steel"],
  set: "005",
  text: "Your characters gain “{E}, 1 {I} — Deal 1 damage to chosen character” this turn.",
  cost: 1,
  cardNumber: 199,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f85cdc600cc088e804abb8ad835dbe403eb00bdf",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { foodFightAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const foodFight: LorcanitoActionCard = {
//   id: "mwi",
//   missingTestCase: true,
//   name: "Food Fight!",
//   characteristics: ["action"],
//   text: "Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "ability",
//           duration: "turn",
//           modifier: "add",
//           ability: "custom",
//           customAbility: foodFightAbility,
//           target: yourCharacters,
//         },
//       ],
//     },
//   ],
//   flavour: "Gawrsh, who ordered the... upside-down CAA-AA-AKE?",
//   colors: ["steel"],
//   cost: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 199,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561494,
//   },
//   rarity: "uncommon",
// };
//
