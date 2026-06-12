import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02FlitAsuno088: PilotCard = {
  cardNumber: "GD02-088",
  name: "Flit Asuno",
  type: "pilot",
  color: "green",
  traits: ["earth federation", "asuno family", "x-rounder"],
  id: "GD02-088",
  externalId: "gundam:gd02-088",
  slug: "flit-asuno-gd02-088",
  displayName: "Flit Asuno",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-088",
  printings: [
    {
      id: "GD02-088",
      collectorNumber: "GD02-088",
      cardNumber: "GD02-088",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-088.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-088.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-088_p1",
      collectorNumber: "GD02-088_p1",
      cardNumber: "GD02-088",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-088_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-088_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-088_p2",
      collectorNumber: "GD02-088_p2",
      cardNumber: "GD02-088",
      set: {
        code: "GD02",
        name: "Booster Release Event",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-088_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-088_p2.webp?260424",
      productName: "Booster Release Event",
    },
  ],
  selectedPrintingId: "GD02-088",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-088.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-088.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    '【Burst】Add this card to your hand.<br>【When Linked】Look at the top 3 cards of your deck. You may reveal 1 green (Earth Federation) Unit card/1 card with "AGE Device" in its card name among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.<br>',
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
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
          },
        },
      ],
      sourceText:
        '【When Linked】Look at the top 3 cards of your deck. You may reveal 1 green (Earth Federation) Unit card/1 card with "AGE Device" in its card name among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
