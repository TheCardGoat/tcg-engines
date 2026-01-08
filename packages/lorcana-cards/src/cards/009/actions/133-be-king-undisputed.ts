import type { ActionCard } from "@tcg/lorcana-types";

export const beKingUndisputed: ActionCard = {
  id: "tko",
  cardType: "action",
  name: "Be King Undisputed",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "009",
  text: "Each opponent chooses and banishes one of their characters.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 133,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6a96a371b36522fc0c2a15b36f8bc89a4f1a96f7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { beKingUndisputed as ogBeKingUndisputed } from "@lorcanito/lorcana-engine/cards/004/actions/129-be-king-undisputed";
//
// export const beKingUndisputed: LorcanitoActionCard = {
//   ...ogBeKingUndisputed,
//   id: "vg8",
//   reprints: [ogBeKingUndisputed.id],
//   number: 133,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650068,
//   },
// };
//
