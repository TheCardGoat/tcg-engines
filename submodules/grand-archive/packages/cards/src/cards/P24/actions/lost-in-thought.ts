import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lostInThought: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "egbscxwjbq",
  slug: "lost-in-thought",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "egbscxwjbq:face:default",
      catalogId: "egbscxwjbq",
      name: "Lost in Thought",
      cost: {
        kind: "reserve",
        amount: {
          kind: "variable",
          symbol: "X",
        },
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may banish up to X cards with floating memory from your graveyard. Draw a card for each card banished this way.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "egbscxwjbq-a1",
          kind: "card-resolution",
          text: "You may banish up to X cards with floating memory from your graveyard. Draw a card for each card banished this way.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: {
                        kind: "variable",
                        symbol: "X",
                      },
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
                      },
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: {
                    kind: "modified-ability-result-amount",
                    metric: "cards-moved",
                  },
                },
              ],
            },
          },
        },
        {
          id: "egbscxwjbq-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default lostInThought;
