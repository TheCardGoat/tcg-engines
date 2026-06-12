import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03HyGogg024: UnitCard = {
  cardNumber: "GD03-024",
  name: "Hy-Gogg",
  type: "unit",
  color: "green",
  traits: ["zeon", "cyclops team"],
  id: "GD03-024",
  externalId: "gundam:gd03-024",
  slug: "hy-gogg-gd03-024",
  displayName: "Hy-Gogg",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-024",
  printings: [
    {
      id: "GD03-024",
      collectorNumber: "GD03-024",
      cardNumber: "GD03-024",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-024.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-024.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-024",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-024.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-024.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  linkCondition: "(Cyclops Team) Trait",
  effect:
    "【When Linked】If you have another (Cyclops Team) Unit in play, deploy 1 rested [Hy-Gogg]((Cyclops Team)･AP2･HP1) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "cyclops team",
          },
          thenDirectives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Hy-Gogg",
                  traits: ["cyclops team"],
                  ap: 2,
                  hp: 1,
                  deployState: "rested",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【When Linked】If you have another (Cyclops Team) Unit in play, deploy 1 rested [Hy-Gogg]((Cyclops Team)·AP2·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
