import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03MAVTactics106: CommandCard = {
  cardNumber: "GD03-106",
  name: "M.A.V. Tactics",
  type: "command",
  color: "green",
  traits: [],
  id: "GD03-106",
  externalId: "gundam:gd03-106",
  slug: "m-a-v-tactics-gd03-106",
  displayName: "M.A.V. Tactics",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-106",
  printings: [
    {
      id: "GD03-106",
      collectorNumber: "GD03-106",
      cardNumber: "GD03-106",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-106.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-106.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-106_p1",
      collectorNumber: "GD03-106_p1",
      cardNumber: "GD03-106",
      set: {
        code: "PC02A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
        packageId: "616701",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-106_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-106_p1.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
    },
  ],
  selectedPrintingId: "GD03-106",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-106.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-106.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  effect:
    "【Main】Deploy 1 rested [GQuuuuuuX (Omega Psycommu)]((Clan)･AP3･HP2) Unit token and 1 rested [Red Gundam]((Clan)･AP2･HP3) Unit token.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "GQuuuuuuX (Omega Psycommu)",
              traits: ["clan"],
              ap: 3,
              hp: 2,
              deployState: "rested",
            },
          },
        },
        {
          action: {
            action: "deployToken",
            token: {
              name: "Red Gundam",
              traits: ["clan"],
              ap: 2,
              hp: 3,
              deployState: "rested",
            },
          },
        },
      ],
      sourceText:
        "【Main】Deploy 1 rested [GQuuuuuuX (Omega Psycommu)]((Clan)·AP3·HP2) Unit token and 1 rested [Red Gundam]((Clan)·AP2·HP3) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
export const pc02aMAVTactics106 = gd03MAVTactics106;
