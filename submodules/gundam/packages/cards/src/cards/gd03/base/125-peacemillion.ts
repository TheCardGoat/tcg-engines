import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Peacemillion125: BaseCard = {
  cardNumber: "GD03-125",
  name: "Peacemillion",
  type: "base",
  traits: ["g team", "warship"],
  id: "GD03-125",
  externalId: "gundam:gd03-125",
  slug: "peacemillion-gd03-125",
  displayName: "Peacemillion",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-125",
  printings: [
    {
      id: "GD03-125",
      collectorNumber: "GD03-125",
      cardNumber: "GD03-125",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-125.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-125.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-125",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-125.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-125.webp?260424",
  legality: "legal",
  level: 6,
  cost: 1,
  hp: 6,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Once per Turn】During your turn, when a friendly (Operation Meteor)/(G Team) Unit that is Lv.6 or higher destroys an enemy Unit with battle damage, that friendly Unit may recover 2 HP.",
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
        timing: ["onDestroyByBattle"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "operation meteor" },
                    { attribute: "trait", comparison: "includes", value: "g team" },
                  ],
                },
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "recoverHPEventCard",
            amount: 2,
            sourceFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "operation meteor" },
                    { attribute: "trait", comparison: "includes", value: "g team" },
                  ],
                },
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 6,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when a friendly (Operation Meteor)/(G Team) Unit that is Lv.6 or higher destroys an enemy Unit with battle damage, that friendly Unit may recover 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
