import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamExia038: UnitCard = {
  cardNumber: "GD04-038",
  name: "Gundam Exia",
  type: "unit",
  color: "red",
  traits: ["cb", "gn drive"],
  id: "GD04-038",
  externalId: "gundam:gd04-038",
  slug: "gundam-exia-gd04-038",
  displayName: "Gundam Exia",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-038",
  printings: [
    {
      id: "GD04-038",
      collectorNumber: "GD04-038",
      cardNumber: "GD04-038",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-038.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-038.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-038",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-038.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-038.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 1,
  linkCondition: "[Setsuna F. Seiei]",
  effect:
    "【Deploy】If 2 or more enemy Units are in play, choose 1 enemy Unit that is Lv.2 or lower. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        // Gate the entire trigger on "2+ enemy Units in play" at the
        // activation level rather than nesting the dealDamage in a
        // ConditionalDirective. The deploy-trigger target validator only
        // iterates top-level `EffectDirective`s; nesting inside
        // `thenDirectives` would hide the target slot from the chooser
        // and cause the engine to auto-pick the first candidate.
        conditions: [
          {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 2,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If 2 or more enemy Units are in play, choose 1 enemy Unit that is Lv.2 or lower. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
