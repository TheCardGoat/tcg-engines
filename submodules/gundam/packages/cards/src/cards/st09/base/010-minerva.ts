import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st09Minerva010: BaseCard = {
  cardNumber: "ST09-010",
  name: "Minerva",
  type: "base",
  traits: ["zaft", "minerva squad", "warship"],
  id: "ST09-010",
  externalId: "gundam:st09-010",
  slug: "minerva-st09-010",
  displayName: "Minerva",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-010",
  printings: [
    {
      id: "ST09-010",
      collectorNumber: "ST09-010",
      cardNumber: "ST09-010",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-010.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-010_p1",
      collectorNumber: "ST09-010_p1",
      cardNumber: "ST09-010",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-010_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST09-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-010.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
        {
          condition: {
            type: "isTurn",
            whose: "friendly",
          },
          thenDirectives: [
            {
              action: {
                action: "lookAtTopDeck",
                count: 2,
                return: "chooseTop",
                remainingDestination: "trash",
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
