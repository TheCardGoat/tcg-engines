import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veiledGambit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hxdfyA0eP1",
  slug: "veiled-gambit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hxdfyA0eP1:face:default",
      catalogId: "hxdfyA0eP1",
      name: "Veiled Gambit",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice a Chessman ally.\n\nPrevent the next 4 damage that would be dealt to your champion and up to one other target unit until end of turn.",
      abilities: [
        {
          id: "hxdfyA0eP1-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a Chessman ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["CHESSMAN"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "hxdfyA0eP1-a2",
          kind: "card-resolution",
          text: "Prevent the next 4 damage that would be dealt to your champion and up to one other target unit until end of turn.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "any-of",
                subjects: [
                  {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                  {
                    kind: "bound-object",
                    binding: "target-1",
                  },
                ],
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 4,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default veiledGambit;
