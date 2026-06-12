import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st03CharSZaku006: UnitCard = {
  cardNumber: "ST03-006",
  name: "Char's Zaku Ⅱ",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "ST03-006",
  externalId: "gundam:st03-006",
  slug: "char-s-zaku-st03-006",
  displayName: "Char's Zaku Ⅱ",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-006",
  printings: [
    {
      id: "ST03-006",
      collectorNumber: "ST03-006",
      cardNumber: "ST03-006",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-006.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-006_p1",
      collectorNumber: "ST03-006_p1",
      cardNumber: "ST03-006",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-006_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
    {
      id: "ST03-006_p2",
      collectorNumber: "ST03-006_p2",
      cardNumber: "ST03-006",
      set: {
        code: "ST03",
        name: "WORLD CHAMPIONSHIPS 25-26 GRAND FINAL Participation Prize",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-006_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-006_p2.webp?260424",
      productName: "WORLD CHAMPIONSHIPS 25-26 GRAND FINAL Participation Prize",
    },
  ],
  selectedPrintingId: "ST03-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-006.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  linkCondition: "[Char Aznable]",
  effect:
    "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "zeon" },
                    { attribute: "trait", comparison: "includes", value: "neo zeon" },
                  ],
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
