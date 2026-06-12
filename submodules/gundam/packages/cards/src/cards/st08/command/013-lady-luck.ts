import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st08LadyLuck013: CommandCard = {
  cardNumber: "ST08-013",
  name: "Lady Luck",
  type: "command",
  color: "red",
  traits: [],
  id: "ST08-013",
  externalId: "gundam:st08-013",
  slug: "lady-luck-st08-013",
  displayName: "Lady Luck",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-013",
  printings: [
    {
      id: "ST08-013",
      collectorNumber: "ST08-013",
      cardNumber: "ST08-013",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-013.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-013_p1",
      collectorNumber: "ST08-013_p1",
      cardNumber: "ST08-013",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-013_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-013_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-013",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-013.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-013.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  effect:
    "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it. If a friendly (Mafty) Link Unit is in play, deal 2 damage instead.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "mafty",
            isLinkUnit: true,
          },
          thenDirectives: [
            {
              action: {
                action: "dealDamage",
                amount: 2,
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: 1,
                },
              },
            },
          ],
          elseDirectives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: 1,
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it. If a friendly (Mafty) Link Unit is in play, deal 2 damage instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
