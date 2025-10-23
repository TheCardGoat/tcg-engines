import type { UnitCardDefinition } from "../../card-types";

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
  keywords: [
    {
      keyword: "Breach",
      value: 3,
    },
  ],
  abilities: [
    {
      condition: "DURING_PAIR",
      description:
        "【During Pair】 This Unit gains <Breach 3>. (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      effect: {
        type: "UNKNOWN",
        rawText:
          "This Unit gains <Breach 3>. (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      },
    },
  ],
};
