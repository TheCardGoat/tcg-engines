import type { UnitCardDefinition } from "@tcg/gundam-types";

export const BlitzGundam: UnitCardDefinition = {
  id: "gd01-049",
  name: "Blitz Gundam",
  cardNumber: "GD01-049",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "red",
  level: 4,
  cost: 3,
  text: "【Deploy】Choose 1 of your (ZAFT) Units with 5 or more AP. It gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-049.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["nicol-amarfi"],
  keywords: [
    {
      keyword: "First-Strike",
    },
  ],
  effects: [
    {
      id: "eff-ejxsxg6kz",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Choose 1 of your (ZAFT) Units with 5 or more AP. It gains during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 0,
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
};
