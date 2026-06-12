import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03SarahZabiarov087: PilotCard = {
  cardNumber: "GD03-087",
  name: "Sarah Zabiarov",
  type: "pilot",
  color: "blue",
  traits: ["titans", "jupitris", "newtype"],
  id: "GD03-087",
  externalId: "gundam:gd03-087",
  slug: "sarah-zabiarov-gd03-087",
  displayName: "Sarah Zabiarov",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-087",
  printings: [
    {
      id: "GD03-087",
      collectorNumber: "GD03-087",
      cardNumber: "GD03-087",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-087.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-087.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-087_p1",
      collectorNumber: "GD03-087_p1",
      cardNumber: "GD03-087",
      set: {
        code: "GD03",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-087_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-087_p1.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "GD03-087_p2",
      collectorNumber: "GD03-087_p2",
      cardNumber: "GD03-087",
      set: {
        code: "GD03",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-087_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-087_p2.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "GD03-087",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-087.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-087.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Linked】Choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
