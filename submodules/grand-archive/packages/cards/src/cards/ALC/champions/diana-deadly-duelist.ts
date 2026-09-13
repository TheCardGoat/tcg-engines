import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaDeadlyDuelist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7ozuj68m69",
  slug: "diana-deadly-duelist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7ozuj68m69:face:default",
      catalogId: "7ozuj68m69",
      name: "Diana, Deadly Duelist",
      lineageName: "Diana",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        'Diana Lineage (Diana, Deadly Duelist must be leveled from a previous level "Diana" champion.)\n\nOn Enter: Materialize a Bullet card from your material deck. (You still pay its costs.)\n\nInherited Effect: Ranged 2',
      abilities: [
        {
          id: "7ozuj68m69-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Diana Lineage (Diana, Deadly Duelist must be leveled from a previous level "Diana" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Diana",
          },
        },
        {
          id: "7ozuj68m69-a2",
          kind: "triggered",
          text: "On Enter: Materialize a Bullet card from your material deck. (You still pay its costs.)",
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
                  oneOf: ["BULLET"],
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
        {
          id: "7ozuj68m69-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Inherited Effect: Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
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

export default dianaDeadlyDuelist;
