import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04VDashGundam006: UnitCard = {
  cardNumber: "GD04-006",
  name: "V-Dash Gundam",
  type: "unit",
  color: "blue",
  traits: ["league militaire", "victory type"],
  id: "GD04-006",
  externalId: "gundam:gd04-006",
  slug: "v-dash-gundam-gd04-006",
  displayName: "V-Dash Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-006",
  printings: [
    {
      id: "GD04-006",
      collectorNumber: "GD04-006",
      cardNumber: "GD04-006",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-006.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-006_p1",
      collectorNumber: "GD04-006_p1",
      cardNumber: "GD04-006",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-006_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-006.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 5,
  linkCondition: "[Üso Ewin]",
  effect:
    "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Activate･Main】【Once per Turn】Rest 1 of your other (League Militaire) Units：Choose 1 enemy Unit with 4 or less HP. Rest it.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        restTarget: {
          owner: "friendly",
          cardType: "unit",
          state: "active",
          excludeSource: true,
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: "league militaire",
            },
          ],
          count: 1,
        },
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Rest 1 of your other (League Militaire) Units：Choose 1 enemy Unit with 4 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 3 }],
  rarity: "rare",
};
