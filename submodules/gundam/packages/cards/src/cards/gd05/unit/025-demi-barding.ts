import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05DemiBarding025: UnitCard = {
  cardNumber: "GD05-025",
  name: "Demi Barding",
  type: "unit",
  color: "green",
  traits: ["academy"],
  id: "GD05-025",
  canonicalId: "GD05-025",
  externalIds: { bandai: "gundam:gd05-025" },
  slug: "demi-barding-gd05-025",
  displayName: "Demi Barding",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-025",
  printings: [
    {
      id: "GD05-025",
      artId: "GD05-025",
      setCode: "GD05",
      collectorNumber: "GD05-025",
      cardNumber: "GD05-025",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-025.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-025.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-025_p1",
      artId: "GD05-025_p1",
      setCode: "GD05",
      collectorNumber: "GD05-025_p1",
      cardNumber: "GD05-025",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-025_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-025_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-025", "GD05-025_p1"],
  selectedPrintingId: "GD05-025",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-025.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-025.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 2,
  linkCondition: "[Chuatury Panlunch]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 Command card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            randomizeRemainingToBottom: true,
            tutorFilter: {
              owner: "friendly",
              count: 1,
              cardType: "command",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 Command card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
