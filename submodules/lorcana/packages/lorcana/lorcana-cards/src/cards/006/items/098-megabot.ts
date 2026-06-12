import type { ItemCard } from "@tcg/lorcana-types";
import { megabotI18n } from "./098-megabot.i18n";

export const megabot: ItemCard = {
  id: "Bvz",
  canonicalId: "ci_Bvz",
  reprints: ["set6-098"],
  cardType: "item",
  name: "MegaBot",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 98,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1ed3d03ca8724920aa9dccede9e08900",
    tcgPlayer: 588322,
  },
  text: [
    {
      title: "HAPPY FACE",
      description: "This item enters play exerted.",
    },
    {
      title: "DESTROY!",
      description: "{E}, Banish this item — Choose one:",
    },
    {
      title: "* Banish chosen item.",
    },
    {
      title: "* Banish chosen damaged character.",
    },
  ],
  abilities: [
    {
      id: "4oq-1",
      name: "HAPPY FACE",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      text: "HAPPY FACE This item enters play exerted.",
    },
    {
      id: "4oq-2",
      name: "DESTROY!",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "or",
        optionLabels: ["Banish chosen item", "Banish chosen damaged character"],
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "damaged",
                },
              ],
            },
          },
        ],
      },
      text: "DESTROY! {E}, Banish this item — Choose one:",
    },
  ],
  i18n: megabotI18n,
};
