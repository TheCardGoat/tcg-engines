import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const relicOfSunkenPast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dqqwey9xys",
  slug: "relic-of-sunken-past",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dqqwey9xys:face:default",
      catalogId: "dqqwey9xys",
      name: "Relic of Sunken Past",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ARTIFACT"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, if there are three or more water element cards in your graveyard, you may sacrifice Relic of Sunken Past. If you do, draw a card.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "dqqwey9xys-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, if there are three or more water element cards in your graveyard, you may sacrifice Relic of Sunken Past. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "count",
                        collection: {
                          zones: ["graveyard"],
                          player: "controller",
                          filter: {
                            kind: "element",
                            oneOf: ["WATER"],
                          },
                        },
                      },
                      operator: "gte",
                      right: 3,
                    },
                  },
                  then: {
                    kind: "optional",
                    player: "controller",
                    allOrNothing: true,
                    effect: {
                      kind: "sacrifice",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "dqqwey9xys-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default relicOfSunkenPast;
