import type { UnitCardDefinition } from "@tcg/gundam-types";

export const WingGundamZero: UnitCardDefinition = {
  id: "gd01-024",
  name: "Wing Gundam Zero",
  cardNumber: "GD01-024",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "green",
  level: 8,
  cost: 8,
  text: "<High-Maneuver> (This Unit can&#039;t be blocked.)\n【Deploy】Deal 3 damage to all Units that are Lv.5 or lower.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-024.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 5,
  hp: 7,
  zones: ["space", "earth"],
  traits: ["g", "team"],
  linkRequirements: ["heero-yuy"],
  keywords: [
    {
      keyword: "High-Maneuver",
    },
  ],
  effects: [
    {
      id: "gd01-024-effect-1",
      description:
        "【Deploy】 Deal 3 damage to all Units that are Lv.5 or lower.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unknown",
            rawText: "all Units that are Lv",
          },
          amount: 3,
        },
      },
    },
  ],
};
