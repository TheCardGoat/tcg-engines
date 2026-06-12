import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st07GundamVirtue004: UnitCard = {
  cardNumber: "ST07-004",
  name: "Gundam Virtue",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "ST07-004",
  externalId: "gundam:st07-004",
  slug: "gundam-virtue-st07-004",
  displayName: "Gundam Virtue",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-004",
  printings: [
    {
      id: "ST07-004",
      collectorNumber: "ST07-004",
      cardNumber: "ST07-004",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-004.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-004_p1",
      collectorNumber: "ST07-004_p1",
      cardNumber: "ST07-004",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-004_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-004_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST07-004",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-004.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Tieria Erde]",
  effect:
    "While you have a (CB) Pilot in play, this Unit gains <Blocker>.\n\r\n(Rest this Unit to change the attack target to it.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            comparison: "gte",
            count: 1,
            hasTrait: "cb",
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
        "While you have a (CB) Pilot in play, this Unit gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
