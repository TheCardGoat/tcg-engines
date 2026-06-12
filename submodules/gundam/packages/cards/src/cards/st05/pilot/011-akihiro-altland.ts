import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st05AkihiroAltland011: PilotCard = {
  cardNumber: "ST05-011",
  name: "Akihiro Altland",
  type: "pilot",
  color: "purple",
  traits: ["tekkadan", "alaya-vijnana"],
  id: "ST05-011",
  externalId: "gundam:st05-011",
  slug: "akihiro-altland-st05-011",
  displayName: "Akihiro Altland",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-011",
  printings: [
    {
      id: "ST05-011",
      collectorNumber: "ST05-011",
      cardNumber: "ST05-011",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-011.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-011_p1",
      collectorNumber: "ST05-011_p1",
      cardNumber: "ST05-011",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-011_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST05-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-011.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.<br>",
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
        timing: ["onDestroyByBattle"],
        conditions: [
          { type: "duringLink" },
          { type: "isTurn", whose: "friendly" },
          { type: "eventCardIsSelf" },
        ],
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
                { attribute: "trait", comparison: "includes", value: "tekkadan" },
                { attribute: "level", comparison: "lte", value: 2 },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
