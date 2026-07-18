import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02OlbaFrost093: PilotCard = {
  cardNumber: "GD02-093",
  name: "Olba Frost",
  type: "pilot",
  color: "red",
  traits: ["new une"],
  id: "GD02-093",
  canonicalId: "GD02-093",
  externalIds: { bandai: "gundam:gd02-093" },
  slug: "olba-frost/gd02-093",
  displayName: "Olba Frost",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-093",
  printings: [
    {
      id: "GD02-093",
      artId: "GD02-093",
      setCode: "GD02",
      collectorNumber: "GD02-093",
      cardNumber: "GD02-093",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-093.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-093.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-093"],
  selectedPrintingId: "GD02-093",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-093.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-093.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>During your turn, when this Unit destroys an enemy Unit paired with a (Newtype) Pilot with battle damage, draw 1.<br>",
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
        timing: ["onDestroyByBattle"],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "eventCardIsSelf" },
          {
            type: "eventDefeatedCardMatches",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "pairedPilotTrait",
                  comparison: "includes",
                  value: "newtype",
                },
              ],
            },
          },
        ],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText:
        "During your turn, when this Unit destroys an enemy Unit paired with a (Newtype) Pilot with battle damage, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
