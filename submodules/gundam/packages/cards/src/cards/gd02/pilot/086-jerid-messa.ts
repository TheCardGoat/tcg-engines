import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02JeridMessa086: PilotCard = {
  cardNumber: "GD02-086",
  name: "Jerid Messa",
  type: "pilot",
  color: "blue",
  traits: ["titans"],
  id: "GD02-086",
  externalId: "gundam:gd02-086",
  slug: "jerid-messa-gd02-086",
  displayName: "Jerid Messa",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-086",
  printings: [
    {
      id: "GD02-086",
      collectorNumber: "GD02-086",
      cardNumber: "GD02-086",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-086.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-086.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-086",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-086.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-086.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>While you have another (Titans) Unit in play, this gets AP+1.<br>",
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
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "titans",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
            },
          },
        },
      ],
      sourceText: "While you have another (Titans) Unit in play, this gets AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
