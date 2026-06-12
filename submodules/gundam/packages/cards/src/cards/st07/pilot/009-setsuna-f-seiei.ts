import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st07SetsunaFSeiei009: PilotCard = {
  cardNumber: "ST07-009",
  name: "Setsuna F. Seiei",
  type: "pilot",
  color: "purple",
  traits: ["cb"],
  id: "ST07-009",
  externalId: "gundam:st07-009",
  slug: "setsuna-f-seiei-st07-009",
  displayName: "Setsuna F. Seiei",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-009",
  printings: [
    {
      id: "ST07-009",
      collectorNumber: "ST07-009",
      cardNumber: "ST07-009",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-009.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-009_p1",
      collectorNumber: "ST07-009_p1",
      cardNumber: "ST07-009",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-009_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
    {
      id: "ST07-009_p2",
      collectorNumber: "ST07-009_p2",
      cardNumber: "ST07-009",
      set: {
        code: "ST07",
        name: "Starter Deck [ST07]/[ST08] Release Event",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-009_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-009_p2.webp?260424",
      productName: "Starter Deck [ST07]/[ST08] Release Event",
    },
  ],
  selectedPrintingId: "ST07-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-009.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】This Unit gets AP+1 during this turn. If there are 7 or more (CB) cards in your trash, all your (CB) Units get AP+1 instead.",
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
        timing: ["attack"],
      },
      directives: [
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
            hasTrait: "cb",
          },
          thenDirectives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 1,
                duration: "thisTurn",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "cb",
                    },
                  ],
                },
              },
            },
          ],
          elseDirectives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 1,
                duration: "thisTurn",
                target: {
                  owner: "self",
                  cardType: "unit",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Attack】This Unit gets AP+1 during this turn. If there are 7 or more (CB) cards in your trash, all your (CB) Units get AP+1 instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
