import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02GarrodRanTiffaAdill094: PilotCard = {
  cardNumber: "GD02-094",
  name: "Garrod Ran & Tiffa Adill",
  type: "pilot",
  color: "purple",
  traits: ["vulture", "newtype"],
  id: "GD02-094",
  externalId: "gundam:gd02-094",
  slug: "garrod-ran-tiffa-adill-gd02-094",
  displayName: "Garrod Ran & Tiffa Adill",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-094",
  printings: [
    {
      id: "GD02-094",
      collectorNumber: "GD02-094",
      cardNumber: "GD02-094",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-094.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-094.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-094_p1",
      collectorNumber: "GD02-094_p1",
      cardNumber: "GD02-094",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-094_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-094_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-094",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-094.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-094.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】You may discard 1. If you do, look at the top 3 cards of your deck. You may reveal 1 (Vulture) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.<br>",
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
        timing: ["whenPaired"],
      },
      // "You may discard 1. If you do, look at the top 3…" — `discard` is
      // optional; the look-at-top-deck tutor is chained via
      // `dependsOnPrevious` so it only fires when the controller opted
      // into the discard. The tutor uses `tutorFilter` on (vulture) Unit
      // cards; `lookAtTopDeck`'s deterministic minimal executor will
      // reveal the first matching card and add it to hand, returning the
      // remainder to the bottom of deck (rule-conformant approximation
      // of "reveal 1 among them" pending a full player-choice prompt).
      directives: [
        {
          action: {
            action: "discard",
            count: 1,
          },
          optional: true,
        },
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "vulture" }],
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【When Paired】You may discard 1. If you do, look at the top 3 cards of your deck. You may reveal 1 (Vulture) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
