import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamVirsagoGundamAshtaron040: UnitCard = {
  cardNumber: "GD03-040",
  name: "Gundam Virsago & Gundam Ashtaron",
  type: "unit",
  color: "red",
  traits: ["new une"],
  id: "GD03-040",
  canonicalId: "GD03-040",
  externalIds: { bandai: "gundam:gd03-040" },
  slug: "gundam-virsago-and-gundam-ashtaron/gd03-040",
  displayName: "Gundam Virsago & Gundam Ashtaron",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-040",
  printings: [
    {
      id: "GD03-040",
      artId: "GD03-040",
      setCode: "GD03",
      collectorNumber: "GD03-040",
      cardNumber: "GD03-040",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-040.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-040.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  reprints: ["GD03-040"],
  selectedPrintingId: "GD03-040",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-040.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-040.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 3,
  hp: 5,
  linkCondition: "[Shagia Frost] / [Olba Frost]",
  effect: "【During Link】This Unit gains <High-Maneuver>.\n\r\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gains <High-Maneuver>. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
