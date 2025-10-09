import type { UnitCardDefinition } from "../../card-types";

export const AngelosGearaZulu: UnitCardDefinition = {
  id: "st03-002",
  name: "Angelo's Geara Zulu",
  cardNumber: "ST03-002",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 4,
  cost: 3,
  text: "【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-002.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["angelo-sauper"],
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
      description:
        "【Activate･Main】 <Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      effect: {
        type: "UNKNOWN",
        rawText:
          "<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      },
    },
  ],
};
