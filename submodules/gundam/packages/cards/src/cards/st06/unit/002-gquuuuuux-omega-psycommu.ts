import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st06GquuuuuuxOmegaPsycommu002: UnitCard = {
  cardNumber: "ST06-002",
  name: "GQuuuuuuX (Omega Psycommu)",
  type: "unit",
  color: "red",
  traits: ["clan"],
  id: "ST06-002",
  externalId: "gundam:st06-002",
  slug: "gquuuuuux-omega-psycommu-st06-002",
  displayName: "GQuuuuuuX (Omega Psycommu)",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-002",
  printings: [
    {
      id: "ST06-002",
      collectorNumber: "ST06-002",
      cardNumber: "ST06-002",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-002.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-002_p1",
      collectorNumber: "ST06-002_p1",
      cardNumber: "ST06-002",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-002_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
    {
      id: "ST06-002_p2",
      collectorNumber: "ST06-002_p2",
      cardNumber: "ST06-002",
      set: {
        code: "ST06",
        name: "Starter Release Event",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-002_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-002_p2.webp?260424",
      productName: "Starter Release Event",
    },
    {
      id: "ST06-002_p3",
      collectorNumber: "ST06-002_p3",
      cardNumber: "ST06-002",
      set: {
        code: "EVX05",
        name: "Premium Card Collection [EVX05]",
        packageId: "616701",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-002_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-002_p3.webp?260424",
      productName: "Premium Card Collection [EVX05]",
    },
  ],
  selectedPrintingId: "ST06-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-002.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 2,
  effect:
    "【Deploy】If another friendly (Clan) Unit is in play, choose 1 enemy Unit. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "Clan",
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
        "【Deploy】If another friendly (Clan) Unit is in play, choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
