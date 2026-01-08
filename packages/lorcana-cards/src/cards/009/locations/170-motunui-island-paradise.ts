import type { LocationCard } from "@tcg/lorcana-types";

export const motunuiIslandParadise: LocationCard = {
  id: "1ke",
  cardType: "location",
  name: "Motunui",
  version: "Island Paradise",
  fullName: "Motunui - Island Paradise",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "009",
  text: "REINCARNATION Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 170,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ca779946f1d6ce99fca6248ffe6424994ad3ce8c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { motunuiIslandParadise as ogMotunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/003/locations/170-motunui-island-paradise";
//
// export const motunuiIslandParadise: LorcanitoLocationCard = {
//   ...ogMotunuiIslandParadise,
//   id: "jiu",
//   reprints: [ogMotunuiIslandParadise.id],
//   number: 170,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650104,
//   },
// };
//
