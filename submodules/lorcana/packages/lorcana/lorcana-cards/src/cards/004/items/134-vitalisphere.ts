import type { ItemCard } from "@tcg/lorcana-types";
import { vitalisphereI18n } from "./134-vitalisphere.i18n";

export const vitalisphere: ItemCard = {
  id: "WDs",
  canonicalId: "ci_WDs",
  reprints: ["set4-134"],
  cardType: "item",
  name: "Vitalisphere",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "004",
  cardNumber: 134,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0377cc62eb6044bc808843bbcd39eb48",
    tcgPlayer: 548393,
  },
  text: [
    {
      title: "EXTRACT OF RUBY 1",
      description:
        "{I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn. (They can challenge the turn they're played.)",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        steps: [
          {
            keyword: "Rush",
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
          },
          {
            duration: "this-turn",
            modifier: 2,
            stat: "strength",
            target: {
              ref: "previous-target",
            },
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "fzw-1",
      name: "EXTRACT OF RUBY",
      text: "EXTRACT OF RUBY 1 {I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn.",
      type: "activated",
    },
  ],
  i18n: vitalisphereI18n,
};
