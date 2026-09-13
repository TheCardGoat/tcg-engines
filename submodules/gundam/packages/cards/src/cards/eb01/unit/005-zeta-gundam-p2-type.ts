import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01ZetaGundamP2Type005: UnitCard = {
  cardNumber: "EB01-005",
  name: "Zeta Gundam Ⅲ P2 Type",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-005",
  canonicalId: "EB01-005",
  externalIds: { bandai: "gundam:eb01-005" },
  slug: "zeta-gundam-p2-type-eb01-005",
  displayName: "Zeta Gundam Ⅲ P2 Type",
  rulesText:
    "【Deploy】Choose 1 rested Unit belonging to another player. Set it as active. Draw 1.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-005",
  printings: [
    {
      id: "EB01-005",
      artId: "EB01-005",
      setCode: "EB01",
      collectorNumber: "EB01-005",
      cardNumber: "EB01-005",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-005.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-005",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-005.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 7,
  cost: 6,
  ap: 6,
  hp: 4,
  linkCondition: "(Support) Trait",
  battlefieldZones: ["space", "earth"],
  effect: "【Deploy】Choose 1 rested Unit belonging to another player. Set it as active. Draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 rested Unit belonging to another player. Set it as active. Draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
