import type { UnitCardDefinition } from "@tcg/gundam-types";

export const BusterGundam: UnitCardDefinition = {
  id: "gd01-046",
  name: "Buster Gundam",
  cardNumber: "GD01-046",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "red",
  level: 4,
  cost: 2,
  text: "【Activate･Main】<Support 3> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\n【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit&#039;s <Support> to increase a (ZAFT) Unit&#039;s AP, set this Unit as active.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-046.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 1,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["dearka-elthman"],
  keywords: [
    {
      keyword: "Support",
      value: 3,
    },
    {
      keyword: "Support",
    },
  ],
  effects: [
    {
      id: "eff-zytnxz9js",
      type: "ACTIVATED",
      timing: "MAIN",
      description: "during this turn.)",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "during this turn.)",
      },
    },
    {
      id: "eff-qwz1v4yln",
      type: "CONSTANT",
      description:
        "【Once per Turn】When you use this Unit&#039;s to increase a (ZAFT) Unit&#039;s AP, set this Unit as active.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "When you use this Unit&#039;s to increase a (ZAFT) Unit&#039;s AP, set this Unit as active.",
      },
    },
  ],
};
