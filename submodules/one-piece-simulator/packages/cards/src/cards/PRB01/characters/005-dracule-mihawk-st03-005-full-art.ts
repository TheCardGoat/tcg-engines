import type { CharacterCard } from "@tcg/op-types";
import { prb01DraculeMihawkSt03005FullArt005I18n } from "./005-dracule-mihawk-st03-005-full-art.i18n.ts";

export const prb01DraculeMihawkSt03005FullArt005: CharacterCard = {
  id: "ST03-005",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-005_p4.jpg",
      imageId: "ST03-005_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-005_r2.png",
      imageId: "ST03-005_r2",
    },
  ],
  effect: "[DON!! x1] [When Attacking] Draw 2 cards and trash 2 cards from your hand.",
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
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: prb01DraculeMihawkSt03005FullArt005I18n,
};
