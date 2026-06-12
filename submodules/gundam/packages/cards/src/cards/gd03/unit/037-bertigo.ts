import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Bertigo037: UnitCard = {
  cardNumber: "GD03-037",
  name: "Bertigo",
  type: "unit",
  color: "red",
  traits: ["sra"],
  id: "GD03-037",
  externalId: "gundam:gd03-037",
  slug: "bertigo-gd03-037",
  displayName: "Bertigo",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-037",
  printings: [
    {
      id: "GD03-037",
      collectorNumber: "GD03-037",
      cardNumber: "GD03-037",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-037.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-037.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-037_p1",
      collectorNumber: "GD03-037_p1",
      cardNumber: "GD03-037",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-037_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-037_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-037",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-037.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-037.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(Newtype) Trait",
  effect:
    "【During Link】During your turn, while this Unit is battling an enemy Unit with a 【Destroyed】 effect, it gains <First Strike>.\n\r\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }, { type: "isTurn", whose: "friendly" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
              isBattling: {
                opponentMatches: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [
                    { attribute: "effectTiming", comparison: "includes", value: "destroyed" },
                  ],
                },
              },
            },
          },
        },
      ],
      sourceText:
        "【During Link】During your turn, while this Unit is battling an enemy Unit with a 【Destroyed】 effect, it gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
