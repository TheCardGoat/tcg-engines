import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st08HathawayNoa010: PilotCard = {
  cardNumber: "ST08-010",
  name: "Hathaway Noa",
  type: "pilot",
  color: "red",
  traits: ["mafty", "newtype"],
  id: "ST08-010",
  externalId: "gundam:st08-010",
  slug: "hathaway-noa-st08-010",
  displayName: "Hathaway Noa",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-010",
  printings: [
    {
      id: "ST08-010",
      collectorNumber: "ST08-010",
      cardNumber: "ST08-010",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-010.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-010_p1",
      collectorNumber: "ST08-010_p1",
      cardNumber: "ST08-010",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-010_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
    {
      id: "ST08-010_p2",
      collectorNumber: "ST08-010_p2",
      cardNumber: "ST08-010",
      set: {
        code: "ST07",
        name: "Starter Deck [ST07]/[ST08] Release Event",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-010_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-010_p2.webp?260424",
      productName: "Starter Deck [ST07]/[ST08] Release Event",
    },
  ],
  selectedPrintingId: "ST08-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-010.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】If this is a (Mafty) Unit, choose 1 of your (Mafty) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.",
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
        conditions: [{ type: "linkedUnitHasTrait", trait: "mafty" }],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "mafty" }],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: ["damaged", "active"],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【When Paired】If this is a (Mafty) Unit, choose 1 of your (Mafty) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const st07HathawayNoa010 = st08HathawayNoa010;
