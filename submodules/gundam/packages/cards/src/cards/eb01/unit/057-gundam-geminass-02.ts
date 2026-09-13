import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamGeminass02057: UnitCard = {
  cardNumber: "EB01-057",
  name: "Gundam Geminass 02",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-057",
  canonicalId: "EB01-057",
  externalIds: { bandai: "gundam:eb01-057" },
  slug: "gundam-geminass-02-eb01-057",
  displayName: "Gundam Geminass 02",
  rulesText:
    "【Deploy】You may choose 1 active friendly Unit that is Lv.3. Rest it. If you do, choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner's hand.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-057",
  printings: [
    {
      id: "EB01-057",
      artId: "EB01-057",
      setCode: "EB01",
      collectorNumber: "EB01-057",
      cardNumber: "EB01-057",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-057.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-057",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-057.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】You may choose 1 active friendly Unit that is Lv.3. Rest it. If you do, choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "eq",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】You may choose 1 active friendly Unit that is Lv.3. Rest it. If you do, choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
