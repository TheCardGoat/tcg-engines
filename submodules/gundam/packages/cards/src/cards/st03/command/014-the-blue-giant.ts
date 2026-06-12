import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st03TheBlueGiant014: CommandCard = {
  cardNumber: "ST03-014",
  name: "The Blue Giant",
  type: "command",
  color: "green",
  traits: ["zeon"],
  id: "ST03-014",
  externalId: "gundam:st03-014",
  slug: "the-blue-giant-st03-014",
  displayName: "The Blue Giant",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-014",
  printings: [
    {
      id: "ST03-014",
      collectorNumber: "ST03-014",
      cardNumber: "ST03-014",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-014.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-014_p1",
      collectorNumber: "ST03-014_p1",
      cardNumber: "ST03-014",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-014_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-014_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST03-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-014.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Ramba Ral",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle.<br>【Pilot】[Ramba Ral]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle. 【Pilot】[Ramba Ral]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
