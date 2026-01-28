import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ShenlongGundam: UnitCardDefinition = {
  id: "gd01-029",
  name: "Shenlong Gundam",
  cardNumber: "GD01-029",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "green",
  level: 5,
  cost: 4,
  text: "<Breach 4> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)\n【Attack】Choose 1 enemy Unit with <Blocker> that is Lv.3 or lower. Destroy it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-029.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 4,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["chang-wufei"],
  keywords: [
    {
      keyword: "Breach",
      value: 4,
    },
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "eff-nya62d9ug",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "Choose 1 enemy Unit with that is Lv.3 or lower. Destroy it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "3 or lower",
          },
          {
            type: "CUSTOM",
            text: "Destroy it",
          },
        ],
      },
    },
  ],
};
