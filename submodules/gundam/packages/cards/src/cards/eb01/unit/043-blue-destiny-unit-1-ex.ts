import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01BlueDestinyUnit1Ex043: UnitCard = {
  cardNumber: "EB01-043",
  name: "Blue Destiny Unit-1 (EX)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-043",
  canonicalId: "EB01-043",
  externalIds: { bandai: "gundam:eb01-043" },
  slug: "blue-destiny-unit-1-ex-eb01-043",
  displayName: "Blue Destiny Unit-1 (EX)",
  rulesText:
    "【Attack】If a friendly Unit with <Blocker> is in play, choose 1 enemy Unit that is Lv.5 or lower. It gets AP-2 during this battle.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-043",
  printings: [
    {
      id: "EB01-043",
      artId: "EB01-043",
      setCode: "EB01",
      collectorNumber: "EB01-043",
      cardNumber: "EB01-043",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-043.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-043-p1",
      artId: "EB01-043_p1",
      setCode: "EB01",
      collectorNumber: "EB01-043-p1",
      cardNumber: "EB01-043",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-043_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-043",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-043.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 3,
  ap: 5,
  hp: 3,
  linkCondition: "[Yuu Kajima]",
  battlefieldZones: ["earth"],
  effect:
    "【Attack】If a friendly Unit with <Blocker> is in play, choose 1 enemy Unit that is Lv.5 or lower. It gets AP-2 during this battle.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasKeyword: "Blocker",
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
                  comparison: "lte",
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】If a friendly Unit with <Blocker> is in play, choose 1 enemy Unit that is Lv.5 or lower. It gets AP-2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
