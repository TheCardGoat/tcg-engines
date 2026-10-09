import type { ItemCard } from "@tcg/lorcana-types";
import { leaningTowerOfCheeseaI18n } from "./101-leaning-tower-of-cheese-a.i18n";

export const leaningTowerOfCheesea: ItemCard = {
  id: "LdD",
  canonicalId: "ci_LdD",
  slug: "lorcana-ci_LdD",
  printings: [
    {
      id: "set14-101",
      artId: "set14-101",
      setCode: "set14",
      collectorNumber: "101",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-101"],
  cardType: "item",
  name: "Leaning Tower of Cheese-a",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 101,
  rarity: "rare",
  cost: 1,
  inkable: true,
  abilities: [
    {
      id: "LdD-1",
      name: "FAIR TRADE",
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
            },
          ],
        },
      },
      text: "FAIR TRADE When you play this item, you may draw a card, then choose and discard a card.",
    },
    {
      id: "LdD-2",
      name: "EXTRA CHEESY",
      type: "static",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "item",
          filters: [
            {
              type: "has-name",
              name: "Leaning Tower of Cheese-a",
            },
          ],
        },
        comparison: { operator: "gte", value: 4 },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      text: "EXTRA CHEESY While you have 4 items named Leaning Tower of Cheese-a in play, your items gain Ward. (Opponents can't choose them.)",
    },
  ],
  externalIds: {
    lorcast: "crd_0b1a309aadaf4f11a04a71adf0d07ec1",
  },
  text: [
    {
      title: "FAIR TRADE",
      description: "When you play this item, you may draw a card, then choose and discard a card.",
    },
    {
      title: "EXTRA CHEESY",
      description:
        "While you have 4 items named Leaning Tower of Cheese-a in play, your items gain Ward. (Opponents can't choose them.)",
    },
  ],
  i18n: leaningTowerOfCheeseaI18n,
};
