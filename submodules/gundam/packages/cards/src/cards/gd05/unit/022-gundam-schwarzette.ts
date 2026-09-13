import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamSchwarzette022: UnitCard = {
  cardNumber: "GD05-022",
  name: "Gundam Schwarzette",
  type: "unit",
  color: "green",
  traits: ["academy"],
  id: "GD05-022",
  canonicalId: "GD05-022",
  externalIds: { bandai: "gundam:gd05-022" },
  slug: "gundam-schwarzette-gd05-022",
  displayName: "Gundam Schwarzette",
  rulesText:
    "<Breach 3> (During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Activate･Action】Exile 2 Command cards in your trash from the game：During this battle, when this Unit receives enemy damage, reduce it by 2.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-022",
  printings: [
    {
      id: "GD05-022",
      artId: "GD05-022",
      setCode: "GD05",
      collectorNumber: "GD05-022",
      cardNumber: "GD05-022",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-022.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-022",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-022.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "(Academy) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Breach 3> (During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Activate･Action】Exile 2 Command cards in your trash from the game：During this battle, when this Unit receives enemy damage, reduce it by 2.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
      },
      cost: {
        exileFromTrash: {
          owner: "friendly",
          zone: "trash",
          cardType: "command",
          count: 2,
        },
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 2,
            duration: "thisBattle",
            source: "enemy",
            target: { owner: "self" },
          },
        },
      ],
      sourceText:
        "【Activate·Action】Exile 2 Command cards in your trash from the game：During this battle, when this Unit receives enemy damage, reduce it by 2.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 3 }],
  rarity: "rare",
};
