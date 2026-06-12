import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st07TacticalVisionary014: CommandCard = {
  cardNumber: "ST07-014",
  name: "Tactical Visionary",
  type: "command",
  color: "green",
  traits: [],
  id: "ST07-014",
  externalId: "gundam:st07-014",
  slug: "tactical-visionary-st07-014",
  displayName: "Tactical Visionary",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-014",
  printings: [
    {
      id: "ST07-014",
      collectorNumber: "ST07-014",
      cardNumber: "ST07-014",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-014.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-014_p1",
      collectorNumber: "ST07-014_p1",
      cardNumber: "ST07-014",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-014_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-014_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
    {
      id: "ST07-014_p2",
      collectorNumber: "ST07-014_p2",
      cardNumber: "ST07-014",
      set: {
        code: "ST07",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-014_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-014_p2.webp?260424",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "ST07-014_p3",
      collectorNumber: "ST07-014_p3",
      cardNumber: "ST07-014",
      set: {
        code: "ST07",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-014_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-014_p3.webp?260424",
      productName: "Store Tournament Winner Pack 03",
    },
  ],
  selectedPrintingId: "ST07-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-014.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  effect:
    "【Main】Look at the top 3 cards of your deck. You may reveal 1 (CB) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: ["unit", "pilot"],
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Look at the top 3 cards of your deck. You may reveal 1 (CB) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
