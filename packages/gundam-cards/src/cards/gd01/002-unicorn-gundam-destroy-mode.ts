import type { UnitCardDefinition } from "@tcg/gundam-types";

export const UnicornGundamDestroyMode: UnitCardDefinition = {
  id: "gd01-002",
  name: "Unicorn Gundam (Destroy Mode)",
  cardNumber: "GD01-002",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "blue",
  level: 7,
  cost: 6,
  text: 'When playing this card from your hand, you may destroy 1 of your Link Units with "Unicorn Mode" in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.\n【Attack】Choose 1 enemy Unit. Rest it.',
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-002.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 5,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["civilian"],
  linkRequirements: ["banagher-links"],
  effects: [
    {
      id: "eff-gm4vabo3c",
      type: "CONSTANT",
      description:
        'When playing this card from your hand, you may destroy 1 of your Link Units with "Unicorn Mode" in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.',
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "5",
          },
          {
            type: "CONDITIONAL",
            conditions: [],
            trueAction: {
              type: "CUSTOM",
              text: "play this card as if it has 0 Lv",
            },
          },
          {
            type: "CUSTOM",
            text: "and cost",
          },
        ],
      },
    },
    {
      id: "eff-wa5p01gnn",
      type: "TRIGGERED",
      timing: "ATTACK",
      description: "Choose 1 enemy Unit. Rest it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "REST",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
};
