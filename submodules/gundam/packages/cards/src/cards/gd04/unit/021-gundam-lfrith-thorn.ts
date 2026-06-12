import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamLfrithThorn021: UnitCard = {
  cardNumber: "GD04-021",
  name: "Gundam Lfrith Thorn",
  type: "unit",
  color: "green",
  traits: ["dawn of fold", "academy"],
  id: "GD04-021",
  externalId: "gundam:gd04-021",
  slug: "gundam-lfrith-thorn-gd04-021",
  displayName: "Gundam Lfrith Thorn",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-021",
  printings: [
    {
      id: "GD04-021",
      collectorNumber: "GD04-021",
      cardNumber: "GD04-021",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-021.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-021.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-021_p1",
      collectorNumber: "GD04-021_p1",
      cardNumber: "GD04-021",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-021_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-021_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-021",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-021.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-021.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Norea Du Noc]",
  effect:
    "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\nDuring your turn, when you play and activate a (Dawn of Fold) Command card using an EX Resource, you may pair that card from your trash with one of your Units with \"Gundam Lfrith\" in its card name.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onCommandEffectActivated"],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "eventPlayerIsSelf" },
          { type: "eventPaidExResources", comparison: "gte", count: 1 },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "dawn of fold",
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "pairEventCardAsPilot",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Gundam Lfrith",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        'During your turn, when you play and activate a (Dawn of Fold) Command card using an EX Resource, you may pair that card from your trash with one of your Units with "Gundam Lfrith" in its card name.',
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 3 }],
  rarity: "rare",
};
