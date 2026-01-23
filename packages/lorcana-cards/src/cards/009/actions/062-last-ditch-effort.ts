import type { ActionCard } from "@tcg/lorcana-types";

export const lastditchEffort: ActionCard = {
  id: "1lj",
  cardType: "action",
  name: "Last-Ditch Effort",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "009",
  text: "Exert chosen opposing character. Chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 3,
  cardNumber: 62,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cf37b6d51b29ef3781307521b75714776bf0549a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { lastDitchEffort as ogLastDitchEffort } from "@lorcanito/lorcana-engine/cards/003/actions/062-last-ditch-effort";
//
// export const lastditchEffort: LorcanitoActionCard = {
//   ...ogLastDitchEffort,
//   id: "qq2",
//   reprints: [ogLastDitchEffort.id],
//   number: 62,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650006,
//   },
// };
//
