import type { LeaderCard } from "@tcg/op-types";
import { op01DonquixoteDoflamingo060I18n } from "./060-donquixote-doflamingo.i18n.ts";

export const op01DonquixoteDoflamingo060: LeaderCard = {
  id: "OP01-060",
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 5,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-060_p1.jpg",
      imageId: "OP01-060_p1",
    },
  ],
  effect:
    '[DON!! x2] [When Attacking] (1) (You may rest the specified number of DON!! cards in your cost area.): Reveal 1 card from the top of your deck. If that card is a "The Seven Warlords of the Sea" type Character card with a cost of 4 or less, you may play that card rested.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op01DonquixoteDoflamingo060I18n,
};
