import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamAstrayRedFrameCustomEx001: UnitCard = {
  cardNumber: "EB01-001",
  name: "Gundam Astray Red Frame Custom (EX)",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-001",
  canonicalId: "EB01-001",
  externalIds: { bandai: "gundam:eb01-001" },
  slug: "gundam-astray-red-frame-custom-ex-eb01-001",
  displayName: "Gundam Astray Red Frame Custom (EX)",
  rulesText:
    "【Activate･Main】【Once per Turn】Exile 2 Command cards from your trash from the game：Choose 1 damaged enemy Unit that is Lv.7 or lower. Rest it. It won't be set as active during the start phase of your opponent's next turn.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-001",
  printings: [
    {
      id: "EB01-001",
      artId: "EB01-001",
      setCode: "EB01",
      collectorNumber: "EB01-001",
      cardNumber: "EB01-001",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-001.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-001-p1",
      artId: "EB01-001_p1",
      setCode: "EB01",
      collectorNumber: "EB01-001-p1",
      cardNumber: "EB01-001",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-001_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-001",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-001.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Lowe Guele]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Activate･Main】【Once per Turn】Exile 2 Command cards from your trash from the game：Choose 1 damaged enemy Unit that is Lv.7 or lower. Rest it. It won't be set as active during the start phase of your opponent's next turn.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        exileFromTrash: {
          owner: "friendly",
          cardType: "command",
          zone: "trash",
          count: 2,
        },
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "damaged",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 7,
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "preventActive",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "damaged",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 7,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Exile 2 Command cards from your trash from the game：Choose 1 damaged enemy Unit that is Lv.7 or lower. Rest it. It won't be set as active during the start phase of your opponent's next turn.",
    },
  ] satisfies CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
