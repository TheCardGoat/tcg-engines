import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazingBowman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qry41lw9n0",
  slug: "blazing-bowman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qry41lw9n0:face:default",
      catalogId: "qry41lw9n0",
      name: "Blazing Bowman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "Blazing Bowman's attacks can't be retaliated.\n\nOn Enter: You may banish a fire element card from your graveyard. If you do, Blazing Bowman gets +2 POWER until end of turn.",
      abilities: [
        {
          id: "qry41lw9n0-a1",
          kind: "static",
          staticKind: "effects",
          text: "Blazing Bowman's attacks can't be retaliated.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              subject: {
                kind: "attacks-by",
                attacker: {
                  kind: "source",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qry41lw9n0-a2",
          kind: "triggered",
          text: "On Enter: You may banish a fire element card from your graveyard. If you do, Blazing Bowman gets +2 POWER until end of turn.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
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
                      kind: "source",
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
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default blazingBowman;
