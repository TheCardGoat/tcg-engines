import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st03FullFrontal010: PilotCard = {
  cardNumber: "ST03-010",
  name: "Full Frontal",
  type: "pilot",
  color: "red",
  traits: ["neo zeon", "cyber-newtype"],
  id: "ST03-010",
  externalId: "gundam:st03-010",
  slug: "full-frontal-st03-010",
  displayName: "Full Frontal",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-010",
  printings: [
    {
      id: "ST03-010",
      collectorNumber: "ST03-010",
      cardNumber: "ST03-010",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-010.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-010_p1",
      collectorNumber: "ST03-010_p1",
      cardNumber: "ST03-010",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-010_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST03-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-010.webp?260424",
  legality: "legal",
  level: 6,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.<br>",
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
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "hand",
              count: 1,
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "neo zeon" },
                    { attribute: "trait", comparison: "includes", value: "zeon" },
                  ],
                },
                { attribute: "level", comparison: "lte", value: 4 },
              ],
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【When Paired】You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
