import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const eb01KyciliaZabiGwazine086: BaseCard = {
  cardNumber: "EB01-086",
  name: "Kycilia Zabi & Gwazine",
  type: "base",
  color: "blue",
  traits: ["g generation", "warship"],
  id: "EB01-086",
  canonicalId: "EB01-086",
  externalIds: { bandai: "gundam:eb01-086" },
  slug: "kycilia-zabi-gwazine-eb01-086",
  displayName: "Kycilia Zabi & Gwazine",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Once per Turn】When a friendly (G Generation) Unit links, it gains <Repair 2> during this turn.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-086",
  printings: [
    {
      id: "EB01-086",
      artId: "EB01-086",
      setCode: "EB01",
      collectorNumber: "EB01-086",
      cardNumber: "EB01-086",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-086.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-086",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-086.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 2,
  hp: 5,
  battlefieldZones: ["space"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Once per Turn】When a friendly (G Generation) Unit links, it gains <Repair 2> during this turn.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
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
                  value: "g generation",
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
            action: "grantKeywordEventCard",
            keyword: "Repair",
            keywordValue: 2,
            duration: "thisTurn",
            sourceFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When a friendly (G Generation) Unit links, it gains <Repair 2> during this turn. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
