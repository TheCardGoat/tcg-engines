import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GBouncer023: UnitCard = {
  cardNumber: "GD03-023",
  name: "G-Bouncer",
  type: "unit",
  color: "green",
  traits: ["earth federation"],
  id: "GD03-023",
  externalId: "gundam:gd03-023",
  slug: "g-bouncer-gd03-023",
  displayName: "G-Bouncer",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-023",
  printings: [
    {
      id: "GD03-023",
      collectorNumber: "GD03-023",
      cardNumber: "GD03-023",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-023.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-023.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-023",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-023.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-023.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(Earth Federation) Trait",
  effect:
    "When you place an EX Resource, choose 1 of your (AGE System) Units. It gains <High-Maneuver> during this turn.\n\r\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onExResourcePlaced"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "AGE System" },
              ],
            },
          },
        },
      ],
      sourceText:
        "When you place an EX Resource, choose 1 of your (AGE System) Units. It gains <High-Maneuver> during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
