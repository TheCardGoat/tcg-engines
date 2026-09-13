import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scorchingStrafe: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0k0p6n5nr7",
  slug: "scorching-strafe",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0k0p6n5nr7:face:default",
      catalogId: "0k0p6n5nr7",
      name: "Scorching Strafe",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nTarget ally gets +2 POWER until end of turn and becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "0k0p6n5nr7-a1",
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
          id: "0k0p6n5nr7-a2",
          kind: "card-resolution",
          text: "Target ally gets +2 POWER until end of turn and becomes distant. (Units stay distant until the end of their controller's turn.)",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 2,
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "distant",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default scorchingStrafe;
