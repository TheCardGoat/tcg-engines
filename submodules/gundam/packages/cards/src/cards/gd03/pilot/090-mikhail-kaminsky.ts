import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03MikhailKaminsky090: PilotCard = {
  cardNumber: "GD03-090",
  name: "Mikhail Kaminsky",
  type: "pilot",
  color: "green",
  traits: ["zeon", "cyclops team"],
  id: "GD03-090",
  externalId: "gundam:gd03-090",
  slug: "mikhail-kaminsky-gd03-090",
  displayName: "Mikhail Kaminsky",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-090",
  printings: [
    {
      id: "GD03-090",
      collectorNumber: "GD03-090",
      cardNumber: "GD03-090",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-090.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-090.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-090",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-090.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-090.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】Choose 1 of your (Cyclops Team) Units. It gains <Breach 1> during this turn.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
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
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "cyclops team",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】Choose 1 of your (Cyclops Team) Units. It gains <Breach 1> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
