import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pepperedChef: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lcy0lw1veb",
  slug: "peppered-chef",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lcy0lw1veb:face:default",
      catalogId: "lcy0lw1veb",
      name: "Peppered Chef",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "On Enter: You may sacrifice another ally. If you do, Peppered Chef gets +2POWER until end of turn.",
      abilities: [
        {
          id: "lcy0lw1veb-a1",
          kind: "triggered",
          text: "On Enter: You may sacrifice another ally. If you do, Peppered Chef gets +2POWER until end of turn.",
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
                    kind: "choose",
                    selection: {
                      id: "sacrificed-object",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
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
                              oneOf: ["ALLY"],
                            },
                            {
                              kind: "not-source",
                            },
                          ],
                        },
                      },
                    },
                    effect: {
                      kind: "sacrifice",
                      subject: {
                        kind: "bound",
                        binding: "sacrificed-object",
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

export default pepperedChef;
