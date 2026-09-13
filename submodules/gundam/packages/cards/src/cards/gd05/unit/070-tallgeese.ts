import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Tallgeese070: UnitCard = {
  cardNumber: "GD05-070",
  name: "Tallgeese Ⅲ",
  type: "unit",
  color: "white",
  traits: ["preventer"],
  id: "GD05-070",
  canonicalId: "GD05-070",
  externalIds: { bandai: "gundam:gd05-070" },
  slug: "tallgeese-gd05-070",
  displayName: "Tallgeese Ⅲ",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-070",
  printings: [
    {
      id: "GD05-070",
      artId: "GD05-070",
      setCode: "GD05",
      collectorNumber: "GD05-070",
      cardNumber: "GD05-070",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-070.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-070.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-070_p1",
      artId: "GD05-070_p1",
      setCode: "GD05",
      collectorNumber: "GD05-070_p1",
      cardNumber: "GD05-070",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-070_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-070_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-070", "GD05-070_p1"],
  selectedPrintingId: "GD05-070",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-070.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-070.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Zechs Merquise]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 of your rested (Preventer)/(G Team) Link Units. Set it as active. It can't attack during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
          {
            type: "eventCardIsSelf",
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "preventer",
                    },
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "g team",
                    },
                  ],
                },
              ],
              isLinkUnit: true,
              count: 1,
            },
          },
        },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "preventer",
                    },
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "g team",
                    },
                  ],
                },
              ],
              isLinkUnit: true,
            },
          },
          dependsOnPrevious: true,
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 of your rested (Preventer)/(G Team) Link Units. Set it as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
