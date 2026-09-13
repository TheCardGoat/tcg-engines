import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamCalibarn018: UnitCard = {
  cardNumber: "GD05-018",
  name: "Gundam Calibarn",
  type: "unit",
  color: "green",
  traits: ["academy"],
  id: "GD05-018",
  canonicalId: "GD05-018",
  externalIds: { bandai: "gundam:gd05-018" },
  slug: "gundam-calibarn-gd05-018",
  displayName: "Gundam Calibarn",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-018",
  printings: [
    {
      id: "GD05-018",
      artId: "GD05-018",
      setCode: "GD05",
      collectorNumber: "GD05-018",
      cardNumber: "GD05-018",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-018.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-018.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-018_p1",
      artId: "GD05-018_p1",
      setCode: "GD05",
      collectorNumber: "GD05-018_p1",
      cardNumber: "GD05-018",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-018_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-018_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-018", "GD05-018_p1"],
  selectedPrintingId: "GD05-018",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-018.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-018.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 8,
  cost: 7,
  ap: 7,
  hp: 5,
  linkCondition: "[Suletta Mercury]",
  battlefieldZones: ["space", "earth"],
  effect:
    "When one of your EX Resources is exiled from the game, you may choose 1 of your Units. During this turn, when it receives enemy damage, reduce it by 3.\n【Deploy】Place 3 EX Resources.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onExResourceExiled"],
        conditions: [{ type: "eventPlayerIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 3,
            duration: "thisTurn",
            source: "enemy",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "When one of your EX Resources is exiled from the game, you may choose 1 of your Units. During this turn, when it receives enemy damage, reduce it by 3.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            count: 3,
            state: "active",
          },
        },
      ],
      sourceText: "【Deploy】Place 3 EX Resources.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
