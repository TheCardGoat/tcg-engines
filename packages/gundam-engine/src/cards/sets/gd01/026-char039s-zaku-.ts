import type { UnitCardDefinition } from "../../card-types";

export const Char039sZaku: UnitCardDefinition = {
  id: "gd01-026",
  name: "Char&#039;s Zaku Ⅱ",
  cardNumber: "GD01-026",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "green",
  level: 3,
  cost: 2,
  text: "【During Pair】【Destroyed】Deploy 1 rested [Char&#039;s Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.
",
  imageUrl: "../images/cards/card/GD01-026.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 2,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "zeon",
  ],
  linkRequirements: [
    "char-aznable",
  ],
  abilities: [
    {
      trigger: "ON_DESTROY",
      description: "【Destroyed】 Deploy 1 rested [Char&#039;s Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.",
      effect: {
        type: "UNKNOWN",
        rawText: "Deploy 1 rested [Char&#039;s Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.",
      },
    },
  ],
};
