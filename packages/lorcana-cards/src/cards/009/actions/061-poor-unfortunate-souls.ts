import type { ActionCard } from "@tcg/lorcana-types";

export const poorUnfortunateSouls: ActionCard = {
  id: "1ti",
  cardType: "action",
  name: "Poor Unfortunate Souls",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Return chosen character, item, or location with cost 2 or less to their player's hand.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 61,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed007086370af05d97b329a2a69bacfeebcf26e7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { poorUnfortunateSouls as ogPoorUnfortunateSouls } from "@lorcanito/lorcana-engine/cards/004/actions/060-poor-unfortunate-souls";
//
// export const poorUnfortunateSouls: LorcanitoActionCard = {
//   ...ogPoorUnfortunateSouls,
//   id: "k1n",
//   reprints: [ogPoorUnfortunateSouls.id],
//   number: 61,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650005,
//   },
// };
//
