import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05DestinyGundam055: UnitCard = {
  cardNumber: "GD05-055",
  name: "Destiny Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "GD05-055",
  canonicalId: "GD05-055",
  externalIds: { bandai: "gundam:gd05-055" },
  slug: "destiny-gundam-gd05-055",
  displayName: "Destiny Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-055",
  printings: [
    {
      id: "GD05-055",
      artId: "GD05-055",
      setCode: "GD05",
      collectorNumber: "GD05-055",
      cardNumber: "GD05-055",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-055.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-055.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-055_p1",
      artId: "GD05-055_p1",
      setCode: "GD05",
      collectorNumber: "GD05-055_p1",
      cardNumber: "GD05-055",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-055_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-055_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-055", "GD05-055_p1"],
  selectedPrintingId: "GD05-055",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-055.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-055.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 8,
  cost: 7,
  ap: 5,
  hp: 6,
  linkCondition: "[Shinn Asuka]",
  battlefieldZones: ["space", "earth"],
  effect:
    "<First Strike> (While this Unit is attacking, it deals damage before the enemy Unit.)\n【Once per Turn】When this Unit receives enemy battle damage, reduce it by 2.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 2,
            target: {
              owner: "self",
              cardType: "unit",
            },
            damageType: "battle",
            source: "enemy",
            duration: "thisTurn",
          },
        },
      ],
      sourceText: "【Once per Turn】When this Unit receives enemy battle damage, reduce it by 2.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "FirstStrike" }],
  rarity: "rare",
};
