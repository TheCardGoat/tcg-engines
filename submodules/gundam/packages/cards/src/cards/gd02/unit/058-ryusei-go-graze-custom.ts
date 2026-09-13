import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02RyuseiGoGrazeCustom058: UnitCard = {
  cardNumber: "GD02-058",
  name: "Ryusei-Go (Graze Custom Ⅱ)",
  type: "unit",
  battlefieldZones: ["space", "earth"],
  color: "purple",
  traits: ["tekkadan"],
  id: "GD02-058",
  canonicalId: "GD02-058",
  externalIds: { bandai: "gundam:gd02-058" },
  slug: "ryusei-go-graze-custom-gd02-058",
  displayName: "Ryusei-Go (Graze Custom Ⅱ)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-058",
  printings: [
    {
      id: "GD02-058",
      artId: "GD02-058",
      setCode: "GD02",
      collectorNumber: "GD02-058",
      cardNumber: "GD02-058",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-058.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-058.webp?260715",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-058_p1",
      artId: "GD02-058_p1",
      setCode: "GD02",
      collectorNumber: "GD02-058_p1",
      cardNumber: "GD02-058",
      set: {
        code: "GD02",
        name: "NEWTYPE CHALLENGE 2026 MISSION 3 Upper Ranks Prize",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-058_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-058_p1.webp?260715",
      productName: "NEWTYPE CHALLENGE 2026 MISSION 3 Upper Ranks Prize",
    },
    {
      id: "GD02-058_p2",
      artId: "GD02-058_p2",
      setCode: "SC01",
      collectorNumber: "GD02-058_p2",
      cardNumber: "GD02-058",
      set: {
        code: "SC01",
        name: "Deck Build Box Freedom Ascension [SC01]",
        packageId: "616301",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-058_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-058_p2.webp?260715",
      productName: "Deck Build Box Freedom Ascension [SC01]",
    },
  ],
  reprints: ["GD02-058", "GD02-058_p1", "GD02-058_p2"],
  selectedPrintingId: "GD02-058",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-058.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-058.webp?260715",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 2,
  linkCondition: "(Tekkadan) Trait",
  effect:
    "【Deploy】Choose 1 of your Units. Deal 1 damage to it. If you do, draw 1. Then, discard 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      // "Deal 1 damage" is mandatory (not optional) but still gates the
      // following draw-then-discard through `dependsOnPrevious`.
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
            action: "drawThenDiscard",
            drawCount: 1,
            discardCount: 1,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your Units. Deal 1 damage to it. If you do, draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
