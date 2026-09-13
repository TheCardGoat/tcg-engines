import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01PsychoHaroEx042: UnitCard = {
  cardNumber: "EB01-042",
  name: "Psycho Haro (EX)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-042",
  canonicalId: "EB01-042",
  externalIds: { bandai: "gundam:eb01-042" },
  slug: "psycho-haro-ex-eb01-042",
  displayName: "Psycho Haro (EX)",
  rulesText:
    "While this Unit is rested, all Units gain <Blocker>.\n\n(Rest this Unit to change the attack target to it.)\n【Attack】Units that are Lv.7 or lower can't activate <Blocker> during this battle.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-042",
  printings: [
    {
      id: "EB01-042",
      artId: "EB01-042",
      setCode: "EB01",
      collectorNumber: "EB01-042",
      cardNumber: "EB01-042",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-042.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-042-p1",
      artId: "EB01-042_p1",
      setCode: "EB01",
      collectorNumber: "EB01-042-p1",
      cardNumber: "EB01-042",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-042_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-042",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-042.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 6,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "While this Unit is rested, all Units gain <Blocker>.\n\n(Rest this Unit to change the attack target to it.)\n【Attack】Units that are Lv.7 or lower can't activate <Blocker> during this battle.",
  effects: [
    {
      type: "constant",
      activation: { conditions: [{ type: "selfIsRested" }] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "any",
              cardType: "unit",
              count: "all",
            },
          },
        },
      ],
      sourceText:
        "While this Unit is rested, all Units gain <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "restrictUnit",
            target: {
              owner: "any",
              cardType: "unit",
              count: "all",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 7 }],
            },
            restrictions: ["cannotActivateBlocker"],
            duration: "thisBattle",
          },
        },
      ],
      sourceText:
        "【Attack】Units that are Lv.7 or lower can't activate <Blocker> during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
