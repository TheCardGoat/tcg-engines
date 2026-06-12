import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04LunamariaHawke095: PilotCard = {
  cardNumber: "GD04-095",
  name: "Lunamaria Hawke",
  type: "pilot",
  color: "purple",
  traits: ["zaft", "minerva squad", "coordinator"],
  id: "GD04-095",
  externalId: "gundam:gd04-095",
  slug: "lunamaria-hawke-gd04-095",
  displayName: "Lunamaria Hawke",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-095",
  printings: [
    {
      id: "GD04-095",
      collectorNumber: "GD04-095",
      cardNumber: "GD04-095",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-095.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-095.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-095_p1",
      collectorNumber: "GD04-095_p1",
      cardNumber: "GD04-095",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-095_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-095_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-095",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-095.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-095.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 of your (Minerva Squad) Units. During this turn, battle damage it would receive is dealt to this Unit instead.",
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
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "redirectBattleDamage",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "minerva squad",
                },
              ],
            },
            redirectTo: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 of your (Minerva Squad) Units. During this turn, battle damage it would receive is dealt to this Unit instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
