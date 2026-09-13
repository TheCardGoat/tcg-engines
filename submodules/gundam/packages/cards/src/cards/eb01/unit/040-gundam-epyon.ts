import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamEpyon040: UnitCard = {
  cardNumber: "EB01-040",
  name: "Gundam Epyon",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-040",
  canonicalId: "EB01-040",
  externalIds: { bandai: "gundam:eb01-040" },
  slug: "gundam-epyon-eb01-040",
  displayName: "Gundam Epyon",
  rulesText:
    "【Deploy】If there are 2 or more enemy players, choose 1 to 3 friendly Units. They gain <Breach 3> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-040",
  printings: [
    {
      id: "EB01-040",
      artId: "EB01-040",
      setCode: "EB01",
      collectorNumber: "EB01-040",
      cardNumber: "EB01-040",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-040.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-040",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-040.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 6,
  linkCondition: "(Attack) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】If there are 2 or more enemy players, choose 1 to 3 friendly Units. They gain <Breach 3> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "enemyPlayerCount", comparison: "gte", count: 2 }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: { min: 1, max: 3 },
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If there are 2 or more enemy players, choose 1 to 3 friendly Units. They gain <Breach 3> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
