import type { LocationCard } from "@tcg/lorcana-types";
import { agrabahMarketplaceI18n } from "./136-agrabah-marketplace.i18n";

export const agrabahMarketplace: LocationCard = {
  id: "vOZ",
  canonicalId: "ci_Ic5",
  slug: "lorcana-ci_Ic5",
  printings: [
    {
      id: "set9-136",
      artId: "set9-136",
      setCode: "set9",
      collectorNumber: "136",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-134", "set9-136"],
  cardType: "location",
  name: "Agrabah",
  version: "Marketplace",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "009",
  cardNumber: 136,
  rarity: "common",
  cost: 3,
  willpower: 5,
  moveCost: 1,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6e330a06c76a4a15b2a62a2b5d25369f",
    tcgPlayer: "650071",
  },
  i18n: agrabahMarketplaceI18n,
};
