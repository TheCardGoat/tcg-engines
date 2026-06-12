import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04UnicornGundam02BansheeNornUnicornMode072: UnitCard = {
  cardNumber: "GD04-072",
  name: "Unicorn Gundam 02 Banshee Norn (Unicorn Mode)",
  type: "unit",
  color: "white",
  traits: ["earth federation"],
  id: "GD04-072",
  externalId: "gundam:gd04-072",
  slug: "unicorn-gundam-02-banshee-norn-unicorn-mode-gd04-072",
  displayName: "Unicorn Gundam 02 Banshee Norn (Unicorn Mode)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-072",
  printings: [
    {
      id: "GD04-072",
      collectorNumber: "GD04-072",
      cardNumber: "GD04-072",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-072.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-072.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-072",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-072.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-072.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 5,
  hp: 3,
  linkCondition: "[Riddhe Marcenas]",
  effect: "【When Linked】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
