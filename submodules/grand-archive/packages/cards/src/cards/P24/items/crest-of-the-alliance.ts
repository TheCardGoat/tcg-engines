import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crestOfTheAlliance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ojwk0pw0y6",
  slug: "crest-of-the-alliance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ojwk0pw0y6:face:default",
      catalogId: "ojwk0pw0y6",
      name: "Crest of the Alliance",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever a fostered ally you control dies, you may banish Crest of the Alliance. If you do, draw a card.",
      abilities: [
        {
          id: "ojwk0pw0y6-a1",
          kind: "triggered",
          text: "Whenever a fostered ally you control dies, you may banish Crest of the Alliance. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "fostered",
                    },
                  ],
                },
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
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "source",
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
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

export default crestOfTheAlliance;
