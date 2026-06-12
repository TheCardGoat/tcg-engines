import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st06GquuuuuuxOmegaPsycommu001: UnitCard = {
  cardNumber: "ST06-001",
  name: "GQuuuuuuX (Omega Psycommu)",
  type: "unit",
  color: "red",
  traits: ["clan"],
  id: "ST06-001",
  externalId: "gundam:st06-001",
  slug: "gquuuuuux-omega-psycommu-st06-001",
  displayName: "GQuuuuuuX (Omega Psycommu)",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-001",
  printings: [
    {
      id: "ST06-001",
      collectorNumber: "ST06-001",
      cardNumber: "ST06-001",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-001.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-001_p1",
      collectorNumber: "ST06-001_p1",
      cardNumber: "ST06-001",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-001_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
    {
      id: "ST06-001_p2",
      collectorNumber: "ST06-001_p2",
      cardNumber: "ST06-001",
      set: {
        code: "PC02A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
        packageId: "616701",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-001_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-001_p2.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
    },
  ],
  selectedPrintingId: "ST06-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-001.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Amate Yuzuriha (Machu)]",
  effect:
    "【When Linked】If another friendly (Clan) Unit is in play, this gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "clan",
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【When Linked】If another friendly (Clan) Unit is in play, this gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
export const pc02aGquuuuuuxOmegaPsycommu001 = st06GquuuuuuxOmegaPsycommu001;
