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
        id: "eff-ar31orywz",
        type: "TRIGGERED",
        timing: "BURST",
        description: "Deploy this card.",
        restrictions: [],
        costs: [],
        conditions: [],
        action: {
          type: "DEPLOY",
        },
      },
      {
        id: "eff-6j56y1rtg",
        type: "TRIGGERED",
        timing: "DEPLOY",
        description: "Add 1 of your Shields to your hand.",
        restrictions: [],
        costs: [],
        conditions: [],
        action: {
          type: "ADD_TO_HAND",
        },
      },
      {
        id: "eff-9dxp1lxy4",
        type: "ACTIVATED",
        timing: "MAIN",
        description:
          "Rest this Base:All friendly Link Units get AP+1 during this turn.",
        restrictions: [],
        costs: [
          {
            type: "REST_SELF",
            amount: 1,
          },
        ],
        conditions: [],
        action: {
          type: "CUSTOM",
          text: "",
        },
      },
    ],
  };
