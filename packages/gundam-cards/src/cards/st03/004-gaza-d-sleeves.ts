import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GazaDSleeves: UnitCardDefinition = {
  id: "st03-004",
  name: "Gaza D (Sleeves)",
  cardNumber: "ST03-004",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-004.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 1,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["-"],
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
