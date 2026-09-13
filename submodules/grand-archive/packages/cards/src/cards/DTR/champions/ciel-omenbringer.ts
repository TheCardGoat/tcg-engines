import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cielOmenbringer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o69ogocemo",
  slug: "ciel-omenbringer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o69ogocemo:face:default",
      catalogId: "o69ogocemo",
      name: "Ciel, Omenbringer",
      lineageName: "Ciel",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 25,
      },
      rulesText:
        "Ciel Lineage\n\nOn Enter: For each omen you have, discard a card from your hand or memory and draw a card into your memory.\n\nLineage Release — You may activate one of your omens. Activate this ability only if you have six or more omens.",
      abilities: [
        {
          id: "o69ogocemo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ciel Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Ciel",
          },
        },
        {
          id: "o69ogocemo-a2",
          kind: "triggered",
          text: "On Enter: For each omen you have, discard a card from your hand or memory and draw a card into your memory.",
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
            kind: "repeat",
            count: {
              kind: "count",
              collection: {
                zones: ["banishment"],
                player: "controller",
                filter: {
                  kind: "has-counter",
                  counter: "omen",
                },
              },
            },
            effect: {
              kind: "discard",
              player: "controller",
              selection: {
                id: "discarded-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
            },
          },
        },
        {
          id: "o69ogocemo-a3",
          kind: "activated",
          text: "Lineage Release — You may activate one of your omens. Activate this ability only if you have six or more omens.",
          keyword: {
            name: "lineage-release",
            cost: {
              kind: "banish-self",
            },
          },
          functionalZones: ["inner-lineage"],
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
              operator: "gte",
              right: 6,
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-omen",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "has-counter",
                  counter: "omen",
                },
              },
            },
            effect: {
              kind: "activate-card",
              subject: {
                kind: "bound",
                binding: "chosen-omen",
              },
              payCosts: true,
            },
          },
        },
      ],
    },
  },
};

export default cielOmenbringer;
