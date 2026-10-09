import type { ItemCard } from "@tcg/lorcana-types";
import { ancestralGuitarI18n } from "./031-ancestral-guitar.i18n";

export const ancestralGuitar: ItemCard = {
  id: "6Lu",
  canonicalId: "ci_6Lu",
  slug: "lorcana-ci_6Lu",
  printings: [
    {
      id: "set14-031",
      artId: "set14-031",
      setCode: "set14",
      collectorNumber: "31",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-031"],
  cardType: "item",
  name: "Ancestral Guitar",
  inkType: ["amber"],
  franchise: "Coco",
  set: "014",
  cardNumber: 31,
  rarity: "common",
  cost: 2,
  inkable: true,
  abilities: [
    {
      id: "6Lu-1",
      name: "Musical Legacy",
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "Musical Legacy When you play this item, draw a card.",
    },
    {
      id: "6Lu-2",
      name: "From the Heart",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Singer",
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "modify-stat",
            stat: "singer-threshold",
            modifier: 2,
            duration: "this-turn",
            target: { ref: "previous-target" },
          },
        ],
      },
      text: "From the Heart {E}, 1 {I} — Chosen character gains Singer and counts as having +2 cost to sing songs this turn.",
    },
  ],
  text: [
    {
      title: "Musical Legacy",
      description: "When you play this item, draw a card.",
    },
    {
      title: "From the Heart",
      description:
        "{E}, 1 {I} — Chosen character gains Singer and counts as having +2 cost to sing songs this turn.",
    },
  ],
  i18n: ancestralGuitarI18n,
};
