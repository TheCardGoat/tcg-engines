import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Hashmal006: UnitCard = {
  cardNumber: "GD05-006",
  name: "Hashmal",
  type: "unit",
  color: "blue",
  traits: ["calamity war"],
  id: "GD05-006",
  canonicalId: "GD05-006",
  externalIds: { bandai: "gundam:gd05-006" },
  slug: "hashmal-gd05-006",
  displayName: "Hashmal",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-006",
  printings: [
    {
      id: "GD05-006",
      artId: "GD05-006",
      setCode: "GD05",
      collectorNumber: "GD05-006",
      cardNumber: "GD05-006",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-006.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-006_p1",
      artId: "GD05-006_p1",
      setCode: "GD05",
      collectorNumber: "GD05-006_p1",
      cardNumber: "GD05-006",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-006_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-006", "GD05-006_p1"],
  selectedPrintingId: "GD05-006",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-006.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
  level: 7,
  cost: 6,
  ap: 5,
  hp: 6,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Once per Turn】During your turn, when this Unit destroys an enemy card with battle damage, deploy 1 [Pluma]((Calamity War)･AP2･HP1) Unit token.\nThis Unit gains the same number of <Repair 1> as the number of (Calamity War) Unit tokens you have in play.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle", "onShieldAreaCardDestroyByBattle"],
        conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Pluma",
              traits: ["calamity war"],
              ap: 2,
              hp: 1,
              deployState: "active",
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when this Unit destroys an enemy card with battle damage, deploy 1 [Pluma]((Calamity War)·AP2·HP1) Unit token.",
    },
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 1,
            countFilter: {
              owner: "friendly",
              zone: "battleArea",
              cardType: "unit",
              isToken: true,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "calamity war" },
              ],
            },
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText:
        "This Unit gains the same number of <Repair 1> as the number of (Calamity War) Unit tokens you have in play. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
