import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03Nyaan092: PilotCard = {
  cardNumber: "GD03-092",
  name: "Nyaan",
  type: "pilot",
  color: "red",
  traits: ["zeon", "newtype"],
  id: "GD03-092",
  externalId: "gundam:gd03-092",
  slug: "nyaan-gd03-092",
  displayName: "Nyaan",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-092",
  printings: [
    {
      id: "GD03-092",
      collectorNumber: "GD03-092",
      cardNumber: "GD03-092",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-092.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-092.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-092_p1",
      collectorNumber: "GD03-092_p1",
      cardNumber: "GD03-092",
      set: {
        code: "GD03",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-092_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-092_p1.webp?260424",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "GD03-092_p2",
      collectorNumber: "GD03-092_p2",
      cardNumber: "GD03-092",
      set: {
        code: "GD03",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-092_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-092_p2.webp?260424",
      productName: "Store Tournament Winner Pack 03",
    },
  ],
  selectedPrintingId: "GD03-092",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-092.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-092.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Place the top card of your deck into your trash. If you placed a (Zeon)/(Clan) card with this effect, choose 1 enemy Unit. Deal 1 damage to it.",
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
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "millDeckThenDamageIfTrait",
            count: 1,
            owner: "self",
            traits: ["zeon", "clan"],
            damage: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Place the top card of your deck into your trash. If you placed a (Zeon)/(Clan) card with this effect, choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
