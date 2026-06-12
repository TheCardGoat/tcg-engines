import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st08Penelope006: UnitCard = {
  cardNumber: "ST08-006",
  name: "Penelope",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "ST08-006",
  externalId: "gundam:st08-006",
  slug: "penelope-st08-006",
  displayName: "Penelope",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-006",
  printings: [
    {
      id: "ST08-006",
      collectorNumber: "ST08-006",
      cardNumber: "ST08-006",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-006.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-006_p1",
      collectorNumber: "ST08-006_p1",
      cardNumber: "ST08-006",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-006_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-006.webp?260424",
  legality: "legal",
  level: 7,
  cost: 6,
  ap: 5,
  hp: 5,
  linkCondition: "[Lane Aim]",
  effect:
    "【During Pair】【Attack】【Once per Turn】If this Unit is attacking the enemy player, reveal 1 (Earth Federation) Unit card from your hand. Return it to the bottom of your deck. If you do, draw 2.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          condition: {
            type: "isAttackingPlayer",
          },
          thenDirectives: [
            {
              action: {
                action: "returnToDeck",
                position: "bottom",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  zone: "hand",
                  count: 1,
                  attributeFilters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "earth federation",
                    },
                  ],
                },
              },
            },
            {
              action: {
                action: "draw",
                count: 2,
              },
              dependsOnPrevious: true,
            },
          ],
        },
      ],
      sourceText:
        "【During Pair】【Attack】【Once per Turn】If this Unit is attacking the enemy player, reveal 1 (Earth Federation) Unit card from your hand. Return it to the bottom of your deck. If you do, draw 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
