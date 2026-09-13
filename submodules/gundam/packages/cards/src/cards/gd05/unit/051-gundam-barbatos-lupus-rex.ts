import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamBarbatosLupusRex051: UnitCard = {
  cardNumber: "GD05-051",
  name: "Gundam Barbatos Lupus Rex",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD05-051",
  canonicalId: "GD05-051",
  externalIds: { bandai: "gundam:gd05-051" },
  slug: "gundam-barbatos-lupus-rex-gd05-051",
  displayName: "Gundam Barbatos Lupus Rex",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-051",
  printings: [
    {
      id: "GD05-051",
      artId: "GD05-051",
      setCode: "GD05",
      collectorNumber: "GD05-051",
      cardNumber: "GD05-051",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-051.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-051.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-051_p1",
      artId: "GD05-051_p1",
      setCode: "GD05",
      collectorNumber: "GD05-051_p1",
      cardNumber: "GD05-051",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-051_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-051_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-051", "GD05-051_p1"],
  selectedPrintingId: "GD05-051",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-051.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-051.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
  level: 7,
  cost: 6,
  ap: 4,
  hp: 6,
  linkCondition: "[Mikazuki Augus]",
  battlefieldZones: ["space", "earth"],
  effect:
    "Increase this Unit's AP by an amount equal to the amount of damage it has received.\nAt the end of your turn, you may choose 1 of your (Tekkadan) Units. Deal 1 damage to it. Set it as active.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "statModifierByDamageReceived",
            stat: "ap",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText:
        "Increase this Unit's AP by an amount equal to the amount of damage it has received.",
    },
    {
      type: "triggered",
      activation: { timing: ["endOfTurn"] },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "tekkadan" }],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "tekkadan" }],
            },
          },
          dependsOnPrevious: true,
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "At the end of your turn, you may choose 1 of your (Tekkadan) Units. Deal 1 damage to it. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
