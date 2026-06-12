import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03BernardWiseman089: PilotCard = {
  cardNumber: "GD03-089",
  name: "Bernard Wiseman",
  type: "pilot",
  color: "green",
  traits: ["zeon", "cyclops team"],
  id: "GD03-089",
  externalId: "gundam:gd03-089",
  slug: "bernard-wiseman-gd03-089",
  displayName: "Bernard Wiseman",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-089",
  printings: [
    {
      id: "GD03-089",
      collectorNumber: "GD03-089",
      cardNumber: "GD03-089",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-089.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-089.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-089_p1",
      collectorNumber: "GD03-089_p1",
      cardNumber: "GD03-089",
      set: {
        code: "GD03",
        name: "Booster Pack Steel Requiem [GD03] Release Event",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-089_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-089_p1.webp?260424",
      productName: "Booster Pack Steel Requiem [GD03] Release Event",
    },
  ],
  selectedPrintingId: "GD03-089",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-089.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-089.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nIncrease this Unit's AP by an amount equal to the number of (Cyclops Team) Pilot cards/Command cards with unique names in your trash.",
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
      activation: {},
      directives: [
        {
          action: {
            action: "statModifierByUniqueNameCount",
            countFilter: {
              owner: "friendly",
              zone: "trash",
              cardType: ["pilot", "command"],
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "cyclops team" },
              ],
            },
            stat: "ap",
            amountPerUniqueName: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "Increase this Unit's AP by an amount equal to the number of (Cyclops Team) Pilot cards/Command cards with unique names in your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
