import type { ActionCard } from "@tcg/lorcana-types";
import { colorsOfTheWindI18n } from "./064-colors-of-the-wind.i18n";

export const colorsOfTheWind: ActionCard = {
  id: "IUQ",
  canonicalId: "ci_Wdy",
  slug: "lorcana-ci_Wdy",
  printings: [
    {
      id: "set11-064",
      artId: "set11-064",
      setCode: "set11",
      collectorNumber: "64",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set11-064"],
  cardType: "action",
  name: "Colors of the Wind",
  inkType: ["amethyst"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 64,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_8ef1d474eb68402e8d35e2aa3bce689a",
    tcgPlayer: "677161",
  },
  text: "Each player reveals the top card of their deck. Draw a card for each different ink type of cards revealed this way.",
  actionSubtype: "song",
  abilities: [
    {
      id: "arw-1",
      type: "action",
      text: "Each player reveals the top card of their deck. Draw a card for each different ink type of cards revealed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-top-card",
            target: "EACH_PLAYER",
          },
          {
            type: "count",
            what: "distinct-revealed-ink-types",
          },
          {
            type: "draw",
            amount: {
              type: "trigger-amount",
            },
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: colorsOfTheWindI18n,
};
