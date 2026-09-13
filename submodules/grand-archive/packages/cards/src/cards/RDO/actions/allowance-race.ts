import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const allowanceRace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ezIeRDL7jm",
  slug: "allowance-race",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ezIeRDL7jm:face:default",
      catalogId: "ezIeRDL7jm",
      name: "Allowance Race",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HORSE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Each player may rest up to two Horse allies they control. For each Horse ally rested this way, its controller draws a card.",
      abilities: [
        {
          id: "ezIeRDL7jm-a1",
          kind: "card-resolution",
          text: "Each player may rest up to two Horse allies they control. For each Horse ally rested this way, its controller draws a card.",
          effect: {
            kind: "for-each-player",
            players: "each-player",
            bindEachAs: "racing-player",
            effect: {
              kind: "choose",
              selection: {
                id: "rested-horses",
                kind: "choice",
                declared: "resolution",
                chooser: {
                  binding: "racing-player",
                },
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: {
                    binding: "racing-player",
                  },
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
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "rest",
                    subject: {
                      kind: "bound",
                      binding: "rested-horses",
                    },
                  },
                  {
                    kind: "draw",
                    player: {
                      binding: "racing-player",
                    },
                    amount: {
                      kind: "count",
                      collection: {
                        binding: "rested-horses",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default allowanceRace;
