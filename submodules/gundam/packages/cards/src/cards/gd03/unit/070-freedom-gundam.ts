import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03FreedomGundam070: UnitCard = {
  cardNumber: "GD03-070",
  name: "Freedom Gundam",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD03-070",
  externalId: "gundam:gd03-070",
  slug: "freedom-gundam-gd03-070",
  displayName: "Freedom Gundam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-070",
  printings: [
    {
      id: "GD03-070",
      collectorNumber: "GD03-070",
      cardNumber: "GD03-070",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-070.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-070.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-070_p1",
      collectorNumber: "GD03-070_p1",
      cardNumber: "GD03-070",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-070_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-070_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-070",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-070.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-070.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Kira Yamato]",
  effect:
    "While this Unit is rested, friendly Shields can't receive battle damage from enemy Units.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "selfIsRested" }],
      },
      directives: [
        {
          action: {
            action: "preventDamageToZone",
            zone: "shieldArea",
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
            },
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "While this Unit is rested, friendly Shields can't receive battle damage from enemy Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
