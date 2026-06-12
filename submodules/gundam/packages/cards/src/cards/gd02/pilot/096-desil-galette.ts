import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02DesilGalette096: PilotCard = {
  cardNumber: "GD02-096",
  name: "Desil Galette",
  type: "pilot",
  color: "purple",
  traits: ["vagan", "x-rounder"],
  id: "GD02-096",
  externalId: "gundam:gd02-096",
  slug: "desil-galette-gd02-096",
  displayName: "Desil Galette",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-096",
  printings: [
    {
      id: "GD02-096",
      collectorNumber: "GD02-096",
      cardNumber: "GD02-096",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-096.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-096.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-096_p1",
      collectorNumber: "GD02-096_p1",
      cardNumber: "GD02-096",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-096_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-096_p1.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "GD02-096_p2",
      collectorNumber: "GD02-096_p2",
      cardNumber: "GD02-096",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-096_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-096_p2.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "GD02-096",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-096.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-096.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Linked】You may choose 1 (Vagan) Unit card that is Lv.2 or lower from your trash. Pay its cost to deploy it.<br>",
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
            action: "deployFromTrash",
            levelAtMost: 2,
            payCost: true,
          },
          optional: true,
        },
      ],
      sourceText:
        "【When Linked】You may choose 1 (Vagan) Unit card that is Lv.2 or lower from your trash. Pay its cost to deploy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
