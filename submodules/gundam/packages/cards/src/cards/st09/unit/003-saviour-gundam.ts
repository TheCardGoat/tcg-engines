import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st09SaviourGundam003: UnitCard = {
  cardNumber: "ST09-003",
  name: "Saviour Gundam",
  type: "unit",
  color: "red",
  traits: ["zaft", "minerva squad"],
  id: "ST09-003",
  externalId: "gundam:st09-003",
  slug: "saviour-gundam-st09-003",
  displayName: "Saviour Gundam",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-003",
  printings: [
    {
      id: "ST09-003",
      collectorNumber: "ST09-003",
      cardNumber: "ST09-003",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-003.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-003.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-003_p1",
      collectorNumber: "ST09-003_p1",
      cardNumber: "ST09-003",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-003_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-003_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST09-003",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-003.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-003.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Athrun Zala]",
  effect:
    "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【When Linked】If there are 5 or more purple cards in your trash, deal 2 damage to all Units with 5 or less AP.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 5,
            hasColor: "purple",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 2,
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【When Linked】If there are 5 or more purple cards in your trash, deal 2 damage to all Units with 5 or less AP.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 3 }],
  rarity: "legendRare",
};
