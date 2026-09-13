import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fatalTimepiece: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6gvnta6qse",
  slug: "fatal-timepiece",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6gvnta6qse:face:default",
      catalogId: "6gvnta6qse",
      name: "Fatal Timepiece",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of each player's recollection phase, if they did not materialize a card this turn, deal 2 unpreventable damage to their champion.",
      abilities: [
        {
          id: "6gvnta6qse-a1",
          kind: "triggered",
          text: "At the beginning of each player's recollection phase, if they did not materialize a card this turn, deal 2 unpreventable damage to their champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "history",
                event: "card-materialized",
                window: "this-turn",
                actor: "event-actor",
                minimum: 1,
              },
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "champion",
                player: "event-actor",
              },
              amount: 2,
              preventable: false,
            },
          },
        },
      ],
    },
  },
};

export default fatalTimepiece;
