import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st07AllelujahHaptism012: PilotCard = {
  cardNumber: "ST07-012",
  name: "Allelujah Haptism",
  type: "pilot",
  color: "green",
  traits: ["cb", "super soldier"],
  id: "ST07-012",
  externalId: "gundam:st07-012",
  slug: "allelujah-haptism-st07-012",
  displayName: "Allelujah Haptism",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-012",
  printings: [
    {
      id: "ST07-012",
      collectorNumber: "ST07-012",
      cardNumber: "ST07-012",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-012.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-012_p1",
      collectorNumber: "ST07-012_p1",
      cardNumber: "ST07-012",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-012_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST07-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-012.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nDuring your turn, while you have a (CB) Link Unit in play, this Unit can't receive battle damage from enemy Units with 3 or less AP.",
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
      type: "constant",
      activation: {
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "cb",
            isLinkUnit: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "self",
            },
            unitFilter: {
              owner: "opponent",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            damageType: "battle",
          },
        },
      ],
      sourceText:
        "During your turn, while you have a (CB) Link Unit in play, this Unit can't receive battle damage from enemy Units with 3 or less AP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
