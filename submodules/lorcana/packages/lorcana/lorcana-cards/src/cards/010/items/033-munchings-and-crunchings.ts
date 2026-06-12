import type { ItemCard } from "@tcg/lorcana-types";
import { munchingsAndCrunchingsI18n } from "./033-munchings-and-crunchings.i18n";

export const munchingsAndCrunchings: ItemCard = {
  id: "iM5",
  canonicalId: "ci_iM5",
  reprints: ["set10-033"],
  cardType: "item",
  name: "Munchings and Crunchings",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 33,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ef6c610fc243499c894239a4f0d50c00",
    tcgPlayer: 658768,
  },
  text: [
    {
      title: "WHAT A JUICY APPLE",
      description: "{E} — Remove up to 2 damage from chosen character.",
    },
    {
      title: "COME ON OUT",
      description: "You pay 1 {I} less to play characters named Gurgi.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: { type: "up-to", value: 2 },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "16w-1",
      name: "WHAT A JUICY APPLE",
      text: "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
    {
      effect: {
        amount: 1,
        cardType: "character",
        cardName: "Gurgi",
        type: "cost-reduction",
      },
      id: "16w-2",
      name: "COME ON OUT",
      text: "COME ON OUT You pay 1 {I} less to play characters named Gurgi.",
      type: "static",
    },
  ],
  i18n: munchingsAndCrunchingsI18n,
};
