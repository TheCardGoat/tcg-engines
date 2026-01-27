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
    abilities: [
      {
        trigger: "ON_BURST",
        description: "【Burst】 Deploy this card.",
        effect: {
          type: "UNKNOWN",
          rawText: "Deploy this card.",
        },
      },
      {
        trigger: "ON_DEPLOY",
        description: "【Deploy】 Add 1 of your Shields to your hand.",
        effect: {
          type: "UNKNOWN",
          rawText: "Add 1 of your Shields to your hand.",
        },
      },
      {
        activated: {
          timing: "MAIN",
        },
        description:
          "【Activate･Main】 Rest this Base：All friendly Link Units get AP+1 during this turn.",
        effect: {
          type: "MODIFY_STATS",
          attribute: "ap",
          modifier: 1,
          duration: "turn",
        },
      },
    ],
  };
