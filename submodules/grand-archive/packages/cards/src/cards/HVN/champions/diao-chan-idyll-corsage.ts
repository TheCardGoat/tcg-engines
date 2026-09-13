import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diaoChanIdyllCorsage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d7l6i5thdy",
  slug: "diao-chan-idyll-corsage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d7l6i5thdy:face:default",
      catalogId: "d7l6i5thdy",
      name: "Diao Chan, Idyll Corsage",
      lineageName: "Diao Chan",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Diao Chan Lineage\n\nOn Enter: Choose any amount of non-champion objects and put a wither counter on each of them.\n\nWhenever a non-token object an opponent controls is destroyed, you may banish it. If you do, that opponent summons a Flowerbud token.",
      abilities: [
        {
          id: "d7l6i5thdy-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Diao Chan Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Diao Chan",
          },
        },
        {
          id: "d7l6i5thdy-a2",
          kind: "triggered",
          text: "On Enter: Choose any amount of non-champion objects and put a wither counter on each of them.",
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
              id: "chosen-objects",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "each-player",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "chosen-objects",
              },
              counter: "wither",
              amount: 1,
            },
          },
        },
        {
          id: "d7l6i5thdy-a3",
          kind: "triggered",
          text: "Whenever a non-token object an opponent controls is destroyed, you may banish it. If you do, that opponent summons a Flowerbud token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-destroyed",
              subject: {
                kind: "event-object",
                controller: "opponent",
                filter: {
                  kind: "token",
                  value: false,
                },
                bindAs: "destroyed-object",
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
                  kind: "attempt",
                  bindSucceededAs: "destroyed-object-banished",
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "bound",
                      binding: "destroyed-object",
                    },
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "destroyed-object-banished",
                  },
                  then: {
                    kind: "summon",
                    object: "Flowerbud",
                    controller: "event-subject-controller",
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

export default diaoChanIdyllCorsage;
