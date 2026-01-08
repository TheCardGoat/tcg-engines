import type { ActionCard } from "@tcg/lorcana-types";

export const fourDozenEggs: ActionCard = {
  id: "1np",
  cardType: "action",
  name: "Four Dozen Eggs",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 164,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d52697d4b0ff2e40219b0dd851caf0ee7dc5cf09",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { fourDozenEggs as ogFourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/163-four-dozen-eggs";
//
// export const fourDozenEggs: LorcanitoActionCard = {
//   ...ogFourDozenEggs,
//   id: "wfa",
//   reprints: [ogFourDozenEggs.id],
//   number: 164,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650098,
//   },
// };
//
