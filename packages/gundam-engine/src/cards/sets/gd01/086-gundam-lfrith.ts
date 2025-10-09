import type { UnitCardDefinition } from "../../card-types";

export const GundamLfrith: UnitCardDefinition = {
  id: "gd01-086",
  name: "Gundam Lfrith",
  cardNumber: "GD01-086",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 2,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)
",
  imageUrl: "../images/cards/card/GD01-086.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 2,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "vanadis",
    "institute",
  ],
  linkRequirements: [
    "-",
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  abilities: [
    {
      description: "<Blocker> (Rest this Unit to change the attack target to it.)",
      effect: {
        type: "UNKNOWN",
        rawText: "<Blocker> (Rest this Unit to change the attack target to it.)",
      },
    },
  ],
};
