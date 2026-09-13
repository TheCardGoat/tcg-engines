import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamFlaurosRyuseiGo060: UnitCard = {
  cardNumber: "GD05-060",
  name: "Gundam Flauros (Ryusei-Go)",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD05-060",
  canonicalId: "GD05-060",
  externalIds: { bandai: "gundam:gd05-060" },
  slug: "gundam-flauros-ryusei-go-gd05-060",
  displayName: "Gundam Flauros (Ryusei-Go)",
  rulesText: "【Deploy】/【Attack】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-060",
  printings: [
    {
      id: "GD05-060",
      artId: "GD05-060",
      setCode: "GD05",
      collectorNumber: "GD05-060",
      cardNumber: "GD05-060",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-060.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-060",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-060.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 3,
  linkCondition: "(Tekkadan) Trait",
  battlefieldZones: ["space", "earth"],
  effect: "【Deploy】/【Attack】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy", "attack"],
      },
      directives: [
        {
          action: {
            action: "destroy",
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
        },
      ],
      sourceText: "【Deploy】/【Attack】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
