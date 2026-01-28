import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gfighter: UnitCardDefinition = {
  id: "gd01-009",
  name: "G-Fighter",
  cardNumber: "GD01-009",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【Deploy】Choose 1 of your (White Base Team) Units. It gains <High-Maneuver> during this turn.\n\n (This Unit can&#039;t be blocked.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-009.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["(white-base-team)-trait"],
  effects: [
    {
      id: "eff-hdcz9kq48",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Choose 1 of your (White Base Team) Units. It gains <High-Maneuver> during this turn. (This Unit can&#039;t be blocked.)",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "GAIN_KEYWORDS",
            keywords: ["High-Maneuver"],
            duration: "TURN",
            target: {
              controller: "SELF",
              cardType: "UNIT",
              count: {
                min: 1,
                max: 1,
              },
              filters: [],
            },
          },
          {
            type: "CUSTOM",
            text: ")",
          },
        ],
      },
    },
  ],
};
