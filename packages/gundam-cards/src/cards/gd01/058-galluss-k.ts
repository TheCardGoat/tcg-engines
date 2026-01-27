import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gallussk: UnitCardDefinition = {
  id: "gd01-058",
  name: "Galluss-K",
  cardNumber: "GD01-058",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Activate･Action】【Once per Turn】①：Choose 1 Unit that is Lv.4 or higher. It gets AP+1 during this battle.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-058.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "gd01-058-effect-1",
      description:
        "【Activate･Action】 【Once per Turn】①：Choose 1 Unit that is Lv.4 or higher. It gets AP+1 during this battle.",
      type: "ACTIVATED",
      timing: "ACTION",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: 1,
          duration: "turn",
        },
      },
    },
  ],
};
