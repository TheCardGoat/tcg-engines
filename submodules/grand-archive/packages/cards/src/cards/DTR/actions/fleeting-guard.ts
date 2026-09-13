import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fleetingGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2la6uk1qvl",
  slug: "fleeting-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2la6uk1qvl:face:default",
      catalogId: "2la6uk1qvl",
      name: "Fleeting Guard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Until end of turn, if target unit would be dealt damage, prevent X of that damage where X is the amount of ephemeral objects you control plus 1.",
      abilities: [
        {
          id: "2la6uk1qvl-a1",
          kind: "card-resolution",
          text: "Until end of turn, if target unit would be dealt damage, prevent X of that damage where X is the amount of ephemeral objects you control plus 1.",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "object-state",
                        state: "ephemeral",
                      },
                    },
                  },
                  1,
                ],
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
              amount: {
                kind: "variable",
                symbol: "X",
              },
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

export default fleetingGuard;
