import type { CharacterCard } from "@tcg/op-types";
import { prb01DonquixoteDoflamingoReprint031I18n } from "./031-donquixote-doflamingo-reprint.i18n.ts";

export const prb01DonquixoteDoflamingoReprint031: CharacterCard = {
  id: "OP04-031",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB01",
  cost: 10,
  power: 10000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-031_p3.jpg",
      imageId: "OP04-031_p3",
    },
  ],
  effect:
    "[On Play] Up to a total of 3 of your opponent's rested Leader and Character cards will not become active in your opponent's next Refresh Phase.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
  i18n: prb01DonquixoteDoflamingoReprint031I18n,
};
