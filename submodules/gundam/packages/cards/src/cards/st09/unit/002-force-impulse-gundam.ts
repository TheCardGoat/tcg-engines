import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st09ForceImpulseGundam002: UnitCard = {
  cardNumber: "ST09-002",
  name: "Force Impulse Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "ST09-002",
  externalId: "gundam:st09-002",
  slug: "force-impulse-gundam-st09-002",
  displayName: "Force Impulse Gundam",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-002",
  printings: [
    {
      id: "ST09-002",
      collectorNumber: "ST09-002",
      cardNumber: "ST09-002",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-002.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-002_p1",
      collectorNumber: "ST09-002_p1",
      cardNumber: "ST09-002",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-002_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST09-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-002.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Shinn Asuka]",
  effect:
    '【Destroyed】Choose 1 (Minerva Squad) Unit card without "Force Impulse Gundam" in its card name from your trash. Add it to your hand.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "minerva squad",
                },
                {
                  attribute: "name",
                  comparison: "excludes",
                  value: "Force Impulse Gundam",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        '【Destroyed】Choose 1 (Minerva Squad) Unit card without "Force Impulse Gundam" in its card name from your trash. Add it to your hand.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
