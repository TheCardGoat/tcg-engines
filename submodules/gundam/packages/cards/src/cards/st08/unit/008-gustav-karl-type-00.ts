import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st08GustavKarlType00008: UnitCard = {
  cardNumber: "ST08-008",
  name: "Gustav Karl Type-00",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "ST08-008",
  externalId: "gundam:st08-008",
  slug: "gustav-karl-type-00-st08-008",
  displayName: "Gustav Karl Type-00",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-008",
  printings: [
    {
      id: "ST08-008",
      collectorNumber: "ST08-008",
      cardNumber: "ST08-008",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-008.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-008.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-008_p1",
      collectorNumber: "ST08-008_p1",
      cardNumber: "ST08-008",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-008_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-008_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-008",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-008.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-008.webp?260424",
  legality: "legal",
  level: 3,
  cost: 3,
  ap: 3,
  hp: 4,
  effect:
    "While 3 or more enemy Units are in play, this Unit gains <Blocker>.\n\r\n(Rest this Unit to change the attack target to it.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 3,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While 3 or more enemy Units are in play, this Unit gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
