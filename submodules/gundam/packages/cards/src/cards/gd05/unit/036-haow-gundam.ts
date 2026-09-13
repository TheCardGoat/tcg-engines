import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05HaowGundam036: UnitCard = {
  cardNumber: "GD05-036",
  name: "Haow Gundam",
  type: "unit",
  color: "red",
  traits: ["mf"],
  id: "GD05-036",
  canonicalId: "GD05-036",
  externalIds: { bandai: "gundam:gd05-036" },
  slug: "haow-gundam-gd05-036",
  displayName: "Haow Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-036",
  printings: [
    {
      id: "GD05-036",
      artId: "GD05-036",
      setCode: "GD05",
      collectorNumber: "GD05-036",
      cardNumber: "GD05-036",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-036.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-036.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-036_p1",
      artId: "GD05-036_p1",
      setCode: "GD05",
      collectorNumber: "GD05-036_p1",
      cardNumber: "GD05-036",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-036_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-036_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-036", "GD05-036_p1"],
  selectedPrintingId: "GD05-036",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-036.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-036.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Master Asia]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【When Paired】You may choose 1 of your other active (MF) Units. Rest it. If you do, deal 2 damage to all enemy Units whose Lv. is equal to or lower than that Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "restThenDamageByChosenUnitLevel",
            amount: 2,
            referenceTarget: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              state: "active",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "mf",
                },
              ],
              count: 1,
            },
            target: {
              owner: "opponent",
              cardType: "unit",
              count: "all",
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【When Paired】You may choose 1 of your other active (MF) Units. Rest it. If you do, deal 2 damage to all enemy Units whose Lv. is equal to or lower than that Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
