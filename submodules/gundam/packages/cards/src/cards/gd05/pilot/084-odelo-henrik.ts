import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05OdeloHenrik084: PilotCard = {
  cardNumber: "GD05-084",
  name: "Odelo Henrik",
  type: "pilot",
  color: "blue",
  traits: ["league militaire"],
  id: "GD05-084",
  canonicalId: "GD05-084",
  externalIds: { bandai: "gundam:gd05-084" },
  slug: "odelo-henrik-gd05-084",
  displayName: "Odelo Henrik",
  rulesText:
    "【Burst】Add this card to your hand.\nWhen one of your (League Militaire) Unit tokens receives enemy effect damage, reduce it by 1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-084",
  printings: [
    {
      id: "GD05-084",
      artId: "GD05-084",
      setCode: "GD05",
      collectorNumber: "GD05-084",
      cardNumber: "GD05-084",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-084.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-084",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-084.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit V Gundam",
  level: 3,
  cost: 1,
  apBonus: 2,
  hpBonus: 0,
  effect:
    "【Burst】Add this card to your hand.\nWhen one of your (League Militaire) Unit tokens receives enemy effect damage, reduce it by 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "league militaire",
                },
              ],
            },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "When one of your (League Militaire) Unit tokens receives enemy effect damage, reduce it by 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
