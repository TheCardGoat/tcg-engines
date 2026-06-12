import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st08Gundam002: UnitCard = {
  cardNumber: "ST08-002",
  name: "Ξ Gundam",
  type: "unit",
  color: "red",
  traits: ["mafty"],
  id: "ST08-002",
  externalId: "gundam:st08-002",
  slug: "gundam-st08-002",
  displayName: "Ξ Gundam",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-002",
  printings: [
    {
      id: "ST08-002",
      collectorNumber: "ST08-002",
      cardNumber: "ST08-002",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-002.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-002_p1",
      collectorNumber: "ST08-002_p1",
      cardNumber: "ST08-002",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-002_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
    {
      id: "ST08-002_p2",
      collectorNumber: "ST08-002_p2",
      cardNumber: "ST08-002",
      set: {
        code: "ST07",
        name: "Starter Deck [ST07]/[ST08] Release Event",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-002_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-002_p2.webp?260424",
      productName: "Starter Deck [ST07]/[ST08] Release Event",
    },
  ],
  selectedPrintingId: "ST08-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-002.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Hathaway Noa]",
  effect: "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
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
      sourceText: "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const st07Gundam002 = st08Gundam002;
