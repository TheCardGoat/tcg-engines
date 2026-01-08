import type { LocationCard } from "@tcg/lorcana-types";

export const agrabahMarketplace: LocationCard = {
  id: "1wg",
  cardType: "location",
  name: "Agrabah",
  version: "Marketplace",
  fullName: "Agrabah - Marketplace",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "009",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "f6be00bb8a78d746c64ad7bda45503e70b441aad",
  },
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { agrabahMarketplace as agrabahMarketplaceAsOrig } from "@lorcanito/lorcana-engine/cards/003/locations/134-agrabah-marketplace";
//
// export const agrabahMarketplace: LorcanitoLocationCard = {
//   ...agrabahMarketplaceAsOrig,
//   id: "j5m",
//   reprints: [agrabahMarketplaceAsOrig.id],
//   number: 136,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650071,
//   },
// };
//
