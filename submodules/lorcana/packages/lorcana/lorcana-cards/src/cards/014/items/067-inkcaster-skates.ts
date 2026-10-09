import type { ItemCard } from "@tcg/lorcana-types";
import { inkcasterSkatesI18n } from "./067-inkcaster-skates.i18n";

export const inkcasterSkates: ItemCard = {
  id: "XgC",
  canonicalId: "ci_XgC",
  slug: "lorcana-ci_XgC",
  printings: [
    {
      id: "set14-067",
      artId: "set14-067",
      setCode: "set14",
      collectorNumber: "67",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-067"],
  cardType: "item",
  name: "Inkcaster Skates",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 67,
  rarity: "rare",
  cost: 3,
  inkable: false,
  abilities: [
    {
      id: "XgC-1",
      name: "THE LATEST TREND",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "turn-metric",
          metric: "quested-characters",
          comparison: { operator: "gte", value: 1 },
          playerScope: "any",
        },
        then: {
          type: "gain-ink-drop",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "THE LATEST TREND {E} — If a character quested this turn, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  externalIds: {
    lorcast: "crd_7ce311ebf82c4ff9bb0954189ee398e3",
  },
  text: [
    {
      title: "THE LATEST TREND",
      description:
        "{E} — If a character quested this turn, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  i18n: inkcasterSkatesI18n,
};
