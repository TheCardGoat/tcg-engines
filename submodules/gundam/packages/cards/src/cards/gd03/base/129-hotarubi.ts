import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Hotarubi129: BaseCard = {
  cardNumber: "GD03-129",
  name: "Hotarubi",
  type: "base",
  traits: ["tekkadan", "warship"],
  id: "GD03-129",
  externalId: "gundam:gd03-129",
  slug: "hotarubi-gd03-129",
  displayName: "Hotarubi",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-129",
  printings: [
    {
      id: "GD03-129",
      collectorNumber: "GD03-129",
      cardNumber: "GD03-129",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-129.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-129.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-129",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-129.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-129.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\nDuring your turn, when one of your friendly (Tekkadan)/(Teiwaz) Units receives effect damage, you may rest this Base. If you do, place the top card of your deck into your trash.",
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
        timing: ["onEffectDamageReceived"],
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
                    { attribute: "trait", comparison: "includes", value: "tekkadan" },
                    { attribute: "trait", comparison: "includes", value: "teiwaz" },
                  ],
                },
              ],
            },
          },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "rest",
            target: { owner: "self", cardType: "base", state: "active", count: 1 },
          },
        },
        {
          dependsOnPrevious: true,
          action: { action: "millDeck", count: 1, owner: "self" },
        },
      ],
      sourceText:
        "During your turn, when one of your friendly (Tekkadan)/(Teiwaz) Units receives effect damage, you may rest this Base. If you do, place the top card of your deck into your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
