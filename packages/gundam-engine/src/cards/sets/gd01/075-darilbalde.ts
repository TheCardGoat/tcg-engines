import type { UnitCardDefinition } from "../../card-types";

export const Darilbalde: UnitCardDefinition = {
  id: "gd01-075",
  name: "Darilbalde",
  cardNumber: "GD01-075",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "white",
  level: 3,
  cost: 2,
  text: "【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-075.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 4,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["(academy)-trait"],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.",
      },
    },
  ],
};
