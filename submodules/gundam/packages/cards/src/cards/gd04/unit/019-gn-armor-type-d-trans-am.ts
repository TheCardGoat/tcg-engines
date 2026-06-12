import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GnArmorTypeDTransAm019: UnitCard = {
  cardNumber: "GD04-019",
  name: "GN Armor Type-D (Trans-Am)",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "GD04-019",
  externalId: "gundam:gd04-019",
  slug: "gn-armor-type-d-trans-am-gd04-019",
  displayName: "GN Armor Type-D (Trans-Am)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-019",
  printings: [
    {
      id: "GD04-019",
      collectorNumber: "GD04-019",
      cardNumber: "GD04-019",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-019.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-019.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-019",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-019.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-019.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Lockon Stratos]",
  effect:
    "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (CB) Unit card that is Lv.5 or lower among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          // NOTE: Printed text says "You may reveal 1 (CB) Unit card
          // that is Lv.5 or lower". The engine's `lookAtTopDeck` handler
          // always tutors `matches[0]` when the filter matches — see
          // Encounter (GD04-105) for the same trade-off.
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "cb",
                },
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (CB) Unit card that is Lv.5 or lower among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 3 }],
  rarity: "rare",
};
