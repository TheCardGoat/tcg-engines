import type { UnitCardDefinition } from "../../card-types";

export const Gundam: UnitCardDefinition = {
  id: "st01-001",
  name: "Gundam",
  cardNumber: "ST01-001",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "blue",
  level: 4,
  cost: 3,
  text: "&lt;Repair 2&gt; (At the end of your turn, this Unit recovers the specified number of HP.)
【During Pair】During your turn, all your Units get AP+1.
",
  imageUrl: "../images/cards/card/ST01-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 4,
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
      value: 2,
    },
  ],
  abilities: [
    {
      trigger: "DURING_PAIR",
      description: "【During Pair】 During your turn, all your Units get AP+1.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 1,
        duration: "turn",
      },
    },
  ],
};
