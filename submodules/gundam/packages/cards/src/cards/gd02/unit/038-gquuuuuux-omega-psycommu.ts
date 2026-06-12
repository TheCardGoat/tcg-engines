import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GquuuuuuxOmegaPsycommu038: UnitCard = {
  cardNumber: "GD02-038",
  name: "GQuuuuuuX (Omega Psycommu)",
  type: "unit",
  color: "red",
  traits: ["clan"],
  id: "GD02-038",
  externalId: "gundam:gd02-038",
  slug: "gquuuuuux-omega-psycommu-gd02-038",
  displayName: "GQuuuuuuX (Omega Psycommu)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-038",
  printings: [
    {
      id: "GD02-038",
      collectorNumber: "GD02-038",
      cardNumber: "GD02-038",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-038.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-038.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-038_p1",
      collectorNumber: "GD02-038_p1",
      cardNumber: "GD02-038",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-038_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-038_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-038_p2",
      collectorNumber: "GD02-038_p2",
      cardNumber: "GD02-038",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-038_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-038_p2.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-038",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-038.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-038.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Amate Yuzuriha (Machu)]",
  effect:
    "【Deploy】Look at the top 3 cards of your deck. You may deploy 1 (Clan) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
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
            tutorDestination: "battleArea",
            tutorFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "clan" },
                { attribute: "level", comparison: "lte", value: 4 },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top 3 cards of your deck. You may deploy 1 (Clan) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
