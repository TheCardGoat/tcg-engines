import type { UnitCardDefinition } from "../../card-types";

export const Char039sGelgoog: UnitCardDefinition = {
  id: "gd01-023",
  name: "Char&#039;s Gelgoog",
  cardNumber: "GD01-023",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "green",
  level: 4,
  cost: 4,
  text: "【Activate･Main】Discard 1 (Zeon)/(Neo Zeon) Unit card：If a Pilot is not paired with this Unit, choose 1 (Newtype) Pilot card that is Lv.3 or lower from your trash. Pair it with this Unit.
",
  imageUrl: "../images/cards/card/GD01-023.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 4,
  hp: 3,
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
      activated: {
        timing: "MAIN",
      },
      description: "【Activate･Main】 Discard 1 (Zeon)/(Neo Zeon) Unit card：If a Pilot is not paired with this Unit, choose 1 (Newtype) Pilot card that is Lv.3 or lower from your trash. Pair it with this Unit.",
      effect: {
        type: "UNKNOWN",
        rawText: "Discard 1 (Zeon)/(Neo Zeon) Unit card：If a Pilot is not paired with this Unit, choose 1 (Newtype) Pilot card that is Lv.3 or lower from your trash. Pair it with this Unit.",
      },
    },
  ],
};
