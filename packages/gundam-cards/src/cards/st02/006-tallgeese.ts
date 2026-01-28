import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Tallgeese: UnitCardDefinition = {
  id: "st02-006",
  name: "Tallgeese",
  cardNumber: "ST02-006",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "legendary",
  color: "blue",
  level: 5,
  cost: 4,
  text: "【Activate･Main】【Once per Turn】④：Set this Unit as active.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["oz"],
  linkRequirements: ["zechs-merquise"],
  effects: [
    {
      id: "eff-5mm7ryx85",
      type: "ACTIVATED",
      timing: "MAIN",
      description: "【Once per Turn】④:Set this Unit as active.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [
        {
          type: "ENERGY",
          amount: 4,
        },
      ],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Set this Unit as active.",
      },
    },
  ],
};
