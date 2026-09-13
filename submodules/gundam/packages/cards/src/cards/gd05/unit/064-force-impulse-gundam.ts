import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05ForceImpulseGundam064: UnitCard = {
  cardNumber: "GD05-064",
  name: "Force Impulse Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "GD05-064",
  canonicalId: "GD05-064",
  externalIds: { bandai: "gundam:gd05-064" },
  slug: "force-impulse-gundam-gd05-064",
  displayName: "Force Impulse Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-064",
  printings: [
    {
      id: "GD05-064",
      artId: "GD05-064",
      setCode: "GD05",
      collectorNumber: "GD05-064",
      cardNumber: "GD05-064",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-064.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-064.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-064_p1",
      artId: "GD05-064_p1",
      setCode: "GD05",
      collectorNumber: "GD05-064_p1",
      cardNumber: "GD05-064",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-064_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-064_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-064", "GD05-064_p1"],
  selectedPrintingId: "GD05-064",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-064.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-064.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "[Lunamaria Hawke]",
  battlefieldZones: ["space", "earth"],
  effect:
    '【Deploy】If you deploy this Unit from your trash, choose 1 Pilot card with "Shinn Asuka" in its card name from your trash. Add it to your hand.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "deployedFromZone",
            zone: "trash",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "pilot",
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Shinn Asuka",
                },
              ],
              zone: "trash",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        '【Deploy】If you deploy this Unit from your trash, choose 1 Pilot card with "Shinn Asuka" in its card name from your trash. Add it to your hand.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
