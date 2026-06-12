import type { CharacterCard } from "@tcg/op-types";
import { op14eb04BoaHancockOp14112112I18n } from "./112-boa-hancock-op14-112.i18n.ts";

export const op14eb04BoaHancockOp14112112: CharacterCard = {
  id: "OP14-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 9,
  power: 10000,
  trigger: "Play up to 1 Character card with 6000 power or less and a [Trigger] from your hand.",
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-112_p2_29kr27B.png",
      imageId: "OP14-112_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-112_p1_FuOrRQo.jpg",
      imageId: "OP14-112_p1",
    },
  ],
  effect:
    "[On Play] If your Leader has the {The Seven Warlords of the Sea} type, add up to 1 card from the top of your deck to the top of your Life cards. Then, add up to 1 card from the top of your opponent's Life cards to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Seven Warlords of the Sea",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: op14eb04BoaHancockOp14112112I18n,
};
