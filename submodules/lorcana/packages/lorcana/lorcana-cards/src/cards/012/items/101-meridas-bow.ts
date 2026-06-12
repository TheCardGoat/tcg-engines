import type { ItemCard } from "@tcg/lorcana-types";
import { meridasBowI18n } from "./101-meridas-bow.i18n";

export const meridasBow: ItemCard = {
  id: "yLr",
  canonicalId: "ci_yLr",
  reprints: ["set12-101"],
  cardType: "item",
  name: "Merida's Bow",
  inkType: ["emerald"],
  franchise: "Brave",
  set: "012",
  cardNumber: 101,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_46e904b0b1d54c4f89dff2256895bf26",
  },
  text: [
    {
      title: "EASY SHOT",
      description: "When you play this item, deal 1 damage to chosen character.",
    },
    {
      title: "FINAL ARROW 1",
      description: "{I}, Banish this item — Deal 1 damage to chosen character.",
    },
  ],
  abilities: [
    {
      id: "yLr-1",
      name: "EASY SHOT",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "EASY SHOT When you play this item, deal 1 damage to chosen character.",
    },
    {
      id: "yLr-2",
      name: "FINAL ARROW 1",
      type: "activated",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "FINAL ARROW 1 {I}, Banish this item — Deal 1 damage to chosen character.",
    },
  ],
  i18n: meridasBowI18n,
};
