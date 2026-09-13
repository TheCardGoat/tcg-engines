import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaAetherDilettante: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m7f6r8f3y8",
  slug: "diana-aether-dilettante",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m7f6r8f3y8:face:default",
      catalogId: "m7f6r8f3y8",
      name: "Diana, Aether Dilettante",
      lineageName: "Diana",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: If Diana is distant, materialize an Aetherwing card from your material deck. (You still pay its costs.)\n\nInherited Effect — Ranged 1 (As long as this unit is distant, its attacks get +1POWER.)",
      abilities: [
        {
          id: "m7f6r8f3y8-a1",
          kind: "triggered",
          text: "On Enter: If Diana is distant, materialize an Aetherwing card from your material deck. (You still pay its costs.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "source",
              },
              state: "distant",
            },
            then: {
              kind: "choose",
              selection: {
                id: "materialized-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["material-deck"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["AETHERWING"],
                  },
                },
              },
              effect: {
                kind: "materialize-card",
                subject: {
                  kind: "bound",
                  binding: "materialized-card",
                },
              },
            },
          },
        },
        {
          id: "m7f6r8f3y8-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Inherited Effect — Ranged 1 (As long as this unit is distant, its attacks get +1POWER.)",
          keyword: {
            name: "ranged",
            value: 1,
          },
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default dianaAetherDilettante;
