import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04WitchesFromEarth108: CommandCard = {
  cardNumber: "GD04-108",
  name: "Witches from Earth",
  type: "command",
  color: "green",
  traits: ["academy", "dawn of fold"],
  id: "GD04-108",
  externalId: "gundam:gd04-108",
  slug: "witches-from-earth-gd04-108",
  displayName: "Witches from Earth",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-108",
  printings: [
    {
      id: "GD04-108",
      collectorNumber: "GD04-108",
      cardNumber: "GD04-108",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-108.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-108.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-108",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-108.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-108.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Sophie Pulone",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly (Academy) Unit. During this turn, reduce the next damage it receives by 2. If you use an EX Resource to play this card, reduce by 4 instead.\n【Pilot】[Sophie Pulone]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 2,
            exResourceAmount: 4,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly (Academy) Unit. During this turn, reduce the next damage it receives by 2. If you use an EX Resource to play this card, reduce by 4 instead. 【Pilot】[Sophie Pulone]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
