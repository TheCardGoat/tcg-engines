import type { ActionCard } from "@tcg/lorcana-types";
import { cardAdvantageI18n } from "./198-card-advantage.i18n";

export const cardAdvantage: ActionCard = {
  id: "dGU",
  canonicalId: "ci_dGU",
  reprints: ["set12-198"],
  cardType: "action",
  name: "Card Advantage",
  inkType: ["steel"],
  franchise: "Alice in Wonderland",
  set: "012",
  cardNumber: 198,
  rarity: "uncommon",
  cost: 2,
  inkable: true,

  externalIds: {
    lorcast: "crd_5a10ae29a3de4850af0cc678162ed6d7",
  },
  text: "If an opposing character was banished in a challenge this turn, draw 2 cards.",
  abilities: [
    {
      id: "198-1",
      type: "action",
      text: "If an opposing character was banished in a challenge this turn, draw 2 cards.",
      condition: {
        type: "banished-in-challenge-this-turn",
        owner: "opponent",
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: cardAdvantageI18n,
};
