import type { ItemCard } from "@tcg/lorcana-types";
import { amethystChromiconI18n } from "./066-amethyst-chromicon.i18n";

export const amethystChromicon: ItemCard = {
  id: "12k",
  canonicalId: "ci_12k",
  reprints: ["set5-066"],
  cardType: "item",
  name: "Amethyst Chromicon",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 66,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6506bc6d995f48a6b643477a796faba1",
    tcgPlayer: 560096,
  },
  text: [
    {
      title: "AMETHYST LIGHT",
      description: "{E} — Each player may draw a card.",
    },
  ],
  abilities: [
    {
      id: "1nk-1",
      cost: {
        exert: true,
      },
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "optional",
          },
          {
            chooser: "OPPONENT",
            effect: {
              amount: 1,
              target: "OPPONENT",
              type: "draw",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      type: "activated",
      name: "AMETHYST LIGHT",
      text: "AMETHYST LIGHT {E} — Each player may draw a card.",
    },
  ],
  i18n: amethystChromiconI18n,
};
