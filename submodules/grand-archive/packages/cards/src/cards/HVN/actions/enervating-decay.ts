import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enervatingDecay: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jh9s424gjr",
  slug: "enervating-decay",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jh9s424gjr:face:default",
      catalogId: "jh9s424gjr",
      name: "Enervating Decay",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] [Level 5+] This card costs 2 less to activate.\n\nDestroy target attacking ally. If you do, recover X, where X is that ally's life stat.",
      abilities: [
        {
          id: "jh9s424gjr-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 5+] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 5,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "jh9s424gjr-a2",
          kind: "card-resolution",
          text: "Destroy target attacking ally. If you do, recover X, where X is that ally's life stat.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                property: "life",
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  bindResultAs: "destroyed-object",
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
                  kind: "recover",
                  player: "controller",
                  amount: {
                    kind: "variable",
                    symbol: "X",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default enervatingDecay;
