import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05MasterGundam033: UnitCard = {
  cardNumber: "GD05-033",
  name: "Master Gundam",
  type: "unit",
  color: "red",
  traits: ["mf", "dg cells"],
  id: "GD05-033",
  canonicalId: "GD05-033",
  externalIds: { bandai: "gundam:gd05-033" },
  slug: "master-gundam-gd05-033",
  displayName: "Master Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-033",
  printings: [
    {
      id: "GD05-033",
      artId: "GD05-033",
      setCode: "GD05",
      collectorNumber: "GD05-033",
      cardNumber: "GD05-033",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-033.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-033.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-033_p1",
      artId: "GD05-033_p1",
      setCode: "GD05",
      collectorNumber: "GD05-033_p1",
      cardNumber: "GD05-033",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-033_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-033_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-033_p2",
      artId: "GD05-033_p2",
      setCode: "GD05",
      collectorNumber: "GD05-033_p2",
      cardNumber: "GD05-033",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-033_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-033_p2.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-033", "GD05-033_p1", "GD05-033_p2"],
  selectedPrintingId: "GD05-033",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-033.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-033.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Master Asia]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Attack】You may choose 2 (Special Move) Command cards from your trash. Exile them from the game. If you do, deal 5 damage to the first card in your opponent's shield area.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "special move",
                },
              ],
              zone: "trash",
              count: 2,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "dealDamageToFirstOpponentShield",
            amount: 5,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Attack】You may choose 2 (Special Move) Command cards from your trash. Exile them from the game. If you do, deal 5 damage to the first card in your opponent's shield area.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
