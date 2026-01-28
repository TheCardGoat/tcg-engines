import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamBarbatos4thForm: UnitCardDefinition = {
  id: "st05-001",
  name: "Gundam Barbatos 4th Form",
  cardNumber: "ST05-001",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "legendary",
  level: 6,
  cost: 4,
  text: "【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.\nWhile this is damaged, it gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 4,
  hp: 5,
  zones: ["space", "earth"],
  traits: ["tekkadan", "gundam", "frame"],
  linkRequirements: ["mikazuki-augus"],
  effects: [
    {
      id: "eff-s6kte4st7",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn. While this is damaged, it gains . (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 1,
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
    },
  ],
  keywords: [
    {
      keyword: "Suppression",
    },
  ],
};
