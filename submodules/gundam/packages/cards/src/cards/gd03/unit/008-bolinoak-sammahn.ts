import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03BolinoakSammahn008: UnitCard = {
  cardNumber: "GD03-008",
  name: "Bolinoak Sammahn",
  type: "unit",
  color: "blue",
  traits: ["titans", "jupitris"],
  id: "GD03-008",
  externalId: "gundam:gd03-008",
  slug: "bolinoak-sammahn-gd03-008",
  displayName: "Bolinoak Sammahn",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-008",
  printings: [
    {
      id: "GD03-008",
      collectorNumber: "GD03-008",
      cardNumber: "GD03-008",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-008.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-008.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-008",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-008.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-008.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "(Jupitris) Trait",
  effect:
    "【During Pair】This Unit gains <Repair 2>.\n\r\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Pair】This Unit gains <Repair 2>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
