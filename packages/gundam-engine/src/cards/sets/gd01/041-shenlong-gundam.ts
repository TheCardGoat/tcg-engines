import type { UnitCardDefinition } from "../../card-types";

export const ShenlongGundam_GD01_041: UnitCardDefinition = {
  id: "gd01-041",
  name: "Shenlong Gundam",
  cardNumber: "GD01-041",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 4,
  cost: 3,
  text: "<Breach 3> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-041.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 3,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["chang-wufei"],
  keywords: [
    {
      keyword: "Breach",
      value: 3,
    },
  ],
  abilities: [
    {
      description:
        "<Breach 3> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      effect: {
        type: "UNKNOWN",
        rawText:
          "<Breach 3> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      },
    },
  ],
};
