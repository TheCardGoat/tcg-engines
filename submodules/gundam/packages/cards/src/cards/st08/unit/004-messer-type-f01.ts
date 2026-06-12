import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st08MesserTypeF01004: UnitCard = {
  cardNumber: "ST08-004",
  name: "Messer Type-F01",
  type: "unit",
  color: "red",
  traits: ["mafty"],
  id: "ST08-004",
  externalId: "gundam:st08-004",
  slug: "messer-type-f01-st08-004",
  displayName: "Messer Type-F01",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-004",
  printings: [
    {
      id: "ST08-004",
      collectorNumber: "ST08-004",
      cardNumber: "ST08-004",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-004.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-004_p1",
      collectorNumber: "ST08-004_p1",
      cardNumber: "ST08-004",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-004_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-004_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-004",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-004.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 1,
  linkCondition: "(Mafty) Trait",
  effect:
    "【Attack】If this Unit is attacking an enemy Unit, choose 1 enemy Unit. Deal 1 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "isAttackingUnit",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】If this Unit is attacking an enemy Unit, choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
