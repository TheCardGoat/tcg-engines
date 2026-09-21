import type { CharacterCard } from "@tcg/op-types";
import { op15DrHogback084I18n } from "./op15-084-dr-hogback.i18n.ts";

export const op15DrHogback084: CharacterCard = {
  id: "OP15-084",
  canonicalId: "OP15-084",
  slug: "dr-hogback/op15-084",
  name: "Dr. Hogback",
  printings: [
    {
      id: "OP15-084",
      artId: "OP15-084",
      setCode: "OP15",
      collectorNumber: "084",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-084_NsxRq49.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader has the {Thriller Bark Pirates} type, trash 5 cards from the top of your deck.\n[On K.O.] If you have 6 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 5,
          },
        ],
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op15DrHogback084I18n,
};
