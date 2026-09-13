import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ritaiStablemaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ba0tqvwlp1",
  slug: "ritai-stablemaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ba0tqvwlp1:face:default",
      catalogId: "ba0tqvwlp1",
      name: "Ritai Stablemaster",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Equestrian — On Enter: If you control a Horse ally, you may discard up to two fire element cards. For each card discarded this way, draw a card into your memory.\n\nHorse cards you activate have kindle 3.",
      abilities: [
        {
          id: "ba0tqvwlp1-a1",
          kind: "triggered",
          text: "Equestrian — On Enter: If you control a Horse ally, you may discard up to two fire element cards. For each card discarded this way, draw a card into your memory.",
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
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["HORSE"],
                        },
                      ],
                    },
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "up-to",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "discarded-card",
                },
                bindEachAs: "that-card",
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
          label: {
            name: "Equestrian",
          },
        },
        {
          id: "ba0tqvwlp1-a2",
          kind: "static",
          staticKind: "effects",
          text: "Horse cards you activate have kindle 3.",
          effects: [
            {
              kind: "rule-modification",
              mode: "grant-keyword",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "subtype",
                oneOf: ["HORSE"],
              },
              grantedKeyword: {
                name: "kindle",
                value: 3,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default ritaiStablemaster;
