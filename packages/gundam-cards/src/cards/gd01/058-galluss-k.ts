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
      id: "eff-l8sfxo3oi",
      type: "ACTIVATED",
      timing: "ACTION",
      description:
        "【Once per Turn】①:Choose 1 Unit that is Lv.4 or higher. It gets AP+1 during this battle.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [
        {
          type: "ENERGY",
          amount: 1,
        },
      ],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "4 or higher",
          },
          {
            type: "MODIFY_STATS",
            attribute: "AP",
            value: 1,
            duration: "TURN",
            target: {
              controller: "ANY",
              cardType: "UNIT",
              count: {
                min: 1,
                max: 1,
              },
              filters: [],
            },
          },
        ],
      },
    },
  ],
};
