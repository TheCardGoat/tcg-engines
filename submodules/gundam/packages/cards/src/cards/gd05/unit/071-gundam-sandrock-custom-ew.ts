import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamSandrockCustomEw071: UnitCard = {
  cardNumber: "GD05-071",
  name: "Gundam Sandrock Custom (EW)",
  type: "unit",
  color: "white",
  traits: ["g team"],
  id: "GD05-071",
  canonicalId: "GD05-071",
  externalIds: { bandai: "gundam:gd05-071" },
  slug: "gundam-sandrock-custom-ew-gd05-071",
  displayName: "Gundam Sandrock Custom (EW)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-071",
  printings: [
    {
      id: "GD05-071",
      artId: "GD05-071",
      setCode: "GD05",
      collectorNumber: "GD05-071",
      cardNumber: "GD05-071",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-071.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-071.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-071_p1",
      artId: "GD05-071_p1",
      setCode: "GD05",
      collectorNumber: "GD05-071_p1",
      cardNumber: "GD05-071",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-071_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-071_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-071", "GD05-071_p1"],
  selectedPrintingId: "GD05-071",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-071.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-071.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "[Quatre Raberba Winner]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Attack】If you have another (G Team)/(Preventer) Unit in play, choose 1 enemy Unit. It gets AP-2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: ["g team", "preventer"],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】If you have another (G Team)/(Preventer) Unit in play, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
