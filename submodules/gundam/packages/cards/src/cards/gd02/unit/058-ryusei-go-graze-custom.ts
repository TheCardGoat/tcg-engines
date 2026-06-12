import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02RyuseiGoGrazeCustom058: UnitCard = {
  cardNumber: "GD02-058",
  name: "Ryusei-Go (Graze Custom Ⅱ)",
  type: "unit",
  color: "purple",
  traits: ["tekkadan"],
  id: "GD02-058",
  externalId: "gundam:gd02-058",
  slug: "ryusei-go-graze-custom-gd02-058",
  displayName: "Ryusei-Go (Graze Custom Ⅱ)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-058",
  printings: [
    {
      id: "GD02-058",
      collectorNumber: "GD02-058",
      cardNumber: "GD02-058",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-058.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-058.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-058_p1",
      collectorNumber: "GD02-058_p1",
      cardNumber: "GD02-058",
      set: {
        code: "GD02",
        name: "NEWTYPE CHALLENGE 2026 MISSION 3 Upper Ranks Prize",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-058_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-058_p1.webp?260424",
      productName: "NEWTYPE CHALLENGE 2026 MISSION 3 Upper Ranks Prize",
    },
  ],
  selectedPrintingId: "GD02-058",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-058.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-058.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 2,
  effect:
    "【Deploy】Choose 1 of your Units. Deal 1 damage to it. If you do, draw 1. Then, discard 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      // "Deal 1 damage" is mandatory (not optional) but still gates the
      // following "draw 1" via the generic `dependsOnPrevious` primitive —
      // if no friendly Unit is available to damage (targeted action with
      // zero candidates), the draw is skipped. The trailing discard is
      // unconditional per the printed "Then, ..." connective.
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "battleArea",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "discard",
            count: 1,
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your Units. Deal 1 damage to it. If you do, draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
