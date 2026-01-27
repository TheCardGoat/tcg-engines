import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const AsticassiaSchoolOfTechnologyEarthHouse: BaseCardDefinition_Structure =
  {
    id: "st01-016",
    name: "Asticassia School of Technology, Earth House",
    cardNumber: "ST01-016",
    setCode: "ST01",
    cardType: "BASE",
    rarity: "common",
    color: "white",
    level: 2,
    cost: 1,
    text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Activate･Main】Rest this Base：All friendly Link Units get AP+1 during this turn.",
    imageUrl:
      "https://www.gundam-gcg.com/en/images/cards/card/ST01-016.webp?2510031",
    sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
    ap: Number.NaN,
    hp: 5,
    zones: ["space"],
    traits: ["academy", "stronghold"],
    effects: [
      {
        id: "st01-016-effect-1",
        description: "【Burst】 Deploy this card.",
        type: "TRIGGERED",
        timing: "BURST",
        action: {
          type: "CUSTOM",
          text: "Deploy this card.",
        },
      },
      {
        id: "st01-016-effect-2",
        description: "【Deploy】 Add 1 of your Shields to your hand.",
        type: "TRIGGERED",
        timing: "DEPLOY",
        action: {
          type: "CUSTOM",
          text: "Add 1 of your Shields to your hand.",
        },
      },
      {
        id: "st01-016-effect-3",
        description:
          "【Activate･Main】 Rest this Base：All friendly Link Units get AP+1 during this turn.",
        type: "ACTIVATED",
        timing: "MAIN",
        action: {
          type: "MODIFY_STATS",
          parameters: {
            attribute: "ap",
            modifier: 1,
            duration: "turn",
          },
        },
      },
    ],
  };
