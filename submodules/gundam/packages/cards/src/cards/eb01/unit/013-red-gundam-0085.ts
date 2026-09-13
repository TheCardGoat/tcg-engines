import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01RedGundam0085013: UnitCard = {
  cardNumber: "EB01-013",
  name: "Red Gundam(0085)",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-013",
  canonicalId: "EB01-013",
  externalIds: { bandai: "gundam:eb01-013" },
  slug: "red-gundam-0085-eb01-013",
  displayName: "Red Gundam(0085)",
  rulesText:
    "【Attack】If an enemy player has 6 or more cards in their hand, this Unit gets AP+2 during this turn.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-013",
  printings: [
    {
      id: "EB01-013",
      artId: "EB01-013",
      setCode: "EB01",
      collectorNumber: "EB01-013",
      cardNumber: "EB01-013",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-013.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-013",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-013.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 2,
  cost: 2,
  ap: 0,
  hp: 4,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Attack】If an enemy player has 6 or more cards in their hand, this Unit gets AP+2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "handCount",
            owner: "opponent",
            comparison: "gte",
            count: 6,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Attack】If an enemy player has 6 or more cards in their hand, this Unit gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
