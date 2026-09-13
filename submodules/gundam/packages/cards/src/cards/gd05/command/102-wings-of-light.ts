import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05WingsOfLight102: CommandCard = {
  cardNumber: "GD05-102",
  name: "Wings of Light",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD05-102",
  canonicalId: "GD05-102",
  externalIds: { bandai: "gundam:gd05-102" },
  slug: "wings-of-light-gd05-102",
  displayName: "Wings of Light",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-102",
  printings: [
    {
      id: "GD05-102",
      artId: "GD05-102",
      setCode: "GD05",
      collectorNumber: "GD05-102",
      cardNumber: "GD05-102",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-102.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-102.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-102_p1",
      artId: "GD05-102_p1",
      setCode: "GD05",
      collectorNumber: "GD05-102_p1",
      cardNumber: "GD05-102",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-102_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-102_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-102", "GD05-102_p1"],
  selectedPrintingId: "GD05-102",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-102.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-102.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit V Gundam",
  level: 5,
  cost: 2,
  effect:
    "【Action】When playing this card, choose 1 of the following effects and activate it:\n\n■Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.\n\n■Choose 1 Unit. It recovers 3 HP.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          kind: "chooseOne",
          options: [
            {
              label: "Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.",
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
                            action: "returnToHand",
                            target: {
                              owner: "opponent",
                              cardType: "unit",
                              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 5 }],
                              count: 1,
                            },
                          },
                        },
                      ],
                      sourceText:
                        "Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.",
                    },
                  },
                },
              ],
            },
            {
              label: "Choose 1 Unit. It recovers 3 HP.",
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
                            action: "recoverHP",
                            amount: 3,
                            target: {
                              owner: "any",
                              cardType: "unit",
                              count: 1,
                            },
                          },
                        },
                      ],
                      sourceText: "Choose 1 Unit. It recovers 3 HP.",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      sourceText:
        "【Action】When playing this card, choose 1 of the following effects and activate it: ■Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand. ■Choose 1 Unit. It recovers 3 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
