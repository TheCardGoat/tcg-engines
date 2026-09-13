import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05RaCailum125: BaseCard = {
  cardNumber: "GD05-125",
  name: "Ra Cailum",
  type: "base",
  color: "green",
  traits: ["earth federation", "londo bell", "warship"],
  id: "GD05-125",
  canonicalId: "GD05-125",
  externalIds: { bandai: "gundam:gd05-125" },
  slug: "ra-cailum-gd05-125",
  displayName: "Ra Cailum",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：Choose 1 friendly (Londo Bell) Unit. During this turn, when it receives enemy damage, reduce it by 1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-125",
  printings: [
    {
      id: "GD05-125",
      artId: "GD05-125",
      setCode: "GD05",
      collectorNumber: "GD05-125",
      cardNumber: "GD05-125",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-125.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-125",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-125.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：Choose 1 friendly (Londo Bell) Unit. During this turn, when it receives enemy damage, reduce it by 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      cost: {
        restSelf: true,
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 1,
            duration: "thisTurn",
            source: "enemy",
            consuming: false,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "londo bell",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Base：Choose 1 friendly (Londo Bell) Unit. During this turn, when it receives enemy damage, reduce it by 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
