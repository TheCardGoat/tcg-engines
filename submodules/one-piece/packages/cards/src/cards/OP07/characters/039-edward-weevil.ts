import type { CharacterCard } from "@tcg/op-types";
import { op07EdwardWeevil039I18n } from "./039-edward-weevil.i18n.ts";

export const op07EdwardWeevil039: CharacterCard = {
  id: "OP07-039",
  canonicalId: "OP07-039",
  slug: "edward-weevil/op07-039",
  name: "Edward Weevil",
  printings: [
    {
      id: "OP07-039",
      artId: "OP07-039",
      setCode: "OP07",
      collectorNumber: "039",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-039.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] Look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: op07EdwardWeevil039I18n,
};
