import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamPharact018: UnitCard = {
  cardNumber: "GD04-018",
  name: "Gundam Pharact",
  type: "unit",
  color: "green",
  traits: ["academy"],
  id: "GD04-018",
  externalId: "gundam:gd04-018",
  slug: "gundam-pharact-gd04-018",
  displayName: "Gundam Pharact",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-018",
  printings: [
    {
      id: "GD04-018",
      collectorNumber: "GD04-018",
      cardNumber: "GD04-018",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-018.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-018.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-018_p1",
      collectorNumber: "GD04-018_p1",
      cardNumber: "GD04-018",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-018_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-018_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-018",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-018.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-018.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Elan Ceres]",
  effect:
    "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Once per Turn】During your turn, when one of your other (Academy) Units receives damage from an enemy, place 1 EX Resource.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onBattleDamageReceived", "onEnemyEffectDamage"],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "eventDamageSourceIsOpponent" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
            },
          },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            state: "active",
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when one of your other (Academy) Units receives damage from an enemy, place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 5 }],
  rarity: "legendRare",
};
