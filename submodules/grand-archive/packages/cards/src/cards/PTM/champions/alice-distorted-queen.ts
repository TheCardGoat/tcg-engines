import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aliceDistortedQueen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GiQxfpKTUC",
  slug: "alice-distorted-queen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GiQxfpKTUC:face:default",
      catalogId: "GiQxfpKTUC",
      name: "Alice, Distorted Queen",
      lineageName: "Alice",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "DISTORTION", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: You gain the Phantasmagoria mastery. Then put two haunt counters on it.\n\nLineage Release — Recover 2+X, where X is the amount of cards in Alice's lineage.",
      abilities: [
        {
          id: "GiQxfpKTUC-a1",
          kind: "triggered",
          text: "On Enter: You gain the Phantasmagoria mastery. Then put two haunt counters on it.",
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
            kind: "sequence",
            effects: [
              {
                kind: "gain-mastery",
                player: "controller",
                mastery: "Phantasmagoria",
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "event-subject",
                },
                counter: {
                  named: "haunt",
                },
                amount: 2,
              },
            ],
          },
        },
        {
          id: "GiQxfpKTUC-a2",
          kind: "activated",
          text: "Lineage Release — Recover 2+X, where X is the amount of cards in Alice's lineage.",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["inner-lineage"],
                  host: {
                    kind: "source",
                  },
                  relationship: "lineage-of",
                },
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                2,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default aliceDistortedQueen;
