import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GrahamSUnionFlagCustom069: UnitCard = {
  cardNumber: "GD03-069",
  name: "Graham's Union Flag Custom",
  type: "unit",
  color: "white",
  traits: ["superpower bloc"],
  id: "GD03-069",
  externalId: "gundam:gd03-069",
  slug: "graham-s-union-flag-custom-gd03-069",
  displayName: "Graham's Union Flag Custom",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-069",
  printings: [
    {
      id: "GD03-069",
      collectorNumber: "GD03-069",
      cardNumber: "GD03-069",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-069.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-069.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-069_p1",
      collectorNumber: "GD03-069_p1",
      cardNumber: "GD03-069",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-069_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-069_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-069",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-069.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-069.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 2,
  linkCondition: "[Graham Aker]",
  effect:
    "<High-Maneuver> (This Unit can't be blocked.)\n【During Link】At the end of the turn when this Unit is paired with a Pilot, set it as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["endOfTurn"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】At the end of the turn when this Unit is paired with a Pilot, set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "HighManeuver" }],
  rarity: "legendRare",
};
