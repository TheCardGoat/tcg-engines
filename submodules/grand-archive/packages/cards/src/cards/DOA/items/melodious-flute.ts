import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const melodiousFlute: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WAFNy2lY5t",
  slug: "melodious-flute",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WAFNy2lY5t:face:default",
      catalogId: "WAFNy2lY5t",
      name: "Melodious Flute",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "INSTRUMENT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Your champion gets +1 level as long as you control an Animal or Beast ally.\n\n[Class Bonus] Banish Melodious Flute: The next Harmony action card you activate this turn is a Melody in addition to its other types.",
      abilities: [
        {
          id: "WAFNy2lY5t-a1",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +1 level as long as you control an Animal or Beast ally.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["ANIMAL"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "WAFNy2lY5t-a2",
          kind: "activated",
          text: "[Class Bonus] Banish Melodious Flute: The next Harmony action card you activate this turn is a Melody in addition to its other types.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
          effect: {
            kind: "replacement",
            event: {
              name: "card-moved",
              to: "effects-stack",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HARMONY"],
                    },
                  ],
                },
              },
            },
            limit: {
              count: 1,
              per: "game",
            },
            duration: {
              kind: "this-turn",
            },
            operation: {
              kind: "perform-before-commit",
              effect: {
                kind: "continuous",
                subjects: {
                  kind: "event-subject",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "subtype",
                    value: "MELODY",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default melodiousFlute;
