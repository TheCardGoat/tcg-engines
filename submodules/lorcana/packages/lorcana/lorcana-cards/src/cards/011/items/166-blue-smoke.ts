import type { ItemCard } from "@tcg/lorcana-types";
import { blueSmokeI18n } from "./166-blue-smoke.i18n";

export const blueSmoke: ItemCard = {
  id: "IFf",
  canonicalId: "ci_IFf",
  reprints: ["set11-166"],
  cardType: "item",
  name: "Blue Smoke",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 166,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_9d937b1e551d47c18d97a54494378368",
    tcgPlayer: 676230,
  },
  text: [
    {
      title: "THEATRICAL ENTRANCE",
      description:
        "If you have a character named Darkwing Duck in play, you pay 1 {I} less to play this item.",
    },
    {
      title: "CLOUD OF MYSTERY",
      description:
        "{E}, 1 {I}, Banish this item — Chosen character gains Ward until the start of your next turn.",
    },
  ],
  abilities: [
    {
      id: "1pq-1",
      name: "THEATRICAL ENTRANCE",
      type: "static",
      condition: {
        type: "has-named-character",
        controller: "you",
        name: "Darkwing Duck",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "item",
      },
      text: "THEATRICAL ENTRANCE If you have a character named Darkwing Duck in play, you pay 1 {I} less to play this item.",
    },
    {
      id: "1pq-2",
      name: "CLOUD OF MYSTERY",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        duration: "until-start-of-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "CLOUD OF MYSTERY {E}, 1 {I}, Banish this item — Chosen character gains Ward until the start of your next turn.",
    },
  ],
  i18n: blueSmokeI18n,
};
