import type { ItemCard } from "@tcg/lorcana-types";
import { riveraFamilyPhotoI18n } from "./132-rivera-family-photo.i18n";

export const riveraFamilyPhoto: ItemCard = {
  id: "aWq",
  canonicalId: "ci_aWq",
  slug: "lorcana-ci_aWq",
  printings: [
    {
      id: "set14-132",
      artId: "set14-132",
      setCode: "set14",
      collectorNumber: "132",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-132"],
  cardType: "item",
  name: "Rivera Family Photo",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 132,
  rarity: "common",
  cost: 1,
  inkable: true,
  abilities: [
    {
      id: "aWq-1",
      name: "Honor the Past",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "choice",
        optionLabels: [
          "Put the top 2 cards of your deck into your discard.",
          "If you have 10 or more cards in your discard, gain 1 lore.",
        ],
        options: [
          {
            type: "mill",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "conditional",
            condition: {
              type: "resource-count",
              what: "cards-in-discard",
              controller: "you",
              comparison: "greater-or-equal",
              value: 10,
            },
            then: {
              type: "gain-lore",
              amount: 1,
              target: "CONTROLLER",
            },
          },
        ],
      },
      text: "Honor the Past {E}, 1 {I} — Choose one: • Put the top 2 cards of your deck into your discard. • If you have 10 or more cards in your discard, gain 1 lore.",
    },
  ],
  text: [
    {
      title: "Honor the Past",
      description: "{E}, 1 {I} — Choose one:",
    },
    {
      title: "• Put the top 2 cards of your deck into your discard.",
    },
    {
      title: "• If you have 10 or more cards in your discard, gain 1 lore.",
    },
  ],
  i18n: riveraFamilyPhotoI18n,
};
