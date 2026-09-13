import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamThroneEinsGnHighMegaLauncher038: UnitCard = {
  cardNumber: "GD05-038",
  name: "Gundam Throne Eins (GN High Mega Launcher)",
  type: "unit",
  color: "red",
  traits: ["cb", "trinity"],
  id: "GD05-038",
  canonicalId: "GD05-038",
  externalIds: { bandai: "gundam:gd05-038" },
  slug: "gundam-throne-eins-gn-high-mega-launcher-gd05-038",
  displayName: "Gundam Throne Eins (GN High Mega Launcher)",
  rulesText:
    "【During Link】This Unit gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【Activate･Main】【Once per Turn】Rest 3 of your (CB) Units：Choose 1 enemy Unit. Deal 4 damage to it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-038",
  printings: [
    {
      id: "GD05-038",
      artId: "GD05-038",
      setCode: "GD05",
      collectorNumber: "GD05-038",
      cardNumber: "GD05-038",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-038.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-038",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-038.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam 00",
  level: 7,
  cost: 5,
  ap: 6,
  hp: 4,
  linkCondition: "(Trinity) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【During Link】This Unit gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【Activate･Main】【Once per Turn】Rest 3 of your (CB) Units：Choose 1 enemy Unit. Deal 4 damage to it.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】This Unit gains <Suppression>. (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        restTarget: {
          owner: "friendly",
          cardType: "unit",
          count: 3,
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: "cb",
            },
          ],
          state: "active",
        },
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 4,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Rest 3 of your (CB) Units：Choose 1 enemy Unit. Deal 4 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
