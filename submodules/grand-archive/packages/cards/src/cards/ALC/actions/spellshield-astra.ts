import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spellshieldAstra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nmp5af098k",
  slug: "spellshield-astra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nmp5af098k:face:default",
      catalogId: "nmp5af098k",
      name: "Spellshield: Astra",
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
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nThe next time damage would be dealt to your champion this turn, prevent that damage. Glimpse X, where X is the amount of damage prevented this way. ",
      abilities: [
        {
          id: "nmp5af098k-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          id: "nmp5af098k-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent that damage. Glimpse X, where X is the amount of damage prevented this way.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "damage-prevented",
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
            afterApply: {
              kind: "keyword-action",
              action: "glimpse",
              amount: {
                kind: "variable",
                symbol: "X",
              },
            },
          },
        },
      ],
    },
  },
};

export default spellshieldAstra;
