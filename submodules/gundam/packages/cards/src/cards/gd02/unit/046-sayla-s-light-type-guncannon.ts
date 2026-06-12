import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02SaylaSLightTypeGuncannon046: UnitCard = {
  cardNumber: "GD02-046",
  name: "Sayla's Light-Type Guncannon",
  type: "unit",
  color: "red",
  traits: ["earth federation"],
  id: "GD02-046",
  externalId: "gundam:gd02-046",
  slug: "sayla-s-light-type-guncannon-gd02-046",
  displayName: "Sayla's Light-Type Guncannon",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-046",
  printings: [
    {
      id: "GD02-046",
      collectorNumber: "GD02-046",
      cardNumber: "GD02-046",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-046.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-046.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-046",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-046.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-046.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 4,
  effect: "【Deploy】Choose 1 enemy Unit token. Deal 2 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              isToken: true,
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit token. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
