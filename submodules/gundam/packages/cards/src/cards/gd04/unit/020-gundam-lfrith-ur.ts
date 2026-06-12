import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamLfrithUr020: UnitCard = {
  cardNumber: "GD04-020",
  name: "Gundam Lfrith Ur",
  type: "unit",
  color: "green",
  traits: ["dawn of fold", "academy"],
  id: "GD04-020",
  externalId: "gundam:gd04-020",
  slug: "gundam-lfrith-ur-gd04-020",
  displayName: "Gundam Lfrith Ur",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-020",
  printings: [
    {
      id: "GD04-020",
      collectorNumber: "GD04-020",
      cardNumber: "GD04-020",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-020.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-020.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-020",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-020.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-020.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Sophie Pulone]",
  effect:
    "【Once per Turn】During your turn, when you play and activate a (Dawn of Fold) Command card using an EX Resource, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onCommandEffectActivated"],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "eventPlayerIsSelf" },
          { type: "eventPaidExResources", comparison: "gte", count: 1 },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "dawn of fold",
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
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when you play and activate a (Dawn of Fold) Command card using an EX Resource, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
