import type { ItemCard } from "@tcg/lorcana-types";
import { theSwordReleasedI18n } from "./133-the-sword-released.i18n";

export const theSwordReleased: ItemCard = {
  id: "703",
  canonicalId: "ci_703",
  reprints: ["set5-133"],
  cardType: "item",
  name: "The Sword Released",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 133,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_22989be17783417ea635d11b83b71252",
    tcgPlayer: 560544,
  },
  text: [
    {
      title: "POWER APPOINTED",
      description:
        "At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
    },
  ],
  abilities: [
    {
      id: "fy1-1",
      name: "POWER APPOINTED",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "target-aggregate-comparison",
        left: {
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [],
          },
          attribute: "strength",
          aggregate: "max",
        },
        right: {
          query: {
            selector: "all",
            owner: "opponent",
            zones: ["play"],
            cardType: "character",
            filters: [],
          },
          attribute: "strength",
          aggregate: "max",
        },
        comparison: "gt",
        requireLeftNonEmpty: true,
        ifRightEmpty: "pass",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "lose-lore",
          },
          {
            amount: {
              type: "lore-lost",
            },
            target: "CONTROLLER",
            type: "gain-lore",
          },
        ],
      },
      text: "POWER APPOINTED At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
    },
  ],
  i18n: theSwordReleasedI18n,
};
