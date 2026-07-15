import type { LocationCard } from "@tcg/lorcana-types";
import { jollyRogerHooksShipP1PromoI18n } from "./p1-027-jolly-roger-hooks-ship-promo.i18n";

export const jollyRogerHooksShipP1Promo: LocationCard = {
  id: "fLo",
  canonicalId: "ci_UWn",
  slug: "lorcana-ci_UWn",
  printings: [
    {
      id: "set3-p1-027-promo",
      artId: "ci_UWn-promo",
      setCode: "set3",
      collectorNumber: "27",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set3-135"],
  cardType: "location",
  name: "Jolly Roger",
  version: "Hook's Ship",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 27,
  rarity: "special",
  specialRarity: "promo",
  cost: 1,
  willpower: 5,
  moveCost: 2,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_f74acb5e986f496092a1c5ef8bfa741a",
    tcgPlayer: "538280",
  },
  text: [
    {
      title: "LOOK ALIVE, YOU SWABS!",
      description: "Characters gain Rush while here. (They can challenge the turn they're played.)",
    },
    {
      title: "ALL HANDS ON DECK!",
      description: "Your Pirate characters may move here for free.",
    },
  ],
  abilities: [
    {
      id: "UV5-1",
      name: "LOOK ALIVE, YOU SWABS!",
      effect: {
        keyword: "Rush",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
      },
      text: "LOOK ALIVE, YOU SWABS! Characters gain Rush while here.",
      type: "static",
    },
    {
      id: "UV5-2",
      name: "ALL HANDS ON DECK!",
      effect: {
        filter: {
          classification: "Pirate",
        },
        location: "here",
        reduction: "free",
        type: "move-cost-reduction",
      },
      text: "ALL HANDS ON DECK! Your Pirate characters may move here for free.",
      type: "static",
    },
  ],
  i18n: jollyRogerHooksShipP1PromoI18n,
};
