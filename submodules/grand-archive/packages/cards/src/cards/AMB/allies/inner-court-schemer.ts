import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const innerCourtSchemer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "spijrps4ny",
  slug: "inner-court-schemer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "spijrps4ny:face:default",
      catalogId: "spijrps4ny",
      name: "Inner Court Schemer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Attack: You may remove a preparation counter from your champion. If you do, this attack gets +2 POWER.",
      abilities: [
        {
          id: "spijrps4ny-a1",
          kind: "triggered",
          text: "On Attack: You may remove a preparation counter from your champion. If you do, this attack gets +2 POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "remove-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "preparation",
                    amount: 1,
                    bindResultAs: "removed-counters",
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "continuous",
                    subjects: {
                      kind: "current-attack",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-attack",
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
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default innerCourtSchemer;
