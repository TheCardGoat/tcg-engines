import type { CharacterCard } from "@tcg/op-types";
import { op14eb04GeckoMoriaOp14104104I18n } from "./104-gecko-moria-op14-104.i18n.ts";

export const op14eb04GeckoMoriaOp14104104: CharacterCard = {
  id: "OP14-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 8,
  power: 10000,
  trigger: "Play up to 1 Character card with a cost of 4 or less from your trash.",
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-104_p1_ZK1uyaO.jpg",
      imageId: "OP14-104_p1",
    },
  ],
  effect:
    "[On Play] Select up to 1 {Thriller Bark Pirates} type Character with a cost of 4 or less from your trash and play it or add it to the top of your Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "play",
                  source: {
                    player: "self",
                    zone: "trash",
                  },
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                  filters: [
                    {
                      filter: "cost",
                      comparison: "lte",
                      value: 4,
                    },
                  ],
                },
              ],
              [
                {
                  action: "addToLife",
                  target: {
                    player: "self",
                    zones: ["trash"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 4,
                      },
                    ],
                  },
                  position: "top",
                  faceUp: true,
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04GeckoMoriaOp14104104I18n,
};
