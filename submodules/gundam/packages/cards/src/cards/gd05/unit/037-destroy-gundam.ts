import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05DestroyGundam037: UnitCard = {
  cardNumber: "GD05-037",
  name: "Destroy Gundam",
  type: "unit",
  color: "red",
  traits: ["earth alliance", "phantom pain"],
  id: "GD05-037",
  canonicalId: "GD05-037",
  externalIds: { bandai: "gundam:gd05-037" },
  slug: "destroy-gundam-gd05-037",
  displayName: "Destroy Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-037",
  printings: [
    {
      id: "GD05-037",
      artId: "GD05-037",
      setCode: "GD05",
      collectorNumber: "GD05-037",
      cardNumber: "GD05-037",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-037.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-037.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-037_p1",
      artId: "GD05-037_p1",
      setCode: "GD05",
      collectorNumber: "GD05-037_p1",
      cardNumber: "GD05-037",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-037_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-037_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-037", "GD05-037_p1"],
  selectedPrintingId: "GD05-037",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-037.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-037.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 9,
  cost: 8,
  ap: 6,
  hp: 6,
  linkCondition: "(Biological CPU) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "While an enemy player has 7 or more cards in their trash, this card in your hand gets Lv. -3 and cost -3.\n【During Link】This Unit gains <Breach 3>.\n\n(During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "trash",
            comparison: "gte",
            count: 7,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "levelReductionByCount",
            amountPerMatch: 3,
            countFilter: {
              owner: "self",
              zone: "hand",
              cardType: "unit",
            },
            target: {
              owner: "self",
              zone: "hand",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "costReductionByCount",
            amountPerMatch: 3,
            countFilter: {
              owner: "self",
              zone: "hand",
              cardType: "unit",
            },
            target: {
              owner: "self",
              zone: "hand",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While an enemy player has 7 or more cards in their trash, this card in your hand gets Lv. -3 and cost -3.",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】This Unit gains <Breach 3>. (During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
