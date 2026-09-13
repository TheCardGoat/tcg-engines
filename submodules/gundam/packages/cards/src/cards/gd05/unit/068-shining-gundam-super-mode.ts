import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05ShiningGundamSuperMode068: UnitCard = {
  cardNumber: "GD05-068",
  name: "Shining Gundam (Super Mode)",
  type: "unit",
  color: "white",
  traits: ["mf", "shuffle alliance"],
  id: "GD05-068",
  canonicalId: "GD05-068",
  externalIds: { bandai: "gundam:gd05-068" },
  slug: "shining-gundam-super-mode-gd05-068",
  displayName: "Shining Gundam (Super Mode)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-068",
  printings: [
    {
      id: "GD05-068",
      artId: "GD05-068",
      setCode: "GD05",
      collectorNumber: "GD05-068",
      cardNumber: "GD05-068",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-068.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-068.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-068_p1",
      artId: "GD05-068_p1",
      setCode: "GD05",
      collectorNumber: "GD05-068_p1",
      cardNumber: "GD05-068",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-068_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-068_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-068", "GD05-068_p1"],
  selectedPrintingId: "GD05-068",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-068.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-068.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Domon Kasshu]",
  battlefieldZones: ["space", "earth"],
  effect:
    "When you activate a (Special Move) Command's 【Main】/【Action】, this Unit gains <Suppression> during this turn.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【During Link】【Attack】This Unit gets AP+2 during this battle.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onCommandEffectActivated"],
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "special move" },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText:
        "When you activate a (Special Move) Command's 【Main】/【Action】, this Unit gains <Suppression> during this turn.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】【Attack】This Unit gets AP+2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
