import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deflectingEdge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g7uDOmUf2u",
  slug: "deflecting-edge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g7uDOmUf2u:face:default",
      catalogId: "g7uDOmUf2u",
      name: "Deflecting Edge",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 1 less to activate if you control a Sword weapon.\n\nPrevent the next 3 combat damage that would be dealt to target unit this turn.",
      abilities: [
        {
          id: "g7uDOmUf2u-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate if you control a Sword weapon.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SWORD"],
                      },
                    ],
                  },
                },
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
          id: "g7uDOmUf2u-a2",
          kind: "card-resolution",
          text: "Prevent the next 3 combat damage that would be dealt to target unit this turn.",
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
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
              combatDamage: true,
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 3,
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

export default deflectingEdge;
