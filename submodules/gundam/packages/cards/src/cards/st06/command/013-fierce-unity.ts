import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st06FierceUnity013: CommandCard = {
  cardNumber: "ST06-013",
  name: "Fierce Unity",
  type: "command",
  color: "green",
  traits: ["clan"],
  id: "ST06-013",
  externalId: "gundam:st06-013",
  slug: "fierce-unity-st06-013",
  displayName: "Fierce Unity",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-013",
  printings: [
    {
      id: "ST06-013",
      collectorNumber: "ST06-013",
      cardNumber: "ST06-013",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-013.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-013_p1",
      collectorNumber: "ST06-013_p1",
      cardNumber: "ST06-013",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-013_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-013_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST06-013",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-013.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-013.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Ortega (GQ)",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】Choose 1 to 2 friendly (Clan) Units. They can't receive battle damage from enemy Units that are Lv.2 or lower during this turn.<br>【Pilot】[Ortega (GQ)]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: { min: 1, max: 2 },
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "Clan" }],
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 to 2 friendly (Clan) Units. They can't receive battle damage from enemy Units that are Lv.2 or lower during this turn. 【Pilot】[Ortega (GQ)]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
