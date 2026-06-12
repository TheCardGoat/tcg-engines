import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02QuattroBajeena098: PilotCard = {
  cardNumber: "GD02-098",
  name: "Quattro Bajeena",
  type: "pilot",
  color: "white",
  traits: ["aeug", "newtype"],
  id: "GD02-098",
  externalId: "gundam:gd02-098",
  slug: "quattro-bajeena-gd02-098",
  displayName: "Quattro Bajeena",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-098",
  printings: [
    {
      id: "GD02-098",
      collectorNumber: "GD02-098",
      cardNumber: "GD02-098",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-098.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-098.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-098_p1",
      collectorNumber: "GD02-098_p1",
      cardNumber: "GD02-098",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 02",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-098_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-098_p1.webp?260424",
      productName: "Store Tournament Participant Pack 02",
    },
    {
      id: "GD02-098_p2",
      collectorNumber: "GD02-098_p2",
      cardNumber: "GD02-098",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 02",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-098_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-098_p2.webp?260424",
      productName: "Store Tournament Winner Pack 02",
    },
  ],
  selectedPrintingId: "GD02-098",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-098.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-098.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "This card's name is also treated as [Char Aznable].<br>\n【Burst】Add this card to your hand.<br>【When Linked】If this is an (AEUG) Unit, draw 1. If you do, discard 1.<br>",
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
        // "If this is an (AEUG) Unit" — gates the whole trigger on the
        // linked unit carrying the (aeug) trait. `linkedUnitHasTrait`
        // resolves via the pilot-rebound `selfIdentityCardId` (rule
        // 3-3-9-1) and is false when unpaired or when the linked unit
        // lacks the trait.
        conditions: [{ type: "linkedUnitHasTrait", trait: "aeug" }],
      },
      // Non-targeted mandatory `draw` always resolves, so
      // `dependsOnPrevious` on the `discard` here fires iff the `draw`
      // fired at all — in other words: the whole clause triggers on the
      // AEUG gate and then draw-then-discard run in sequence. Keeping
      // the dependency explicit matches the printed "If you do"
      // connective (rule-less but canonical).
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
        {
          action: {
            action: "discard",
            count: 1,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: "【When Linked】If this is an (AEUG) Unit, draw 1. If you do, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
