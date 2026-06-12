import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamKimarisTrooperTrooperMode080: UnitCard = {
  cardNumber: "GD03-080",
  name: "Gundam Kimaris Trooper (Trooper Mode)",
  type: "unit",
  color: "white",
  traits: ["gjallarhorn", "gundam frame"],
  id: "GD03-080",
  externalId: "gundam:gd03-080",
  slug: "gundam-kimaris-trooper-trooper-mode-gd03-080",
  displayName: "Gundam Kimaris Trooper (Trooper Mode)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-080",
  printings: [
    {
      id: "GD03-080",
      collectorNumber: "GD03-080",
      cardNumber: "GD03-080",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-080.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-080.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-080",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-080.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-080.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Gaelio Bauduin]",
  effect:
    "【When Linked】Choose 1 (Gjallarhorn) Command card from your trash. Add it to your hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "command",
              zone: "trash",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "gjallarhorn" },
              ],
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 (Gjallarhorn) Command card from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
