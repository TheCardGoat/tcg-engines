import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const synthDisrupter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "z1vdxi74wa",
  slug: "synth-disrupter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "z1vdxi74wa:face:default",
      catalogId: "z1vdxi74wa",
      name: "Synth Disrupter",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Synth Disrupter: Until end of turn, Automaton allies enter the field rested.",
      abilities: [
        {
          id: "z1vdxi74wa-a1",
          kind: "activated",
          text: "Banish Synth Disrupter: Until end of turn, Automaton allies enter the field rested.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
                },
              },
            },
            operation: {
              kind: "modify-object-state",
              state: "rested",
              value: true,
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

export default synthDisrupter;
