import type { ActionCard } from "@tcg/lorcana-types";
import { bosssOrdersI18n } from "./025-bosss-orders.i18n";

export const bosssOrders: ActionCard = {
  id: "8aE",
  canonicalId: "ci_8aE",
  reprints: ["set3-025"],
  cardType: "action",
  name: "Boss's Orders",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  cardNumber: 25,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d1f9df5413484ad6975ba55243e4804e",
    tcgPlayer: 537888,
  },
  text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  abilities: [
    {
      type: "action",
      effect: {
        duration: "this-turn",
        keyword: "Support",
        type: "gain-keyword",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: bosssOrdersI18n,
};
