import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05GirtyLue127: BaseCard = {
  cardNumber: "GD05-127",
  name: "Girty Lue",
  type: "base",
  color: "red",
  traits: ["earth alliance", "phantom pain", "warship"],
  id: "GD05-127",
  canonicalId: "GD05-127",
  externalIds: { bandai: "gundam:gd05-127" },
  slug: "girty-lue-gd05-127",
  displayName: "Girty Lue",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Once per Turn】When a friendly (Phantom Pain) Unit links, choose 1 enemy Unit. It can't activate <Blocker> during this turn.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-127",
  printings: [
    {
      id: "GD05-127",
      artId: "GD05-127",
      setCode: "GD05",
      collectorNumber: "GD05-127",
      cardNumber: "GD05-127",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-127.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-127",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-127.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 2,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Once per Turn】When a friendly (Phantom Pain) Unit links, choose 1 enemy Unit. It can't activate <Blocker> during this turn.",
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
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "phantom pain",
                },
              ],
            },
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "restrictUnit",
            restrictions: ["cannotActivateBlocker"],
            duration: "thisTurn",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When a friendly (Phantom Pain) Unit links, choose 1 enemy Unit. It can't activate <Blocker> during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
