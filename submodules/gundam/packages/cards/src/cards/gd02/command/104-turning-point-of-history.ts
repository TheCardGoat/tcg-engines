import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02TurningPointOfHistory104: CommandCard = {
  cardNumber: "GD02-104",
  name: "Turning Point of History",
  type: "command",
  color: "green",
  traits: ["-"],
  id: "GD02-104",
  externalId: "gundam:gd02-104",
  slug: "turning-point-of-history-gd02-104",
  displayName: "Turning Point of History",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-104",
  printings: [
    {
      id: "GD02-104",
      collectorNumber: "GD02-104",
      cardNumber: "GD02-104",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-104.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-104.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-104_p1",
      collectorNumber: "GD02-104_p1",
      cardNumber: "GD02-104",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-104_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-104_p1.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "GD02-104_p2",
      collectorNumber: "GD02-104_p2",
      cardNumber: "GD02-104",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-104_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-104_p2.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "GD02-104",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-104.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-104.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  effect:
    "【Main】Look at the top 3 cards of your deck and return 1 to the top. Return the remaining cards to the bottom of your deck. Then, if you have a (Newtype) Pilot in play, draw 1.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            remainingDestination: "bottom",
          },
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText:
        "【Main】Look at the top 3 cards of your deck and return 1 to the top. Return the remaining cards to the bottom of your deck. Then, if you have a (Newtype) Pilot in play, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
