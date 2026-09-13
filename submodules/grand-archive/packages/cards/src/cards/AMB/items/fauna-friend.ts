import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const faunaFriend: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "japulzj7gv",
  slug: "fauna-friend",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "japulzj7gv:face:default",
      catalogId: "japulzj7gv",
      name: "Fauna Friend",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST: Target non-Human ally gets +1 POWER until end of turn. Activate this ability only if you have two or more non-Human ally cards in your graveyard.",
      abilities: [
        {
          id: "japulzj7gv-a1",
          kind: "activated",
          text: "REST: Target non-Human ally gets +1 POWER until end of turn. Activate this ability only if you have two or more non-Human ally cards in your graveyard.",
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
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "not",
                        filter: {
                          kind: "subtype",
                          oneOf: ["HUMAN"],
                        },
                      },
                    ],
                  },
                },
              },
              operator: "gte",
              right: 2,
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
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
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default faunaFriend;
