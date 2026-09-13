import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GearaDoga061: UnitCard = {
  cardNumber: "GD05-061",
  name: "Geara Doga",
  type: "unit",
  color: "purple",
  traits: ["neo zeon"],
  id: "GD05-061",
  canonicalId: "GD05-061",
  externalIds: { bandai: "gundam:gd05-061" },
  slug: "geara-doga-gd05-061",
  displayName: "Geara Doga",
  rulesText:
    "While you have another (Neo Zeon) Unit in play, this Unit gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-061",
  printings: [
    {
      id: "GD05-061",
      artId: "GD05-061",
      setCode: "GD05",
      collectorNumber: "GD05-061",
      cardNumber: "GD05-061",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-061.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-061",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-061.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  battlefieldZones: ["space", "earth"],
  effect:
    "While you have another (Neo Zeon) Unit in play, this Unit gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "neo zeon",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While you have another (Neo Zeon) Unit in play, this Unit gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
