import type { ItemCard } from "@tcg/lorcana-types";
import { mysticalRoseI18n } from "./064-mystical-rose.i18n";

export const mysticalRose: ItemCard = {
  id: "BsF",
  canonicalId: "ci_BsF",
  reprints: ["set4-064"],
  cardType: "item",
  name: "Mystical Rose",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 64,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1f22214638bd46d089a6751e57dfd829",
    tcgPlayer: 547683,
  },
  text: [
    {
      title: "DISPEL THE ENTANGLEMENT",
      description:
        "Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
    },
  ],
  abilities: [
    {
      id: "1il-1",
      text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
      name: "DISPEL THE ENTANGLEMENT",
      cost: {
        banishSelf: true,
      },
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: 2,
            stat: "lore",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-name",
                  name: "Beast",
                },
              ],
            },
            type: "modify-stat",
          },
          {
            condition: {
              type: "has-named-character",
              name: "Belle",
              controller: "you",
            },
            then: {
              type: "move-damage",
              amount: { type: "up-to", value: 3 },
              from: {
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
              to: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      type: "activated",
    },
  ],
  i18n: mysticalRoseI18n,
};
