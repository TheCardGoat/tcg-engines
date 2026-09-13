import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05AlphaAzieru054: UnitCard = {
  cardNumber: "GD05-054",
  name: "Alpha Azieru",
  type: "unit",
  color: "purple",
  traits: ["neo zeon"],
  id: "GD05-054",
  canonicalId: "GD05-054",
  externalIds: { bandai: "gundam:gd05-054" },
  slug: "alpha-azieru-gd05-054",
  displayName: "Alpha Azieru",
  rulesText:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【Once per Turn】When one of your Units is destroyed by an effect, draw 1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-054",
  printings: [
    {
      id: "GD05-054",
      artId: "GD05-054",
      setCode: "GD05",
      collectorNumber: "GD05-054",
      cardNumber: "GD05-054",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-054.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-054",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-054.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 5,
  linkCondition: "[Quess Paraya]",
  battlefieldZones: ["space"],
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【Once per Turn】When one of your Units is destroyed by an effect, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [
          {
            type: "eventCardMatches",
            target: { owner: "friendly", cardType: "unit" },
          },
          { type: "eventDamageType", damageType: "effect" },
        ],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Once per Turn】When one of your Units is destroyed by an effect, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
