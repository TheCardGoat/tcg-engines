import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04ReyZaBurrel093: PilotCard = {
  cardNumber: "GD04-093",
  name: "Rey Za Burrel",
  type: "pilot",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "GD04-093",
  externalId: "gundam:gd04-093",
  slug: "rey-za-burrel-gd04-093",
  displayName: "Rey Za Burrel",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-093",
  printings: [
    {
      id: "GD04-093",
      collectorNumber: "GD04-093",
      cardNumber: "GD04-093",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-093.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-093.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-093_p1",
      collectorNumber: "GD04-093_p1",
      cardNumber: "GD04-093",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-093_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-093_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-093",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-093.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-093.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 of your (ZAFT) Link Units. During this turn, reduce the next damage it receives by 2.",
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
            action: "reduceNextDamage",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              isLinkUnit: true,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zaft" }],
            },
            source: "enemy",
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 of your (ZAFT) Link Units. During this turn, reduce the next damage it receives by 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
