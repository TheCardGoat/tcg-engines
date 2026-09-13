import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alicePhantomMonarch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "emqOANitoD",
  slug: "alice-phantom-monarch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "emqOANitoD:face:default",
      catalogId: "emqOANitoD",
      name: "Alice, Phantom Monarch",
      lineageName: "Alice",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ANOMALY"],
        subtypes: ["ANOMALY", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Alice Lineage\n\nInherited Effect — Whenever you play an advanced element card while there are no Curse cards in Alice's lineage, deal 7 unpreventable damage to Alice.\n",
      abilities: [
        {
          id: "emqOANitoD-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Alice Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Alice",
          },
        },
        {
          id: "emqOANitoD-a2",
          kind: "triggered",
          text: "Inherited Effect — Whenever you play an advanced element card while there are no Curse cards in Alice's lineage, deal 7 unpreventable damage to Alice.",
          executionSource: "lineage-host",
          trigger: {
            kind: "event",
            event: {
              name: "card-played",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element-category",
                  value: "advanced",
                },
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["inner-lineage"],
                    host: {
                      kind: "ability-bearer",
                    },
                    relationship: "lineage-of",
                    filter: {
                      kind: "subtype",
                      oneOf: ["CURSE"],
                    },
                  },
                },
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "ability-bearer",
            },
            recipient: {
              kind: "ability-bearer",
            },
            amount: 7,
            preventable: false,
          },
        },
      ],
    },
  },
};

export default alicePhantomMonarch;
