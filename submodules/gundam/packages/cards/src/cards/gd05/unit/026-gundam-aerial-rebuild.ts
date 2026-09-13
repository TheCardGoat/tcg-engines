import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamAerialRebuild026: UnitCard = {
  cardNumber: "GD05-026",
  name: "Gundam Aerial Rebuild",
  type: "unit",
  color: "green",
  traits: ["quiet zero"],
  id: "GD05-026",
  canonicalId: "GD05-026",
  externalIds: { bandai: "gundam:gd05-026" },
  slug: "gundam-aerial-rebuild-gd05-026",
  displayName: "Gundam Aerial Rebuild",
  rulesText:
    'Count up the number of your Units with "Gundam Lfrith"/"Gundnode" in their card name, plus this Unit. All enemy Units whose Lv. is equal to or lower than that number are deployed rested.',
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-026",
  printings: [
    {
      id: "GD05-026",
      artId: "GD05-026",
      setCode: "GD05",
      collectorNumber: "GD05-026",
      cardNumber: "GD05-026",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-026.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-026",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-026.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 5,
  cost: 3,
  ap: 3,
  hp: 5,
  linkCondition: "[Prospera Mercury] / [Ericht Samaya]",
  battlefieldZones: ["space", "earth"],
  effect:
    'Count up the number of your Units with "Gundam Lfrith"/"Gundnode" in their card name, plus this Unit. All enemy Units whose Lv. is equal to or lower than that number are deployed rested.',
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "deployRestedByFriendlyNameCount",
            names: ["Gundam Lfrith", "Gundnode"],
            target: { owner: "opponent", cardType: "unit", isToken: false, count: "all" },
          },
        },
      ],
      sourceText:
        'Count up the number of your Units with "Gundam Lfrith"/"Gundnode" in their card name, plus this Unit. All enemy Units whose Lv. is equal to or lower than that number are deployed rested.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
