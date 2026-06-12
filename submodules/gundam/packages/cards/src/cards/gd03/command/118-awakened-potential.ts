import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03AwakenedPotential118: CommandCard = {
  cardNumber: "GD03-118",
  name: "Awakened Potential",
  type: "command",
  color: "white",
  traits: [],
  id: "GD03-118",
  externalId: "gundam:gd03-118",
  slug: "awakened-potential-gd03-118",
  displayName: "Awakened Potential",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-118",
  printings: [
    {
      id: "GD03-118",
      collectorNumber: "GD03-118",
      cardNumber: "GD03-118",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-118.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-118.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-118_p1",
      collectorNumber: "GD03-118_p1",
      cardNumber: "GD03-118",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-118_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-118_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-118_p2",
      collectorNumber: "GD03-118_p2",
      cardNumber: "GD03-118",
      set: {
        code: "GD03",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-118_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-118_p2.webp?260424",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "GD03-118_p3",
      collectorNumber: "GD03-118_p3",
      cardNumber: "GD03-118",
      set: {
        code: "GD03",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-118_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-118_p3.webp?260424",
      productName: "Store Tournament Winner Pack 03",
    },
    {
      id: "GD03-118_p4",
      collectorNumber: "GD03-118_p4",
      cardNumber: "GD03-118",
      set: {
        code: "GD03",
        name: "Newtype Challenge 2026 Mission 1",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-118_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-118_p4.webp?260424",
      productName: "Newtype Challenge 2026 Mission 1",
    },
  ],
  selectedPrintingId: "GD03-118",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-118.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-118.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    '【Burst】Add this card to your hand.\n【Action】Choose 1 rested enemy Unit that is Lv.4 or lower. Return it to its owner\'s hand. Then, if there are 2 or more cards with "Awakened Potential" in their card name in your trash, you may choose 1 friendly Unit. It gains <Blocker> during this turn.\n\r\n(Rest this Unit to change the attack target to it.)',
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
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: 2,
            hasName: "Awakened Potential",
          },
          thenDirectives: [
            {
              action: {
                action: "grantKeyword",
                keyword: "Blocker",
                duration: "thisTurn",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  count: 1,
                },
              },
              optional: true,
            },
          ],
        },
      ],
      sourceText:
        '【Action】Choose 1 rested enemy Unit that is Lv.4 or lower. Return it to its owner\'s hand. Then, if there are 2 or more cards with "Awakened Potential" in their card name in your trash, you may choose 1 friendly Unit. It gains <Blocker> during this turn. (Rest this Unit to change the attack target to it.)',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
