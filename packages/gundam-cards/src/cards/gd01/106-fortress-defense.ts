import type { CommandCardDefinition } from "@tcg/gundam-types";

export const FortressDefense: CommandCardDefinition = {
  id: "gd01-106",
  name: "Fortress Defense",
  cardNumber: "GD01-106",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "green",
  level: 5,
  cost: 2,
  text: "【Main】Deploy 2 [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit tokens.\n【Pilot】[Dozle Zabi]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-106.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  pilotProperties: {
    name: "Dozle Zabi",
    traits: ["zeon"],
    apModifier: 1,
    hpModifier: 0,
  },
  abilities: [
    {
      description:
        "【Main】Deploy 2 [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit tokens. 【Pilot】[Dozle Zabi]",
      effect: {
        type: "UNKNOWN",
        rawText:
          "【Main】Deploy 2 [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit tokens. 【Pilot】[Dozle Zabi]",
      },
    },
  ],
};
