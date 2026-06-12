import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundvLva025: UnitCard = {
  cardNumber: "GD04-025",
  name: "Gundvölva",
  type: "unit",
  color: "green",
  traits: ["dawn of fold", "academy"],
  id: "GD04-025",
  externalId: "gundam:gd04-025",
  slug: "gundv-lva-gd04-025",
  displayName: "Gundvölva",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-025",
  printings: [
    {
      id: "GD04-025",
      collectorNumber: "GD04-025",
      cardNumber: "GD04-025",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-025.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-025.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-025",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-025.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-025.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Destroyed】During your turn, if you have another (Dawn of Fold) Unit in play, place 1 EX Resource.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "unitCount",
            owner: "friendly",
            hasTrait: "dawn of fold",
            excludeSelf: true,
            comparison: "gte",
            count: 1,
          },
        ],
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
        "【Destroyed】During your turn, if you have another (Dawn of Fold) Unit in play, place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
