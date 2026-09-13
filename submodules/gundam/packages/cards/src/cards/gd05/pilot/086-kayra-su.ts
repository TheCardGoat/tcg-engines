import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05KayraSu086: PilotCard = {
  cardNumber: "GD05-086",
  name: "Kayra Su",
  type: "pilot",
  color: "green",
  traits: ["earth federation", "londo bell"],
  id: "GD05-086",
  canonicalId: "GD05-086",
  externalIds: { bandai: "gundam:gd05-086" },
  slug: "kayra-su-gd05-086",
  displayName: "Kayra Su",
  rulesText:
    "【Burst】Add this card to your hand.\n【During Link】Enemy Units other than Link Units choose this rested Unit as their attack target if possible when attacking.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-086",
  printings: [
    {
      id: "GD05-086",
      artId: "GD05-086",
      setCode: "GD05",
      collectorNumber: "GD05-086",
      cardNumber: "GD05-086",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-086.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-086",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-086.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】Enemy Units other than Link Units choose this rested Unit as their attack target if possible when attacking.",
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
      activation: {
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "forceAttackTarget",
            unit: {
              owner: "opponent",
              cardType: "unit",
              count: "all",
              isLinkUnit: false,
            },
            attackTarget: {
              owner: "self",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "【During Link】Enemy Units other than Link Units choose this rested Unit as their attack target if possible when attacking.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
