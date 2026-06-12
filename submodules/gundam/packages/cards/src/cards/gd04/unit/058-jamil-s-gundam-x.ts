import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04JamilSGundamX058: UnitCard = {
  cardNumber: "GD04-058",
  name: "Jamil's Gundam X",
  type: "unit",
  color: "purple",
  traits: ["old une"],
  id: "GD04-058",
  externalId: "gundam:gd04-058",
  slug: "jamil-s-gundam-x-gd04-058",
  displayName: "Jamil's Gundam X",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-058",
  printings: [
    {
      id: "GD04-058",
      collectorNumber: "GD04-058",
      cardNumber: "GD04-058",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-058.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-058.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-058",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-058.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-058.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 1,
  effect:
    "【During Pair･(Vulture) Pilot】【Destroyed】If it is your turn, return this Unit's paired Pilot to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "duringPair" }, { type: "selfPairedPilotHasTrait", trait: "vulture" }],
      },
      directives: [
        {
          condition: {
            type: "isTurn",
            whose: "friendly",
          },
          thenDirectives: [
            {
              action: {
                action: "returnPairedPilotToHand",
              },
            },
          ],
        },
      ],
      sourceText:
        "【During Pair·(Vulture) Pilot】【Destroyed】If it is your turn, return this Unit's paired Pilot to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
