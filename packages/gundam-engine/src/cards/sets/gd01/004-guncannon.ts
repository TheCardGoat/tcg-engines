import type { UnitCardDefinition } from "../../card-types";

export const Guncannon: UnitCardDefinition = {
  id: "gd01-004",
  name: "Guncannon",
  cardNumber: "GD01-004",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "blue",
  level: 3,
  cost: 2,
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】Choose 1 enemy Unit with 2 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-004.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["(white-base-team)-trait"],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  abilities: [
    {
      trigger: "WHEN_PAIRED",
      description:
        "【When Paired】 Choose 1 enemy Unit with 2 or less HP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 enemy Unit with 2 or less HP. Rest it.",
      },
    },
  ],
};
