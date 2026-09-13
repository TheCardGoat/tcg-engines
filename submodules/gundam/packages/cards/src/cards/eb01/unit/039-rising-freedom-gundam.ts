import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01RisingFreedomGundam039: UnitCard = {
  cardNumber: "EB01-039",
  name: "Rising Freedom Gundam",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-039",
  canonicalId: "EB01-039",
  externalIds: { bandai: "gundam:eb01-039" },
  slug: "rising-freedom-gundam-eb01-039",
  displayName: "Rising Freedom Gundam",
  rulesText:
    "When playing this card from your hand, if 3 or more enemy Units are in play, play it as if it has 3 Lv. and cost.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-039",
  printings: [
    {
      id: "EB01-039",
      artId: "EB01-039",
      setCode: "EB01",
      collectorNumber: "EB01-039",
      cardNumber: "EB01-039",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-039.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-039",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-039.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 4,
  linkCondition: "(Support) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "When playing this card from your hand, if 3 or more enemy Units are in play, play it as if it has 3 Lv. and cost.",
  effects: [
    {
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "deployCostOverride",
            level: 3,
            cost: 3,
            condition: {
              type: "unitCount",
              owner: "opponent",
              comparison: "gte",
              count: 3,
            },
          },
        },
      ],
      sourceText:
        "When playing this card from your hand, if 3 or more enemy Units are in play, play it as if it has 3 Lv. and cost.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
