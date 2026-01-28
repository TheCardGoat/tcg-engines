import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamHeavyarms: UnitCardDefinition = {
  id: "gd01-034",
  name: "Gundam Heavyarms",
  cardNumber: "GD01-034",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "green",
  level: 4,
  cost: 2,
  text: "【During Pair】This Unit gains <Breach 3>.\n\n(When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-034.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 3,
  hp: 4,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["trowa-barton"],
  effects: [
    {
      id: "eff-m1ni1yjbu",
      type: "CONSTANT",
      description:
        "This Unit gains <Breach 3>. (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "GAIN_KEYWORDS",
            keywords: ["Breach 3"],
            duration: "PERMANENT",
            target: {
              controller: "SELF",
              cardType: "UNIT",
              filters: [],
              count: {
                min: 1,
                max: 1,
              },
            },
          },
          {
            type: "CUSTOM",
            text: ")",
          },
        ],
      },
    },
  ],
};
