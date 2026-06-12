import type { ItemCard } from "@tcg/lorcana-types";
import { mothersNecklaceI18n } from "./065-mothers-necklace.i18n";

export const mothersNecklace: ItemCard = {
  id: "3F4",
  canonicalId: "ci_3F4",
  reprints: ["set11-065"],
  cardType: "item",
  name: "Mother's Necklace",
  inkType: ["amethyst"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 65,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f91b39cb2d4a47f984e9e5114216e75b",
    tcgPlayer: 675300,
  },
  text: [
    {
      title: "PRECIOUS GIFT",
      description:
        "At the end of your turn, if none of your characters challenged this turn, chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  abilities: [
    {
      id: "1ag-1",
      name: "PRECIOUS GIFT",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "turn-metric",
        metric: "challenges-by-player",
        comparison: {
          operator: "eq",
          value: 0,
        },
        playerScope: "you",
      },
      effect: {
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        duration: "until-start-of-next-turn",
      },
      text: "PRECIOUS GIFT At the end of your turn, if none of your characters challenged this turn, chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  i18n: mothersNecklaceI18n,
};
