import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const camilBaskedAbundance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q5CXVeHGIf",
  slug: "camil-basked-abundance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q5CXVeHGIf:face:default",
      catalogId: "q5CXVeHGIf",
      name: "Camil, Basked Abundance",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Attack: You may put a non-advanced element VelTech item card with ally link from your hand or memory onto the field linked to Camil. Then if Camil is linked to three or more objects, draw a card into your memory.\n\nOn Leave: Put the items that were linked to Camil into your memory.",
      abilities: [
        {
          id: "q5CXVeHGIf-a1",
          kind: "triggered",
          text: "On Attack: You may put a non-advanced element VelTech item card with ally link from your hand or memory onto the field linked to Camil. Then if Camil is linked to three or more objects, draw a card into your memory.",
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
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "linked-veltech-item",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["hand", "memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "element-category",
                          value: "non-advanced",
                        },
                        {
                          kind: "subtype",
                          oneOf: ["VELTECH"],
                        },
                        {
                          kind: "type",
                          oneOf: ["ITEM"],
                        },
                        {
                          kind: "has-link-keyword",
                          target: "ally",
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "linked-veltech-item",
                  },
                  destination: {
                    zone: "field",
                    linkTo: {
                      kind: "source",
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        host: {
                          kind: "source",
                        },
                        relationship: "linked-to",
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
        {
          id: "q5CXVeHGIf-a2",
          kind: "triggered",
          text: "On Leave: Put the items that were linked to Camil into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "move",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                host: {
                  kind: "event-subject",
                },
                relationship: "linked-to",
                filter: {
                  kind: "type",
                  oneOf: ["ITEM"],
                },
              },
            },
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default camilBaskedAbundance;
