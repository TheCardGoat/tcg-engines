import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05V2Gundam001: UnitCard = {
  cardNumber: "GD05-001",
  name: "V2 Gundam",
  type: "unit",
  color: "blue",
  traits: ["league militaire", "victory type"],
  id: "GD05-001",
  canonicalId: "GD05-001",
  externalIds: { bandai: "gundam:gd05-001" },
  slug: "v2-gundam-gd05-001",
  displayName: "V2 Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-001",
  printings: [
    {
      id: "GD05-001",
      artId: "GD05-001",
      setCode: "GD05",
      collectorNumber: "GD05-001",
      cardNumber: "GD05-001",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-001.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-001_p1",
      artId: "GD05-001_p1",
      setCode: "GD05",
      collectorNumber: "GD05-001_p1",
      cardNumber: "GD05-001",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-001_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-001", "GD05-001_p1"],
  selectedPrintingId: "GD05-001",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-001.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit V Gundam",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 5,
  linkCondition: "[Üso Ewin]",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【Activate･Main】【Once per Turn】Rest 2 of your Units：Set this Unit as active.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        restTarget: {
          owner: "friendly",
          cardType: "unit",
          count: 2,
          state: "active",
        },
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Rest 2 of your Units：Set this Unit as active.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 2 }],
  rarity: "legendRare",
};
