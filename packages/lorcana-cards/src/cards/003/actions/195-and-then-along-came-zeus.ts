import type { ActionCard } from "@tcg/lorcana-types";

export const andThenAlongCameZeus: ActionCard = {
  id: "v95",
  cardType: "action",
  name: "And Then Along Came Zeus",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  text: "Deal 5 damage to chosen character or location.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 195,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "70a43800d36d83e54f6abc028f75b80ac11dbe91",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   DamageEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const andThenAlongCameZeus: LorcanitoActionCard = {
//   id: "k6i",
//   name: "And Then Along Came Zeus",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\nDeal 5 damage to chosen character or location.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "And Then Along Came Zeus",
//       text: "Deal 5 damage to chosen character or location.",
//       effects: [
//         {
//           type: "damage",
//           amount: 5,
//           target: chosenCharacterOrLocation,
//         } as DamageEffect,
//       ],
//     },
//   ],
//   flavour:
//     "He hurled his thunderbolt−He zapped \nLocked those suckers in a vault−They're trapped \nAnd on his own stopped chaos in its tracks",
//   colors: ["steel"],
//   cost: 4,
//   illustrator: "Isabella Ceravolo",
//   number: 195,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 534601,
//   },
//   rarity: "rare",
// };
//
