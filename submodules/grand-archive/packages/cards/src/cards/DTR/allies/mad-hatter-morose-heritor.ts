import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const madHatterMoroseHeritor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2nc48s3oqh",
  slug: "mad-hatter-morose-heritor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2nc48s3oqh:face:default",
      catalogId: "2nc48s3oqh",
      name: "Mad Hatter, Morose Heritor",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)\n\nOn Enter: You may banish a card at random from your material deck. If you do, materialize a Ranger regalia card from your material deck.",
      abilities: [
        {
          id: "2nc48s3oqh-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)",
          keyword: {
            name: "ranged",
            value: 3,
          },
        },
        {
          id: "2nc48s3oqh-a2",
          kind: "triggered",
          text: "On Enter: You may banish a card at random from your material deck. If you do, materialize a Ranger regalia card from your material deck.",
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
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                      method: "random",
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
                          kind: "all",
                          filters: [
                            {
                              kind: "supertype",
                              oneOf: ["REGALIA"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["RANGER"],
                            },
                          ],
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
              ],
            },
          },
        },
      ],
    },
  },
};

export default madHatterMoroseHeritor;
