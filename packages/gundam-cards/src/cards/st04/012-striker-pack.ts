import type { CommandCardDefinition } from "@tcg/gundam-types";

export const StrikerPack: CommandCardDefinition = {
  id: "st04-012",
  name: "Striker Pack",
  cardNumber: "ST04-012",
  setCode: "ST04",
  cardType: "COMMAND",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 2,
  text: "【Burst】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)･AP3･HP3･<Blocker>) Unit token.\n【Main】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)･AP4･HP2･<Blocker>) or 1 [Launcher Strike Gundam]((Earth Alliance)･AP2･HP4･<Blocker>) Unit token.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  effects: [
    {
      id: "eff-d2wil0adh",
      type: "TRIGGERED",
      timing: "BURST",
      description:
        "If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)･AP3･HP3･) Unit token.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [
          {
            type: "STATE_CHECK",
            text: "you have no (Earth Alliance) Unit tokens in play",
          },
        ],
        trueAction: {
          type: "DEPLOY",
        },
      },
    },
    {
      id: "eff-u1hjmfd0z",
      type: "CONSTANT",
      description:
        "If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)･AP4･HP2･) or 1 [Launcher Strike Gundam]((Earth Alliance)･AP2･HP4･) Unit token.",
      restrictions: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [
          {
            type: "STATE_CHECK",
            text: "you have no (Earth Alliance) Unit tokens in play",
          },
        ],
        trueAction: {
          type: "DEPLOY",
        },
      },
    },
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
    {
      keyword: "Blocker",
    },
    {
      keyword: "Blocker",
    },
  ],
};
