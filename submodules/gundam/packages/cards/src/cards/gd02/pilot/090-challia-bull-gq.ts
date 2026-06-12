import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02ChalliaBullGq090: PilotCard = {
  cardNumber: "GD02-090",
  name: "Challia Bull (GQ)",
  type: "pilot",
  color: "green",
  traits: ["zeon", "newtype"],
  id: "GD02-090",
  externalId: "gundam:gd02-090",
  slug: "challia-bull-gq-gd02-090",
  displayName: "Challia Bull (GQ)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-090",
  printings: [
    {
      id: "GD02-090",
      collectorNumber: "GD02-090",
      cardNumber: "GD02-090",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-090.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-090.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-090_p1",
      collectorNumber: "GD02-090_p1",
      cardNumber: "GD02-090",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-090_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-090_p1.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "GD02-090_p2",
      collectorNumber: "GD02-090_p2",
      cardNumber: "GD02-090",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-090_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-090_p2.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "GD02-090",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-090.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-090.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>While you have another Unit with &lt;High-Maneuver&gt; in play, this Unit gets AP+1.<br>",
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
      activation: {},
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "While you have another Unit with <High-Maneuver> in play, this Unit gets AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
