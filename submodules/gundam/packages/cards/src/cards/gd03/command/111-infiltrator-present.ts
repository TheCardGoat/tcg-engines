import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03InfiltratorPresent111: CommandCard = {
  cardNumber: "GD03-111",
  name: "Infiltrator Present",
  type: "command",
  color: "red",
  traits: ["mafty"],
  id: "GD03-111",
  externalId: "gundam:gd03-111",
  slug: "infiltrator-present-gd03-111",
  displayName: "Infiltrator Present",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-111",
  printings: [
    {
      id: "GD03-111",
      collectorNumber: "GD03-111",
      cardNumber: "GD03-111",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-111.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-111.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-111",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-111.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-111.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Emeralda Zubin",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly (Mafty) Unit. It gets AP+3 during this turn.\n【Pilot】[Emeralda Zubin]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "mafty",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly (Mafty) Unit. It gets AP+3 during this turn. 【Pilot】[Emeralda Zubin]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
