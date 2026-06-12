import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st06SchoolgirlAndSmuggler012: CommandCard = {
  cardNumber: "ST06-012",
  name: "Schoolgirl and Smuggler",
  type: "command",
  color: "green",
  traits: ["-"],
  id: "ST06-012",
  externalId: "gundam:st06-012",
  slug: "schoolgirl-and-smuggler-st06-012",
  displayName: "Schoolgirl and Smuggler",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-012",
  printings: [
    {
      id: "ST06-012",
      collectorNumber: "ST06-012",
      cardNumber: "ST06-012",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-012.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-012_p1",
      collectorNumber: "ST06-012_p1",
      cardNumber: "ST06-012",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-012_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST06-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-012.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  effect:
    "【Main】Look at the top 3 cards of your deck. You may reveal 1 (Clan) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.<br>",
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
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Look at the top 3 cards of your deck. You may reveal 1 (Clan) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
