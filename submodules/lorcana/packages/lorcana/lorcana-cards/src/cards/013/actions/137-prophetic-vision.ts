import type { ActionCard } from "@tcg/lorcana-types";
import { propheticVisionI18n } from "./137-prophetic-vision.i18n";

export const propheticVision: ActionCard = {
  id: "5nw",
  canonicalId: "ci_5nw",
  slug: "lorcana-ci_5nw",
  printings: [
    {
      id: "set13-137",
      artId: "set13-137",
      setCode: "set13",
      collectorNumber: "137",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-137"],
  cardType: "action",
  name: "Prophetic Vision",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "013",
  cardNumber: 137,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  text: "Shuffle your deck, then reveal the top card. If it's an action card, you may play it for free. Otherwise, put it on the bottom of your deck, then each opponent loses 1 lore and you gain 1 lore.",
  abilities: [
    {
      type: "action",
      text: "Shuffle your deck, then reveal the top card. If it's an action card, you may play it for free. Otherwise, put it on the bottom of your deck, then each opponent loses 1 lore and you gain 1 lore.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: "CONTROLLER",
          },
          {
            type: "reveal-and-route",
            target: "CONTROLLER",
            routes: [
              {
                condition: {
                  type: "revealed-is-card-type",
                  cardType: "action",
                },
                destination: {
                  zone: "play",
                  cost: "free",
                },
                optional: true,
              },
            ],
            fallback: {
              zone: "deck-bottom",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "not",
              condition: {
                type: "if-you-do",
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "lose-lore",
                  amount: 1,
                  target: "EACH_OPPONENT",
                },
                {
                  type: "gain-lore",
                  amount: 1,
                  target: "CONTROLLER",
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: propheticVisionI18n,
};
