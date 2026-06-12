import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st06RedGundam005: UnitCard = {
  cardNumber: "ST06-005",
  name: "Red Gundam",
  type: "unit",
  color: "green",
  traits: ["clan"],
  id: "ST06-005",
  externalId: "gundam:st06-005",
  slug: "red-gundam-st06-005",
  displayName: "Red Gundam",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-005",
  printings: [
    {
      id: "ST06-005",
      collectorNumber: "ST06-005",
      cardNumber: "ST06-005",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-005.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-005.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-005_p1",
      collectorNumber: "ST06-005_p1",
      cardNumber: "ST06-005",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-005_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-005_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
    {
      id: "ST06-005_p2",
      collectorNumber: "ST06-005_p2",
      cardNumber: "ST06-005",
      set: {
        code: "PC02A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
        packageId: "616701",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-005_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-005_p2.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
    },
  ],
  selectedPrintingId: "ST06-005",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-005.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-005.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Shuji Itō]",
  effect:
    "<Breach 1> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Attack】Choose 1 to 2 friendly (Clan) Units. They get AP+2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "clan",
                },
              ],
              count: {
                min: 1,
                max: 2,
              },
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 to 2 friendly (Clan) Units. They get AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 1 }],
  rarity: "legendRare",
};
export const pc02aRedGundam005 = st06RedGundam005;
