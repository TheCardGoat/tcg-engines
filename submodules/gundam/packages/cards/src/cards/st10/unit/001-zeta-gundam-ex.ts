import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st10ZetaGundamEx001: UnitCard = {
  cardNumber: "ST10-001",
  name: "Zeta Gundam (EX)",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "ST10-001",
  canonicalId: "ST10-001",
  externalIds: { bandai: "gundam:st10-001" },
  slug: "zeta-gundam-ex-st10-001",
  displayName: "Zeta Gundam (EX)",
  rulesText:
    "When this Unit destroys an enemy shield area card with battle damage, set it as active. It can't choose the same enemy player or enemy team as its attack target during this turn.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-001",
  printings: [
    {
      id: "ST10-001",
      artId: "ST10-001",
      setCode: "ST10",
      collectorNumber: "ST10-001",
      cardNumber: "ST10-001",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-001.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-001-p1",
      artId: "ST10-001_p1",
      setCode: "ST10",
      collectorNumber: "ST10-001-p1",
      cardNumber: "ST10-001",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-001_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-001",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-001.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 7,
  cost: 6,
  ap: 5,
  hp: 5,
  linkCondition: "[Kamille Bidan]",
  battlefieldZones: ["space", "earth"],
  effect:
    "When this Unit destroys an enemy shield area card with battle damage, set it as active. It can't choose the same enemy player or enemy team as its attack target during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [
          {
            type: "eventCardIsSelf",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
            },
          },
        },
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText:
        "When this Unit destroys an enemy shield area card with battle damage, set it as active. It can't choose the same enemy player or enemy team as its attack target during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
