import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st08WordsForHathaway012: CommandCard = {
  cardNumber: "ST08-012",
  name: "Words for Hathaway",
  type: "command",
  color: "red",
  traits: ["mafty"],
  id: "ST08-012",
  externalId: "gundam:st08-012",
  slug: "words-for-hathaway-st08-012",
  displayName: "Words for Hathaway",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-012",
  printings: [
    {
      id: "ST08-012",
      collectorNumber: "ST08-012",
      cardNumber: "ST08-012",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-012.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-012_p1",
      collectorNumber: "ST08-012_p1",
      cardNumber: "ST08-012",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-012_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-012.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Gawman Nobile",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】Choose 1 friendly Link Unit. It gains <Breach 1> during this turn.\n\r\n(When this Unit' s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent' s shield area.)\n【Pilot】[Gawman Nobile]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              isLinkUnit: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 friendly Link Unit. It gains <Breach 1> during this turn. (When this Unit' s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent' s shield area.) 【Pilot】[Gawman Nobile]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
