import type { ActionCard } from "@tcg/lorcana-types";
import { hideAwayI18n } from "./163-hide-away.i18n";

export const hideAway: ActionCard = {
  id: "QYp",
  canonicalId: "ci_QYp",
  reprints: ["set5-163"],
  cardType: "action",
  name: "Hide Away",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 163,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_46aa903866b2477f8601a1cb5a8f56b9",
    tcgPlayer: 561653,
  },
  text: "Put chosen item or location into its player's inkwell facedown and exerted.",
  abilities: [
    {
      type: "action",
      text: "Put chosen item or location into its player's inkwell facedown and exerted.",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-card-in-play",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item", "location"],
        },
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: hideAwayI18n,
};
