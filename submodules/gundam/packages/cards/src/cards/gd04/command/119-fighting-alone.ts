import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04FightingAlone119: CommandCard = {
  cardNumber: "GD04-119",
  name: "Fighting Alone",
  type: "command",
  color: "white",
  traits: ["civilian"],
  id: "GD04-119",
  externalId: "gundam:gd04-119",
  slug: "fighting-alone-gd04-119",
  displayName: "Fighting Alone",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-119",
  printings: [
    {
      id: "GD04-119",
      collectorNumber: "GD04-119",
      cardNumber: "GD04-119",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-119.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-119.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-119",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-119.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-119.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Gael Chan",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly Unit paired with a (Newtype) Pilot. It can't receive effect damage from enemy Units during this turn.\n【Pilot】[Gael Chan]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            damageType: "effect",
            sourceCardType: "unit",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "pairedPilotTrait",
                  comparison: "includes",
                  value: "newtype",
                },
              ],
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly Unit paired with a (Newtype) Pilot. It can't receive effect damage from enemy Units during this turn. 【Pilot】[Gael Chan]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
