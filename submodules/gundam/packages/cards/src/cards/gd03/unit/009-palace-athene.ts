import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03PalaceAthene009: UnitCard = {
  cardNumber: "GD03-009",
  name: "Palace Athene",
  type: "unit",
  color: "blue",
  traits: ["titans", "jupitris"],
  id: "GD03-009",
  externalId: "gundam:gd03-009",
  slug: "palace-athene-gd03-009",
  displayName: "Palace Athene",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-009",
  printings: [
    {
      id: "GD03-009",
      collectorNumber: "GD03-009",
      cardNumber: "GD03-009",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-009.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-009.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 5,
  hp: 3,
  linkCondition: "[Reccoa Londe]",
  effect:
    "【Deploy】You may choose 2 (Titans) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit that is Lv.4 or lower. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        // Activation gate: don't even let the deploy trigger fire unless
        // the controller has 2 (Titans) cards in trash. Without this,
        // `dependsOnPrevious` would still let the rest fire even on a
        // partial 1-card exile (the engine clamps count). The gate here
        // is conservative — when there are no candidates, the trigger
        // skips entirely; when there are 2+, the optional flag lets the
        // controller decline the whole branch.
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 2,
            hasTrait: "titans",
          },
        ],
      },
      // KNOWN LIMITATION: the `validateDeployTriggerTargets` plumbing
      // pre-validates every counted target before any `optionalAnswers`
      // get read, so deploying Palace Athene without supplying ALL 3
      // targets (2 trash + 1 enemy) up front is rejected even when the
      // controller wants to decline the optional branch. The deploy-
      // trigger validator needs to be taught to skip targets gated on a
      // not-yet-answered optional. Tracked separately.
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "titans",
                },
              ],
              count: 2,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】You may choose 2 (Titans) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit that is Lv.4 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
