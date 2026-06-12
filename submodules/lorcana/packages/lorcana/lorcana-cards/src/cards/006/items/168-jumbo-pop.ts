import type { ItemCard } from "@tcg/lorcana-types";
import { jumboPopI18n } from "./168-jumbo-pop.i18n";

export const jumboPop: ItemCard = {
  id: "iYv",
  canonicalId: "ci_iYv",
  reprints: ["set6-168"],
  cardType: "item",
  name: "Jumbo Pop",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 168,
  rarity: "common",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_f19a04399d3d44a9b9e346a4ee4741a4",
    tcgPlayer: 591138,
  },
  text: [
    {
      title: "HERE YOU GO",
      description:
        "Banish this item — Remove up to 2 damage from each of your characters. Draw a card.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        steps: [
          {
            amount: { type: "up-to", value: 2 },
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "remove-damage",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "lhl-1",
      name: "HERE YOU GO",
      text: "HERE YOU GO Banish this item — Remove up to 2 damage from each of your characters. Draw a card.",
      type: "activated",
    },
  ],
  i18n: jumboPopI18n,
};
