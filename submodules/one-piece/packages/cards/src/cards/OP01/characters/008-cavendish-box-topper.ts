import type { CharacterCard } from "@tcg/op-types";
import { op01CavendishBoxTopper008I18n } from "./008-cavendish-box-topper.i18n.ts";

export const op01CavendishBoxTopper008: CharacterCard = {
  id: "OP01-008",
  canonicalId: "OP01-008",
  slug: "cavendish-box-topper",
  name: "Cavendish (Box Topper)",
  printings: [
    {
      id: "OP01-008",
      artId: "OP01-008",
      setCode: "OP01",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-008_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 5000,
  traits: ["Beautiful Pirates Straw Hat Crew Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-008.jpg",
      imageId: "OP01-008",
    },
  ],
  effect:
    "[On Play] You may add 1 card from your Life area to your hand: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01CavendishBoxTopper008I18n,
};
