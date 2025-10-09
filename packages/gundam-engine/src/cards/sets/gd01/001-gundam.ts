import type { UnitCardDefinition } from "../../card-types";

export const Gundam: UnitCardDefinition = {
  id: "gd01-001",
  name: "Gundam",
  cardNumber: "GD01-001",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "blue",
  level: 4,
  cost: 3,
  text: "All your (White Base Team) Units gain &lt;Repair 1&gt;.<br />
(At the end of your turn, this Unit recovers the specified number of HP.)
【When Paired】If you have 2 or more other Units in play, draw 1.
",
  imageUrl: "../images/cards/card/GD01-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 3,
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
    "amuro-ray",
  ],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  abilities: [
    {
      trigger: "WHEN_PAIRED",
      description: "【When Paired】 If you have 2 or more other Units in play, draw 1.",
      effect: {
        type: "UNKNOWN",
        rawText: "If you have 2 or more other Units in play, draw 1.",
      },
    },
  ],
};
