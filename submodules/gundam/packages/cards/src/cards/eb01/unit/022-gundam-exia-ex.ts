import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamExiaEx022: UnitCard = {
  cardNumber: "EB01-022",
  name: "Gundam Exia (EX)",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-022",
  canonicalId: "EB01-022",
  externalIds: { bandai: "gundam:eb01-022" },
  slug: "gundam-exia-ex-eb01-022",
  displayName: "Gundam Exia (EX)",
  rulesText:
    "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【During Pair･(G Generation) Pilot】At the end of your turn, you may destroy this Unit. If you do, deploy 3 [Gundam Exia]((G Generation)･AP2･HP2) Unit tokens.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-022",
  printings: [
    {
      id: "EB01-022",
      artId: "EB01-022",
      setCode: "EB01",
      collectorNumber: "EB01-022",
      cardNumber: "EB01-022",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-022.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-022-p1",
      artId: "EB01-022_p1",
      setCode: "EB01",
      collectorNumber: "EB01-022-p1",
      cardNumber: "EB01-022",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-022_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-022",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-022.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 5,
  linkCondition: "(Attack) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【During Pair･(G Generation) Pilot】At the end of your turn, you may destroy this Unit. If you do, deploy 3 [Gundam Exia]((G Generation)･AP2･HP2) Unit tokens.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["endOfTurn"],
        conditions: [
          {
            type: "duringPair",
          },
        ],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "g generation",
        },
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: { owner: "self", cardType: "unit" },
          },
          optional: true,
        },
        {
          action: {
            action: "deployToken",
            token: {
              name: "Gundam Exia",
              traits: ["g generation"],
              ap: 2,
              hp: 2,
              deployState: "active",
            },
            count: 3,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【During Pair·(G Generation) Pilot】At the end of your turn, you may destroy this Unit. If you do, deploy 3 [Gundam Exia]((G Generation)·AP2·HP2) Unit tokens.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 5 }],
  rarity: "legendRare",
};
