import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04HallelujahHaptism090: PilotCard = {
  cardNumber: "GD04-090",
  name: "Hallelujah Haptism",
  type: "pilot",
  color: "red",
  traits: ["cb", "super soldier"],
  id: "GD04-090",
  externalId: "gundam:gd04-090",
  slug: "hallelujah-haptism-gd04-090",
  displayName: "Hallelujah Haptism",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-090",
  printings: [
    {
      id: "GD04-090",
      collectorNumber: "GD04-090",
      cardNumber: "GD04-090",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-090.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-090.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-090",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-090.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-090.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top card of your deck. If it is a (CB) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
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
        timing: ["onDestroyByBattle"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "duringLink" }, { type: "isTurn", whose: "friendly" }],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top card of your deck. If it is a (CB) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
