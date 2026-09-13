import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const supplyDrone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ljyevpmu6g",
  slug: "supply-drone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ljyevpmu6g:face:default",
      catalogId: "ljyevpmu6g",
      name: "Supply Drone",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "[Class Bonus] At the beginning of your recollection phase, materialize a Bullet card with memory cost 0 from your material deck. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "ljyevpmu6g-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, materialize a Bullet card with memory cost 0 from your material deck. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
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
                    {
                      kind: "subtype",
                      oneOf: ["BULLET"],
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

export default supplyDrone;
