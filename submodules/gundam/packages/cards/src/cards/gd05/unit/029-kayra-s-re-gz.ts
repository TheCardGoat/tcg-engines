import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05KayraSReGz029: UnitCard = {
  cardNumber: "GD05-029",
  name: "Kayra's Re-GZ",
  type: "unit",
  color: "green",
  traits: ["earth federation", "londo bell"],
  id: "GD05-029",
  canonicalId: "GD05-029",
  externalIds: { bandai: "gundam:gd05-029" },
  slug: "kayra-s-re-gz-gd05-029",
  displayName: "Kayra's Re-GZ",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-029",
  printings: [
    {
      id: "GD05-029",
      artId: "GD05-029",
      setCode: "GD05",
      collectorNumber: "GD05-029",
      cardNumber: "GD05-029",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-029.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-029.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-029_p1",
      artId: "GD05-029_p1",
      setCode: "GD05",
      collectorNumber: "GD05-029_p1",
      cardNumber: "GD05-029",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-029_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-029_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-029", "GD05-029_p1"],
  selectedPrintingId: "GD05-029",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-029.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-029.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Kayra Su]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "topAndBottom",
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
