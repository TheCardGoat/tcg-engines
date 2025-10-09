import type { UnitCardDefinition } from "../../card-types";

export const DeltaPlus: UnitCardDefinition = {
  id: "gd01-006",
  name: "Delta Plus",
  cardNumber: "GD01-006",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "blue",
  level: 4,
  cost: 3,
  text: "&lt;Repair 1&gt; (At the end of your turn, this Unit recovers the specified number of HP.)
【During Link】This Unit gets HP+1.
",
  imageUrl: "../images/cards/card/GD01-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 4,
  hp: 3,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
  ],
  linkRequirements: [
    "(earth-federation)-trait",
  ],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  abilities: [
    {
      description: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.) 【During Link】This Unit gets HP+1.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "hp",
        modifier: 1,
        duration: "turn",
      },
    },
  ],
};
