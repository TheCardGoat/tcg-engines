import type { CharacterCard } from "@tcg/op-types";
import { op05Dalmatian046I18n } from "./046-dalmatian.i18n.ts";

export const op05Dalmatian046: CharacterCard = {
  id: "OP05-046",
  canonicalId: "OP05-046",
  slug: "dalmatian",
  name: "Dalmatian",
  printings: [
    {
      id: "OP05-046",
      artId: "OP05-046",
      setCode: "OP05",
      collectorNumber: "046",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-046.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect: "[On K.O.] Draw 1 card and place 1 card from your hand at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05Dalmatian046I18n,
};
