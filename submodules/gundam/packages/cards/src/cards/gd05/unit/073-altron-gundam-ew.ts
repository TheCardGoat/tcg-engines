import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05AltronGundamEw073: UnitCard = {
  cardNumber: "GD05-073",
  name: "Altron Gundam (EW)",
  type: "unit",
  color: "white",
  traits: ["g team", "mariemaia army"],
  id: "GD05-073",
  canonicalId: "GD05-073",
  externalIds: { bandai: "gundam:gd05-073" },
  slug: "altron-gundam-ew-gd05-073",
  displayName: "Altron Gundam (EW)",
  rulesText:
    "【Deploy】Choose 1 rested enemy Unit. It won't be set as active during the start phase of your opponent's next turn.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-073",
  printings: [
    {
      id: "GD05-073",
      artId: "GD05-073",
      setCode: "GD05",
      collectorNumber: "GD05-073",
      cardNumber: "GD05-073",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-073.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-073",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-073.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Chang Wufei]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】Choose 1 rested enemy Unit. It won't be set as active during the start phase of your opponent's next turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "preventActive",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 rested enemy Unit. It won't be set as active during the start phase of your opponent's next turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
