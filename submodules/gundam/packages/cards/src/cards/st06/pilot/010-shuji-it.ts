import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st06ShujiIt010: PilotCard = {
  cardNumber: "ST06-010",
  name: "Shuji Itō",
  type: "pilot",
  color: "green",
  traits: ["clan", "newtype"],
  id: "ST06-010",
  externalId: "gundam:st06-010",
  slug: "shuji-it-st06-010",
  displayName: "Shuji Itō",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-010",
  printings: [
    {
      id: "ST06-010",
      collectorNumber: "ST06-010",
      cardNumber: "ST06-010",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-010.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-010_p1",
      collectorNumber: "ST06-010_p1",
      cardNumber: "ST06-010",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-010_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
    {
      id: "ST06-010_p2",
      collectorNumber: "ST06-010_p2",
      cardNumber: "ST06-010",
      set: {
        code: "ST06",
        name: "Store Tournament Participant Pack 02",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-010_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-010_p2.webp?260424",
      productName: "Store Tournament Participant Pack 02",
    },
    {
      id: "ST06-010_p3",
      collectorNumber: "ST06-010_p3",
      cardNumber: "ST06-010",
      set: {
        code: "ST06",
        name: "Store Tournament Winner Pack 02",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-010_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-010_p3.webp?260424",
      productName: "Store Tournament Winner Pack 02",
    },
  ],
  selectedPrintingId: "ST06-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-010.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】【Attack】If you have a (Clan) Unit in play, look at the top card of your deck. Return it to the top or bottom of your deck.<br>",
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
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "clan",
          },
          thenDirectives: [
            {
              action: {
                action: "lookAtTopDeck",
                count: 1,
                return: "chooseTop",
              },
            },
          ],
        },
      ],
      sourceText:
        "【During Link】【Attack】If you have a (Clan) Unit in play, look at the top card of your deck. Return it to the top or bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
