import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03FreedomGundamMeteor076: UnitCard = {
  cardNumber: "GD03-076",
  name: "Freedom Gundam (METEOR)",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD03-076",
  externalId: "gundam:gd03-076",
  slug: "freedom-gundam-meteor-gd03-076",
  displayName: "Freedom Gundam (METEOR)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-076",
  printings: [
    {
      id: "GD03-076",
      collectorNumber: "GD03-076",
      cardNumber: "GD03-076",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-076.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-076.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-076_p1",
      collectorNumber: "GD03-076_p1",
      cardNumber: "GD03-076",
      set: {
        code: "GD03",
        name: "Boost Kit 01",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-076_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-076_p1.webp?260424",
      productName: "Boost Kit 01",
    },
  ],
  selectedPrintingId: "GD03-076",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-076.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-076.webp?260424",
  legality: "legal",
  level: 8,
  cost: 6,
  ap: 6,
  hp: 6,
  linkCondition: "[Kira Yamato]",
  effect:
    "【Once per Turn】During your turn, when your (Triple Ship Alliance) Unit deals battle damage to an enemy Unit, you may return the enemy Unit to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onBattleDamageReceived"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "eventPlayerIsOpponent" },
          {
            type: "eventSourceMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "triple ship alliance",
                },
              ],
            },
          },
          {
            type: "eventCardMatches",
            target: {
              owner: "opponent",
              cardType: "unit",
            },
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "returnEventCardToHand",
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when your (Triple Ship Alliance) Unit deals battle damage to an enemy Unit, you may return the enemy Unit to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
