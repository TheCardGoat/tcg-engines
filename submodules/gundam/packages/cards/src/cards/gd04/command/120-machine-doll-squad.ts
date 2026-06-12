import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04MachineDollSquad120: CommandCard = {
  cardNumber: "GD04-120",
  name: "Machine Doll Squad",
  type: "command",
  color: "white",
  traits: ["militia"],
  id: "GD04-120",
  externalId: "gundam:gd04-120",
  slug: "machine-doll-squad-gd04-120",
  displayName: "Machine Doll Squad",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-120",
  printings: [
    {
      id: "GD04-120",
      collectorNumber: "GD04-120",
      cardNumber: "GD04-120",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-120.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-120.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-120",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-120.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-120.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Miashei Kune",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 friendly (Militia)/(Dianna Counter) Unit. It gets AP+2 during this turn.\n【Pilot】[Miashei Kune]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "militia",
                    },
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "dianna counter",
                    },
                  ],
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly (Militia)/(Dianna Counter) Unit. It gets AP+2 during this turn. 【Pilot】[Miashei Kune]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
