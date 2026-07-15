import type { ItemCard } from "@tcg/lorcana-types";
import { vinePodI18n } from "./107-vine-pod.i18n";

export const vinePod: ItemCard = {
  id: "sMI",
  canonicalId: "ci_sMI",
  slug: "lorcana-ci_sMI",
  printings: [
    {
      id: "set13-107",
      artId: "set13-107",
      setCode: "set13",
      collectorNumber: "107",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-107"],
  cardType: "item",
  name: "Vine Pod",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "013",
  cardNumber: 107,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_96d9326e97cd4c7485c02709e8214e78",
  },
  text: [
    {
      title: "FRAGILE HUSK",
      description: "This item enters play exerted.",
    },
    {
      title: "REGENERATE",
      description:
        "{E}, 1{I} — Banish chosen character of yours. You may play a character with the same name as that character for free.",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "FRAGILE HUSK",
      text: "FRAGILE HUSK This item enters play exerted.",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    },
    {
      type: "activated",
      name: "REGENERATE",
      text: "REGENERATE {E}, 1 {I} — Banish chosen character of yours. You may play a character with the same name as that character for free.",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "play-card",
              from: "hand",
              cost: "free",
              cardType: "character",
              filter: {
                cardType: "character",
                sameNameAsChosenCard: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: vinePodI18n,
};
