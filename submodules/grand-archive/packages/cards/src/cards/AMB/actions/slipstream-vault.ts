import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slipstreamVault: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6ilt42sehq",
  slug: "slipstream-vault",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6ilt42sehq:face:default",
      catalogId: "6ilt42sehq",
      name: "Slipstream Vault",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate if it targets a unique ally. (Apply this effect only if your champion's class matches this card's class.)\n\nTarget ally you control becomes distant. Negate all card activations targeting it. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "6ilt42sehq-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate if it targets a unique ally. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "ability-target-matches",
                ability: "this",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["UNIQUE"],
                    },
                  ],
                },
                quantifier: "any",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "6ilt42sehq-a2",
          kind: "card-resolution",
          text: "Target ally you control becomes distant. Negate all card activations targeting it. (Units stay distant until the end of their controller's turn.)",
          targets: [
            {
              id: "target-ally",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "negate-matching-stack-items",
                candidates: {
                  kind: "stack-item",
                  itemTypes: ["card-activation"],
                  targeting: {
                    subject: {
                      kind: "bound",
                      binding: "target-ally",
                    },
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

export default slipstreamVault;
