import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st06AmateYuzurihaMachu009: PilotCard = {
  cardNumber: "ST06-009",
  name: "Amate Yuzuriha (Machu)",
  type: "pilot",
  color: "red",
  traits: ["clan", "newtype"],
  id: "ST06-009",
  externalId: "gundam:st06-009",
  slug: "amate-yuzuriha-machu-st06-009",
  displayName: "Amate Yuzuriha (Machu)",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-009",
  printings: [
    {
      id: "ST06-009",
      collectorNumber: "ST06-009",
      cardNumber: "ST06-009",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-009.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-009_p1",
      collectorNumber: "ST06-009_p1",
      cardNumber: "ST06-009",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-009_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
    {
      id: "ST06-009_p2",
      collectorNumber: "ST06-009_p2",
      cardNumber: "ST06-009",
      set: {
        code: "ST06",
        name: "Starter Release Event",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-009_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-009_p2.webp?260424",
      productName: "Starter Release Event",
    },
    {
      id: "ST06-009_p3",
      collectorNumber: "ST06-009_p3",
      cardNumber: "ST06-009",
      set: {
        code: "ST06",
        name: "Store Championships 26-27 Season 1",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-009_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-009_p3.webp?260424",
      productName: "Store Championships 26-27 Season 1",
    },
    {
      id: "ST06-009_p4",
      collectorNumber: "ST06-009_p4",
      cardNumber: "ST06-009",
      set: {
        code: "ST06",
        name: "WORLD CHAMPIONSHIPS 26-27 Season 1Upper Ranks Prize",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-009_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-009_p4.webp?260424",
      productName: "WORLD CHAMPIONSHIPS 26-27 Season 1Upper Ranks Prize",
    },
  ],
  selectedPrintingId: "ST06-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-009.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Linked】Look at the top card of your deck. If it is a (Clan) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.<br>",
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
            action: "lookAtTopDeck",
            count: 1,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "Clan" }],
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Look at the top card of your deck. If it is a (Clan) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
