import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const eb01TiffaAdillFreeden090: BaseCard = {
  cardNumber: "EB01-090",
  name: "Tiffa Adill & Freeden",
  type: "base",
  color: "white",
  traits: ["g generation", "warship"],
  id: "EB01-090",
  canonicalId: "EB01-090",
  externalIds: { bandai: "gundam:eb01-090" },
  slug: "tiffa-adill-freeden-eb01-090",
  displayName: "Tiffa Adill & Freeden",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, choose 1 Unit with 2 or less HP belonging to each enemy player. Return them to their owners' hands.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-090",
  printings: [
    {
      id: "EB01-090",
      artId: "EB01-090",
      setCode: "EB01",
      collectorNumber: "EB01-090",
      cardNumber: "EB01-090",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-090.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-090",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-090.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 2,
  cost: 2,
  hp: 4,
  battlefieldZones: ["earth"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, choose 1 Unit with 2 or less HP belonging to each enemy player. Return them to their owners' hands.",
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
            action: "resolveThenQueue",
            first: { action: "addShieldToHand", count: 1 },
            condition: { type: "isTurn", whose: "friendly" },
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "returnToHand",
                    target: {
                      owner: "opponent",
                      cardType: "unit",
                      count: 1,
                      attributeFilters: [{ attribute: "hp", comparison: "lte", value: 2 }],
                    },
                  },
                },
              ],
              sourceText:
                "Then, if it is your turn, choose 1 Unit with 2 or less HP belonging to each enemy player. Return them to their owners' hands.",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, choose 1 Unit with 2 or less HP belonging to each enemy player. Return them to their owners' hands.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
