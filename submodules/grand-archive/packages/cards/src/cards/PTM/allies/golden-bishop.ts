import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const goldenBishop: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s4oelWMRJE",
  slug: "golden-bishop",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s4oelWMRJE:face:default",
      catalogId: "s4oelWMRJE",
      name: "Golden Bishop",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "BISHOP", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Hit: If the hit unit has an odd life stat and if there are no charge counters on Golden Bishop, put a charge counter on Golden Bishop.\n\nRemove a charge counter from Golden Bishop: Prevent the next 2 damage that would be dealt to target Chessman unit you control this turn.",
      abilities: [
        {
          id: "s4oelWMRJE-a1",
          kind: "triggered",
          text: "On Hit: If the hit unit has an odd life stat and if there are no charge counters on Golden Bishop, put a charge counter on Golden Bishop.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "all",
              conditions: [
                {
                  kind: "numeric-property-parity",
                  subject: {
                    kind: "event-recipient",
                  },
                  property: "life",
                  basis: "current",
                  value: "odd",
                },
                {
                  kind: "not",
                  condition: {
                    kind: "has-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "charge",
                    },
                  },
                },
              ],
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
              amount: 1,
            },
          },
        },
        {
          id: "s4oelWMRJE-a2",
          kind: "activated",
          text: "Remove a charge counter from Golden Bishop: Prevent the next 2 damage that would be dealt to target Chessman unit you control this turn.",
          activation: "ability",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "charge",
            },
            amount: 1,
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
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
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

export default goldenBishop;
