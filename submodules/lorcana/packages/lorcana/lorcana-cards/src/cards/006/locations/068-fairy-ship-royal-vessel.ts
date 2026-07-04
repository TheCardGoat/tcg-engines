import type { LocationCard } from "@tcg/lorcana-types";
import { fairyShipRoyalVesselI18n } from "./068-fairy-ship-royal-vessel.i18n";

export const fairyShipRoyalVessel: LocationCard = {
  id: "3Go",
  canonicalId: "ci_3Go",
  slug: "lorcana-ci_3Go",
  printings: [
    {
      id: "set6-068",
      artId: "set6-068",
      setCode: "set6",
      collectorNumber: "68",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set6-068"],
  cardType: "location",
  name: "Fairy Ship",
  version: "Royal Vessel",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 68,
  rarity: "common",
  cost: 1,
  willpower: 4,
  moveCost: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_107f43772b78405f8a4fb587e8279d14",
    tcgPlayer: "584615",
  },
  i18n: fairyShipRoyalVesselI18n,
};
