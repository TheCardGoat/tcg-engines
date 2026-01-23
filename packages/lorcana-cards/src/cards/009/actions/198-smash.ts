import type { ActionCard } from "@tcg/lorcana-types";

export const smash: ActionCard = {
  id: "dvd",
  cardType: "action",
  name: "Smash",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "009",
  text: "Deal 3 damage to chosen character.",
  cost: 3,
  cardNumber: 198,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "31fe827aea4cf5f6ace7de2c21de0b5f6b783858",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { smash as ogSmash } from "@lorcanito/lorcana-engine/cards/001/actions/200-smash";
//
// export const smash: LorcanitoActionCard = {
//   ...ogSmash,
//   id: "zfz",
//   reprints: [ogSmash.id],
//   number: 198,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650131,
//   },
// };
//
