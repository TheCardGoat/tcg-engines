import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05ChadChadan096: PilotCard = {
  cardNumber: "GD05-096",
  name: "Chad Chadan",
  type: "pilot",
  color: "purple",
  traits: ["tekkadan", "alaya-vijnana"],
  id: "GD05-096",
  canonicalId: "GD05-096",
  externalIds: { bandai: "gundam:gd05-096" },
  slug: "chad-chadan-gd05-096",
  displayName: "Chad Chadan",
  rulesText:
    "【Burst】Add this card to your hand.\n【Attack】You may deal 1 damage to this Unit. If you do, choose 1 of your other (Tekkadan) Units. It recovers 1 HP.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-096",
  printings: [
    {
      id: "GD05-096",
      artId: "GD05-096",
      setCode: "GD05",
      collectorNumber: "GD05-096",
      cardNumber: "GD05-096",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-096.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-096",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-096.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
  level: 3,
  cost: 1,
  apBonus: 0,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】You may deal 1 damage to this Unit. If you do, choose 1 of your other (Tekkadan) Units. It recovers 1 HP.",
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
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
          optional: true,
        },
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "tekkadan",
                },
              ],
              excludeSource: true,
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Attack】You may deal 1 damage to this Unit. If you do, choose 1 of your other (Tekkadan) Units. It recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
