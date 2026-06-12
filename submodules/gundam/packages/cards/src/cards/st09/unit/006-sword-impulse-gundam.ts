import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st09SwordImpulseGundam006: UnitCard = {
  cardNumber: "ST09-006",
  name: "Sword Impulse Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "ST09-006",
  externalId: "gundam:st09-006",
  slug: "sword-impulse-gundam-st09-006",
  displayName: "Sword Impulse Gundam",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-006",
  printings: [
    {
      id: "ST09-006",
      collectorNumber: "ST09-006",
      cardNumber: "ST09-006",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-006.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-006_p1",
      collectorNumber: "ST09-006_p1",
      cardNumber: "ST09-006",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-006_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST09-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-006.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 4,
  hp: 2,
  linkCondition: "(Coordinator) Trait / (Minerva Squad) Trait",
  effect:
    "【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "deployedFromZone", zone: "trash" }],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
