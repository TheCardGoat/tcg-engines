import type { UnitCardDefinition } from "../../card-types";

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
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "oz",
  ],
  linkRequirements: [
    "zechs-merquise",
  ],
  abilities: [
    {
      activated: {
        timing: "MAIN",
      },
      description: "【Activate･Main】 【Once per Turn】④：Set this Unit as active.",
      effect: {
        type: "UNKNOWN",
        rawText: "【Once per Turn】④：Set this Unit as active.",
      },
    },
  ],
};
