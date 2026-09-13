import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const marksmanCaptain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9dqou3vgi8",
  slug: "marksman-captain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9dqou3vgi8:face:default",
      catalogId: "9dqou3vgi8",
      name: "Marksman Captain",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\nOn Enter: Another target unit you control becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "9dqou3vgi8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "9dqou3vgi8-a2",
          kind: "triggered",
          text: "On Enter: Another target unit you control becomes distant. (Units stay distant until the end of their controller's turn.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                relationship: "controlled-by",
                player: "controller",
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
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default marksmanCaptain;
