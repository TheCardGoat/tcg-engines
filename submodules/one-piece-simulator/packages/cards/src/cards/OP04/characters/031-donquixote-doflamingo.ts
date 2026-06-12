import type { CharacterCard } from "@tcg/op-types";
import { op04DonquixoteDoflamingo031I18n } from "./031-donquixote-doflamingo.i18n.ts";

export const op04DonquixoteDoflamingo031: CharacterCard = {
  id: "OP04-031",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP04",
  cost: 10,
  power: 10000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-031_p1.jpg",
      imageId: "OP04-031_p1",
    },
  ],
  effect:
    "[On Play] Up to a total of 3 of your opponent's rested Leader and Character cards will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04DonquixoteDoflamingo031I18n,
};
