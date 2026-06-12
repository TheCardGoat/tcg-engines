import type { CharacterCard } from "@tcg/op-types";
import { prb01OtamaReprint006I18n } from "./006-otama-reprint.i18n.ts";

export const prb01OtamaReprint006: CharacterCard = {
  id: "OP01-006",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p3.jpg",
      imageId: "OP01-006_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p4.jpg",
      imageId: "OP01-006_p4",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p5.jpg",
      imageId: "OP01-006_p5",
    },
  ],
  effect:
    "[On Play] Give up to 1 of your opponent's Characters -2000 power during this turn.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb01OtamaReprint006I18n,
};
