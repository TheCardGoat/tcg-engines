import type { LocationCard } from "@tcg/lorcana-types";
import { jollyRogerHooksShipI18n } from "./135-jolly-roger-hooks-ship.i18n";

export const jollyRogerHooksShip: LocationCard = {
  id: "UV5",
  canonicalId: "ci_UV5",
  reprints: ["set3-135"],
  cardType: "location",
  name: "Jolly Roger",
  version: "Hook's Ship",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 135,
  rarity: "uncommon",
  cost: 1,
  willpower: 5,
  moveCost: 2,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_f74acb5e986f496092a1c5ef8bfa741a",
    tcgPlayer: 538280,
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
  i18n: jollyRogerHooksShipI18n,
};
