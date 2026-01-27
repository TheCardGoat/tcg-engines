import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ZeeZulu: UnitCardDefinition = {
  id: "gd01-059",
  name: "Zee Zulu",
  cardNumber: "GD01-059",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-059.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 2,
  zones: ["earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["-"],
  abilities: [
    {
      trigger: "ON_ATTACK",
      description:
        "【Attack】 If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 2,
        duration: "turn",
      },
    },
  ],
};
