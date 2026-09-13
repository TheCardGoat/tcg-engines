import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Hotarubi129: BaseCard = {
  cardNumber: "GD03-129",
  name: "Hotarubi",
  type: "base",
  color: "purple",
  traits: ["tekkadan", "warship"],
  id: "GD03-129",
  canonicalId: "GD03-129",
  externalIds: { bandai: "gundam:gd03-129" },
  slug: "hotarubi-gd03-129",
  displayName: "Hotarubi",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-129",
  printings: [
    {
      id: "GD03-129",
      artId: "GD03-129",
      setCode: "GD03",
      collectorNumber: "GD03-129",
      cardNumber: "GD03-129",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-129.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-129.webp?260715",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-129_p1",
      artId: "GD03-129_p1",
      setCode: "SC01",
      collectorNumber: "GD03-129_p1",
      cardNumber: "GD03-129",
      set: {
        code: "SC01",
        name: "Deck Build Box Freedom Ascension [SC01]",
        packageId: "616301",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-129_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-129_p1.webp?260715",
      productName: "Deck Build Box Freedom Ascension [SC01]",
    },
  ],
  reprints: ["GD03-129", "GD03-129_p1"],
  selectedPrintingId: "GD03-129",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-129.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-129.webp?260715",
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
