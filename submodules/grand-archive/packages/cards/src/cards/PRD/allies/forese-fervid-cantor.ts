import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const foreseFervidCantor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "BoQUtdry1C",
  slug: "forese-fervid-cantor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "BoQUtdry1C:face:default",
      catalogId: "BoQUtdry1C",
      name: "Forese, Fervid Cantor",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "Whenever you activate a Harmony or Melody card, you may rest Forese. If you do, scavenge 5 for a non-advanced element Resonator ally card with reserve cost 3 or less. Put the scavenged card onto the field rather than into your hand.",
      abilities: [
        {
          id: "BoQUtdry1C-a1",
          kind: "triggered",
          text: "Whenever you activate a Harmony or Melody card, you may rest Forese. If you do, scavenge 5 for a non-advanced element Resonator ally card with reserve cost 3 or less. Put the scavenged card onto the field rather than into your hand.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "any",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["HARMONY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["MELODY"],
                    },
                  ],
                },
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
                  kind: "rest",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "keyword-action",
                  action: "scavenge",
                  player: "controller",
                  amount: 5,
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element-category",
                        value: "non-advanced",
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["RESONATOR"],
                      },
                      {
                        kind: "numeric",
                        comparison: {
                          left: {
                            kind: "property",
                            subject: {
                              kind: "candidate",
                            },
                            property: "reserve-cost",
                            basis: "base",
                          },
                          operator: "lte",
                          right: 3,
                        },
                      },
                    ],
                  },
                  resultDestination: {
                    zone: "field",
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

export default foreseFervidCantor;
