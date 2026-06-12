import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamThroneDrei041: UnitCard = {
  cardNumber: "GD04-041",
  name: "Gundam Throne Drei",
  type: "unit",
  color: "red",
  traits: ["cb", "trinity"],
  id: "GD04-041",
  externalId: "gundam:gd04-041",
  slug: "gundam-throne-drei-gd04-041",
  displayName: "Gundam Throne Drei",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-041",
  printings: [
    {
      id: "GD04-041",
      collectorNumber: "GD04-041",
      cardNumber: "GD04-041",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-041.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-041.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-041",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-041.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-041.webp?260424",
  legality: "legal",
  level: 5,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "(Trinity) Trait",
  effect: "【Once per Turn】When this Unit is rested by an effect, set it as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onRestedByEffect"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "eventCardIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
              state: "rested",
            },
          },
        },
      ],
      sourceText: "【Once per Turn】When this Unit is rested by an effect, set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
