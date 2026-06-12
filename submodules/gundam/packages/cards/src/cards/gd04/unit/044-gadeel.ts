import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Gadeel044: UnitCard = {
  cardNumber: "GD04-044",
  name: "Gadeel",
  type: "unit",
  color: "red",
  traits: ["new une"],
  id: "GD04-044",
  externalId: "gundam:gd04-044",
  slug: "gadeel-gd04-044",
  displayName: "Gadeel",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-044",
  printings: [
    {
      id: "GD04-044",
      collectorNumber: "GD04-044",
      cardNumber: "GD04-044",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-044.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-044.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-044",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-044.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-044.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  effect:
    "【Attack】If you are attacking a damaged enemy Unit, this Unit gains <Breach 3> during this battle.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
              isBattling: {
                opponentMatches: {
                  owner: "opponent",
                  cardType: "unit",
                  state: "damaged",
                },
              },
            },
          },
        },
      ],
      sourceText:
        "【Attack】If you are attacking a damaged enemy Unit, this Unit gains <Breach 3> during this battle. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
