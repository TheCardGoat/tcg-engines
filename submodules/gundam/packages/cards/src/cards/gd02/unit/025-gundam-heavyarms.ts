import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamHeavyarms025: UnitCard = {
  cardNumber: "GD02-025",
  name: "Gundam Heavyarms",
  type: "unit",
  color: "green",
  traits: ["operation meteor"],
  id: "GD02-025",
  externalId: "gundam:gd02-025",
  slug: "gundam-heavyarms-gd02-025",
  displayName: "Gundam Heavyarms",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-025",
  printings: [
    {
      id: "GD02-025",
      collectorNumber: "GD02-025",
      cardNumber: "GD02-025",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-025.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-025.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-025",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-025.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-025.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  effect:
    "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "topAndBottom",
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
