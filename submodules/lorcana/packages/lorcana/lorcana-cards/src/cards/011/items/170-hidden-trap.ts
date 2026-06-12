import type { ItemCard } from "@tcg/lorcana-types";
import { hiddenTrapI18n } from "./170-hidden-trap.i18n";

export const hiddenTrap: ItemCard = {
  id: "aeY",
  canonicalId: "ci_aeY",
  reprints: ["set11-170"],
  cardType: "item",
  name: "Hidden Trap",
  inkType: ["sapphire"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 170,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e0852ee050446dd96742b3986444917",
    tcgPlayer: 676234,
  },
  text: [
    {
      title: "ALMOST READY",
      description: "This item enters play exerted.",
    },
    {
      title: "SNAP!",
      description: "{E}, Banish this item — Choose one:",
    },
    {
      title: "* Banish chosen item.",
    },
    {
      title: "* Chosen opposing character gets -2 {S} this turn.",
    },
  ],
  abilities: [
    {
      id: "1uw-1",
      name: "ALMOST READY",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      text: "ALMOST READY This item enters play exerted.",
    },
    {
      id: "1uw-2",
      name: "SNAP!",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "or",
        optionLabels: ["Banish chosen item", "Chosen opposing character gets -2 {S} this turn"],
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
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
      text: "SNAP! {E}, Banish this item — Choose one:",
    },
  ],
  i18n: hiddenTrapI18n,
};
