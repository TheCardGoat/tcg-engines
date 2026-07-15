import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03BaundDoc015: UnitCard = {
  cardNumber: "GD03-015",
  name: "Baund Doc",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD03-015",
  canonicalId: "GD03-015",
  externalIds: { bandai: "gundam:gd03-015" },
  slug: "baund-doc/gd03-015",
  displayName: "Baund Doc",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-015",
  printings: [
    {
      id: "GD03-015",
      artId: "GD03-015",
      setCode: "GD03",
      collectorNumber: "GD03-015",
      cardNumber: "GD03-015",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-015.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  reprints: ["GD03-015"],
  selectedPrintingId: "GD03-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-015.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Jerid Messa]",
  effect:
    "【Activate･Main】【Once per Turn】Exile 3 (Titans) cards from your trash: This Unit gains <Breach 4> during this turn.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        exileFromTrash: {
          owner: "friendly",
          zone: "trash",
          count: 3,
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: "titans",
            },
          ],
        },
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 4,
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Exile 3 (Titans) cards from your trash: This Unit gains <Breach 4> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
