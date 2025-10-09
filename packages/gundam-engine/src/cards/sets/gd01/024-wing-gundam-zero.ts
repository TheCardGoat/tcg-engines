import type { UnitCardDefinition } from "../../card-types";

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
  text: "&lt;High-Maneuver&gt; (This Unit can&#039;t be blocked.)
【Deploy】Deal 3 damage to all Units that are Lv.5 or lower.
",
  imageUrl: "../images/cards/card/GD01-024.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 5,
  hp: 7,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "g",
    "team",
  ],
  linkRequirements: [
    "heero-yuy",
  ],
  keywords: [
    {
      keyword: "High-Maneuver",
    },
  ],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Deal 3 damage to all Units that are Lv.5 or lower.",
      effect: {
        type: "DAMAGE",
        amount: 3,
        target: {
          type: "unknown",
          rawText: "all Units that are Lv",
        },
      },
    },
  ],
};
