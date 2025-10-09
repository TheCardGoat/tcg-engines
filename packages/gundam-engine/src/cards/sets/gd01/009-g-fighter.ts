import type { UnitCardDefinition } from "../../card-types";

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
  text: "【Deploy】Choose 1 of your (White Base Team) Units. It gains &lt;High-Maneuver&gt; during this turn.<br />
 (This Unit can&#039;t be blocked.)
",
  imageUrl: "../images/cards/card/GD01-009.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 2,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
    "white",
    "base",
    "team",
  ],
  linkRequirements: [
    "(white-base-team)-trait",
  ],
  keywords: [
    {
      keyword: "High-Maneuver",
    },
  ],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Choose 1 of your (White Base Team) Units. It gains <High-Maneuver> during this turn.<br /> (This Unit can&#039;t be blocked.)",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 of your (White Base Team) Units. It gains <High-Maneuver> during this turn.<br /> (This Unit can&#039;t be blocked.)",
      },
    },
  ],
};
