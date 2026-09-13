import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const callThePack: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mdiK8UC78c",
  slug: "call-the-pack",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mdiK8UC78c:face:default",
      catalogId: "mdiK8UC78c",
      name: "Call the Pack",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nFor each Animal ally you control, you may put a Beast ally card from your hand onto the field.",
      abilities: [
        {
          id: "mdiK8UC78c-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "mdiK8UC78c-a2",
          kind: "card-resolution",
          text: "For each Animal ally you control, you may put a Beast ally card from your hand onto the field.",
          effect: {
            kind: "repeat",
            count: {
              kind: "count",
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
                      oneOf: ["ANIMAL"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "choose",
                selection: {
                  id: "chosen-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
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
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "chosen-card",
                  },
                  from: "hand",
                  destination: {
                    zone: "field",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default callThePack;
