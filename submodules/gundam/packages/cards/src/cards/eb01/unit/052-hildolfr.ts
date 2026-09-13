import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01Hildolfr052: UnitCard = {
  cardNumber: "EB01-052",
  name: "Hildolfr",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-052",
  canonicalId: "EB01-052",
  externalIds: { bandai: "gundam:eb01-052" },
  slug: "hildolfr-eb01-052",
  displayName: "Hildolfr",
  rulesText:
    "【Deploy】If 3 or more enemy Units are in play, choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-052",
  printings: [
    {
      id: "EB01-052",
      artId: "EB01-052",
      setCode: "EB01",
      collectorNumber: "EB01-052",
      cardNumber: "EB01-052",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-052.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-052",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-052.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 2,
  cost: 2,
  ap: 0,
  hp: 2,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["earth"],
  effect:
    "【Deploy】If 3 or more enemy Units are in play, choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 3,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If 3 or more enemy Units are in play, choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
