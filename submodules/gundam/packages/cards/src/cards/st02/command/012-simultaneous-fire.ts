import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st02SimultaneousFire012: CommandCard = {
  cardNumber: "ST02-012",
  name: "Simultaneous Fire",
  type: "command",
  color: "green",
  traits: ["operation meteor"],
  id: "ST02-012",
  externalId: "gundam:st02-012",
  slug: "simultaneous-fire-st02-012",
  displayName: "Simultaneous Fire",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-012",
  printings: [
    {
      id: "ST02-012",
      collectorNumber: "ST02-012",
      cardNumber: "ST02-012",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-012.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-012_p1",
      collectorNumber: "ST02-012_p1",
      cardNumber: "ST02-012",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-012_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
    {
      id: "ST02-012_p2",
      collectorNumber: "ST02-012_p2",
      cardNumber: "ST02-012",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST02-012_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-012_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST02-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-012.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Trowa Barton",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】Choose 1 of your Units. It gains &lt;Breach 3&gt; during this turn.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>【Pilot】[Trowa Barton]<br>",
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
            keywordValue: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 of your Units. It gains <Breach 3> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.) 【Pilot】[Trowa Barton]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
