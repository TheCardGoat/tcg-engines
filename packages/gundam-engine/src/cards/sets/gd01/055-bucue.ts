import type { UnitCardDefinition } from "../../card-types";

export const Bucue: UnitCardDefinition = {
  id: "gd01-055",
  name: "BuCUE",
  cardNumber: "GD01-055",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Activate･Main】&lt;Support 2&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)
",
  imageUrl: "../images/cards/card/GD01-055.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 3,
  zones: [
    "earth",
  ],
  traits: [
    "zaft",
  ],
  linkRequirements: [
    "-",
  ],
  keywords: [
    {
      keyword: "Support",
      value: 2,
    },
  ],
  abilities: [
    {
      activated: {
        timing: "MAIN",
      },
      description: "【Activate･Main】 <Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      effect: {
        type: "UNKNOWN",
        rawText: "<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      },
    },
  ],
};
