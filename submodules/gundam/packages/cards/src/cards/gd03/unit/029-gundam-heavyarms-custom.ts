import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamHeavyarmsCustom029: UnitCard = {
  cardNumber: "GD03-029",
  name: "Gundam Heavyarms Custom",
  type: "unit",
  color: "green",
  traits: ["g team"],
  id: "GD03-029",
  externalId: "gundam:gd03-029",
  slug: "gundam-heavyarms-custom-gd03-029",
  displayName: "Gundam Heavyarms Custom",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-029",
  printings: [
    {
      id: "GD03-029",
      collectorNumber: "GD03-029",
      cardNumber: "GD03-029",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-029.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-029.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-029",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-029.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-029.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Trowa Barton]",
  effect:
    "During your turn, when this Unit destroys an enemy Unit with battle damage, deal 2 damage to all enemy Units with <Blocker>.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              hasKeyword: "Blocker",
            },
          },
        },
      ],
      sourceText:
        "During your turn, when this Unit destroys an enemy Unit with battle damage, deal 2 damage to all enemy Units with <Blocker>.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
