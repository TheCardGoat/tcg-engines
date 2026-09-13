import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05NuGundam017: UnitCard = {
  cardNumber: "GD05-017",
  name: "Nu Gundam",
  type: "unit",
  color: "green",
  traits: ["earth federation", "londo bell"],
  id: "GD05-017",
  canonicalId: "GD05-017",
  externalIds: { bandai: "gundam:gd05-017" },
  slug: "nu-gundam-gd05-017",
  displayName: "Nu Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-017",
  printings: [
    {
      id: "GD05-017",
      artId: "GD05-017",
      setCode: "GD05",
      collectorNumber: "GD05-017",
      cardNumber: "GD05-017",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-017.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-017.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-017_p1",
      artId: "GD05-017_p1",
      setCode: "GD05",
      collectorNumber: "GD05-017_p1",
      cardNumber: "GD05-017",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-017_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-017_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-017_p2",
      artId: "GD05-017_p2",
      setCode: "GD05",
      collectorNumber: "GD05-017_p2",
      cardNumber: "GD05-017",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-017_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-017_p2.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-017", "GD05-017_p1", "GD05-017_p2"],
  selectedPrintingId: "GD05-017",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-017.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-017.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Amuro Ray]",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Breach 5> (During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)\n【When Paired】You may choose 3 (Londo Bell) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Begin a battle between this Unit and it and only perform the damage step.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: {
              action: "exile",
              target: {
                owner: "friendly",
                attributeFilters: [
                  {
                    attribute: "trait",
                    comparison: "includes",
                    value: "londo bell",
                  },
                ],
                zone: "trash",
                count: 3,
              },
            },
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "beginDamageStepBattle",
                    target: {
                      owner: "opponent",
                      cardType: "unit",
                      zone: "battleArea",
                      count: 1,
                    },
                  },
                },
              ],
              sourceText:
                "If you do, choose 1 enemy Unit. Begin a battle between this Unit and it and only perform the damage step.",
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【When Paired】You may choose 3 (Londo Bell) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Begin a battle between this Unit and it and only perform the damage step.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 5 }],
  rarity: "legendRare",
};
