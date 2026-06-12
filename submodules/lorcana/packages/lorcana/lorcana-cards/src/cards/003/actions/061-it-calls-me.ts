import type { ActionCard } from "@tcg/lorcana-types";
import { itCallsMeI18n } from "./061-it-calls-me.i18n";

export const itCallsMe: ActionCard = {
  id: "LAX",
  canonicalId: "ci_LAX",
  reprints: ["set3-061"],
  cardType: "action",
  name: "It Calls Me",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "003",
  cardNumber: 61,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7a47845bdb01452e9faae9028fb22eeb",
    tcgPlayer: 539078,
  },
  text: "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            type: "shuffle-into-deck",
            intoDeck: "owner",
            target: {
              selector: "chosen",
              count: {
                upTo: 3,
              },
              owner: "opponent",
              zones: ["discard"],
              cardTypes: ["action", "character", "item", "location"],
            },
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: itCallsMeI18n,
};
