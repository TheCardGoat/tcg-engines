import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05MutualAttraction106: CommandCard = {
  cardNumber: "GD05-106",
  name: "Mutual Attraction",
  type: "command",
  color: "green",
  traits: [],
  id: "GD05-106",
  canonicalId: "GD05-106",
  externalIds: { bandai: "gundam:gd05-106" },
  slug: "mutual-attraction-gd05-106",
  displayName: "Mutual Attraction",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-106",
  printings: [
    {
      id: "GD05-106",
      artId: "GD05-106",
      setCode: "GD05",
      collectorNumber: "GD05-106",
      cardNumber: "GD05-106",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-106.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-106.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-106_p1",
      artId: "GD05-106_p1",
      setCode: "GD05",
      collectorNumber: "GD05-106_p1",
      cardNumber: "GD05-106",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-106_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-106_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-106", "GD05-106_p1"],
  selectedPrintingId: "GD05-106",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-106.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-106.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 3,
  effect:
    "【Main】When playing this card, choose 1 of the following effects and activate it:\n\n■Place 1 rested Resource.\n\n■Choose 1 Pilot card that is Lv.5 or higher from your trash. Add it to your hand.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          kind: "chooseOne",
          options: [
            {
              label: "Place 1 rested Resource.",
              directives: [
                {
                  action: {
                    action: "placeResource",
                    state: "rested",
                  },
                },
              ],
            },
            {
              label:
                "Choose 1 Pilot card that is Lv.5 or higher from your trash. Add it to your hand.",
              directives: [
                {
                  action: {
                    action: "resolveThenQueue",
                    followUp: {
                      type: "triggered",
                      activation: { timing: [] },
                      directives: [
                        {
                          action: {
                            action: "addFromTrash",
                            target: {
                              owner: "friendly",
                              zone: "trash",
                              cardType: "pilot",
                              count: 1,
                              attributeFilters: [
                                {
                                  attribute: "level",
                                  comparison: "gte",
                                  value: 5,
                                },
                              ],
                            },
                          },
                        },
                      ],
                      sourceText:
                        "Choose 1 Pilot card that is Lv.5 or higher from your trash. Add it to your hand.",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      sourceText:
        "【Main】When playing this card, choose 1 of the following effects and activate it: ■Place 1 rested Resource. ■Choose 1 Pilot card that is Lv.5 or higher from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
