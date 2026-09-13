import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aliceWhimsMonarch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9K4etFOi4M",
  slug: "alice-whims-monarch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9K4etFOi4M:face:default",
      catalogId: "9K4etFOi4M",
      name: "Alice, Whim's Monarch",
      lineageName: "Alice",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "QUEEN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Alice Lineage\n\nOn Enter: Glimpse 3, then reveal the top card of your deck. If that card is a Chessman card, put it into your hand.\n\nREST: If you don't control a Pawn ally, summon a Pawn Piece Token.",
      abilities: [
        {
          id: "9K4etFOi4M-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Alice Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Alice",
          },
        },
        {
          id: "9K4etFOi4M-a2",
          kind: "triggered",
          text: "On Enter: Glimpse 3, then reveal the top card of your deck. If that card is a Chessman card, put it into your hand.",
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
                kind: "sequence",
                effects: [
                  {
                    kind: "keyword-action",
                    action: "glimpse",
                    amount: 3,
                  },
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "referenced-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["main-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        fromTop: true,
                      },
                    },
                  },
                ],
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["CHESSMAN"],
                  },
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  destination: {
                    zone: "hand",
                  },
                },
              },
            ],
          },
        },
        {
          id: "9K4etFOi4M-a3",
          kind: "activated",
          text: "REST: If you don't control a Pawn ally, summon a Pawn Piece Token.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
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
                        oneOf: ["PAWN"],
                      },
                    ],
                  },
                },
              },
            },
            then: {
              kind: "summon",
              object: "Pawn Piece",
              controller: "controller",
              bindResultAs: "summoned-token",
            },
          },
        },
      ],
    },
  },
};

export default aliceWhimsMonarch;
