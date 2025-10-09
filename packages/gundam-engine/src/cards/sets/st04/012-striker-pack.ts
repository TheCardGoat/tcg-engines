import type { CommandCardDefinition } from "../../card-types";

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
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)･AP3･HP3･<Blocker>) Unit token. 【Main】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)･AP4･HP2･<Blocker>) or 1 [Launcher Strike Gundam]((Earth Alliance)･AP2･HP4･<Blocker>) Unit token.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)･AP3･HP3･<Blocker>) Unit token. 【Main】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)･AP4･HP2･<Blocker>) or 1 [Launcher Strike Gundam]((Earth Alliance)･AP2･HP4･<Blocker>) Unit token.",
      },
    },
  ],
};
