import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01StrikerCustomEx046: UnitCard = {
  cardNumber: "EB01-046",
  name: "Striker Custom (EX)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-046",
  canonicalId: "EB01-046",
  externalIds: { bandai: "gundam:eb01-046" },
  slug: "striker-custom-ex-eb01-046",
  displayName: "Striker Custom (EX)",
  rulesText:
    "【During Pair】【Attack】Choose 1 enemy Unit that is Lv.4 or higher. It gets AP-2 during this battle.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-046",
  printings: [
    {
      id: "EB01-046",
      artId: "EB01-046",
      setCode: "EB01",
      collectorNumber: "EB01-046",
      cardNumber: "EB01-046",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-046.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-046-p1",
      artId: "EB01-046_p1",
      setCode: "EB01",
      collectorNumber: "EB01-046-p1",
      cardNumber: "EB01-046",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-046_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-046",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-046.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Ittou Tsurugi]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【During Pair】【Attack】Choose 1 enemy Unit that is Lv.4 or higher. It gets AP-2 during this battle.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringPair",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Attack】Choose 1 enemy Unit that is Lv.4 or higher. It gets AP-2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
