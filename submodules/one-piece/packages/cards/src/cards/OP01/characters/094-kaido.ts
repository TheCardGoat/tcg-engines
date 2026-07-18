import type { CharacterCard } from "@tcg/op-types";
import { op01Kaido094I18n } from "./094-kaido.i18n.ts";

export const op01Kaido094: CharacterCard = {
  id: "OP01-094",
  canonicalId: "OP01-094",
  slug: "kaido/op01-094",
  name: "Kaido",
  printings: [
    {
      id: "OP01-094",
      artId: "OP01-094",
      setCode: "OP01",
      collectorNumber: "094",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-094.jpg",
    },
    {
      id: "OP01-094_p1",
      artId: "OP01-094_p1",
      setCode: "OP01",
      collectorNumber: "094",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-094_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP01",
  cost: 10,
  power: 12000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-094_p1.jpg",
      imageId: "OP01-094_p1",
    },
  ],
  effect:
    '[On Play] DON!! -6 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the "Animal Kingdom Pirates" type, K.O. all Characters other than this Character.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 6,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "excludeSelf",
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "Animal Kingdom Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01Kaido094I18n,
};
