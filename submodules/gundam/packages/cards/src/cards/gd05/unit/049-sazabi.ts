import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Sazabi049: UnitCard = {
  cardNumber: "GD05-049",
  name: "Sazabi",
  type: "unit",
  color: "purple",
  traits: ["neo zeon"],
  id: "GD05-049",
  canonicalId: "GD05-049",
  externalIds: { bandai: "gundam:gd05-049" },
  slug: "sazabi-gd05-049",
  displayName: "Sazabi",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-049",
  printings: [
    {
      id: "GD05-049",
      artId: "GD05-049",
      setCode: "GD05",
      collectorNumber: "GD05-049",
      cardNumber: "GD05-049",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-049.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-049.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-049_p1",
      artId: "GD05-049_p1",
      setCode: "GD05",
      collectorNumber: "GD05-049_p1",
      cardNumber: "GD05-049",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-049_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-049_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-049_p2",
      artId: "GD05-049_p2",
      setCode: "GD05",
      collectorNumber: "GD05-049_p2",
      cardNumber: "GD05-049",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-049_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-049_p2.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-049", "GD05-049_p1", "GD05-049_p2"],
  selectedPrintingId: "GD05-049",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-049.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-049.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Char Aznable]",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Suppression> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【Attack】You may choose 1 of your Units. Destroy it. If you do, all enemy players each choose 1 of their non-battling Units. Destroy them.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: {
                timing: [],
              },
              directives: [
                {
                  action: {
                    action: "destroy",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      isBattling: false,
                      count: 1,
                    },
                  },
                },
              ],
              sourceText: "Choose 1 of your non-battling Units. Destroy it.",
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Attack】You may choose 1 of your Units. Destroy it. If you do, all enemy players each choose 1 of their non-battling Units. Destroy them.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Suppression" }],
  rarity: "legendRare",
};
