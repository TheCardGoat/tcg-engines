import type { ItemCard } from "@tcg/lorcana-types";

export const aurelianGyrosensor: ItemCard = {
  id: "811",
  cardType: "item",
  name: "Aurelian Gyrosensor",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "009",
  text: "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 2,
  cardNumber: 167,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1cefdacf3020720d8e94c7f2e9c50039ba1f9d22",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { aurelianGyrosensor as ogAurelianGyrosensor } from "@lorcanito/lorcana-engine/cards/003/items/163-aurelian-gyrosensor";
//
// export const aurelianGyrosensor: LorcanitoItemCard = {
//   ...ogAurelianGyrosensor,
//   id: "dbv",
//   reprints: [ogAurelianGyrosensor.id],
//   number: 167,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650101,
//   },
// };
//
