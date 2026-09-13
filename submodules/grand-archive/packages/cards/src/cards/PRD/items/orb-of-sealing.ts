import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const orbOfSealing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mekutzp19y",
  slug: "orb-of-sealing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mekutzp19y:face:default",
      catalogId: "mekutzp19y",
      name: "Orb of Sealing",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST: Put a seal counter on up to two target face up non-champion non-regalia cards in a single banishment and turn them face down.\n\nOn Leave: Remove all seal counters from all cards in each banishment. If a card had a seal counter removed from it this way, turn it face up.",
      abilities: [
        {
          id: "mekutzp19y-a1",
          kind: "activated",
          text: "REST: Put a seal counter on up to two target face up non-champion non-regalia cards in a single banishment and turn them face down.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: {
              named: "seal",
            },
            amount: 1,
          },
        },
        {
          id: "mekutzp19y-a2",
          kind: "triggered",
          text: "On Leave: Remove all seal counters from all cards in each banishment. If a card had a seal counter removed from it this way, turn it face up.",
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
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["banishment"],
                    player: "each-player",
                    filter: {
                      kind: "has-counter",
                      counter: {
                        named: "seal",
                      },
                    },
                  },
                },
                counter: {
                  named: "seal",
                },
                amount: {
                  kind: "all",
                },
                bindResultAs: "unsealed-cards",
              },
              {
                kind: "set-card-facing",
                subject: {
                  kind: "bound",
                  binding: "unsealed-cards",
                },
                facing: "face-up",
              },
            ],
          },
        },
      ],
    },
  },
};

export default orbOfSealing;
