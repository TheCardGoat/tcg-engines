import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineWanderingWarrior: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DpHDGaX2Pn",
  slug: "lorraine-wandering-warrior",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DpHDGaX2Pn:face:default",
      catalogId: "DpHDGaX2Pn",
      name: "Lorraine, Wandering Warrior",
      lineageName: "Lorraine",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText: "On Enter: Materialize a weapon card with memory cost 0 from your material deck.",
      abilities: [
        {
          id: "DpHDGaX2Pn-a1",
          kind: "triggered",
          text: "On Enter: Materialize a weapon card with memory cost 0 from your material deck.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "memory-cost",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 0,
                      },
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
};

export default lorraineWanderingWarrior;
