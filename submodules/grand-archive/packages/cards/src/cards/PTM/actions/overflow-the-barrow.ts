import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const overflowTheBarrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OiyjVzW7Av",
  slug: "overflow-the-barrow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OiyjVzW7Av:face:default",
      catalogId: "OiyjVzW7Av",
      name: "Overflow the Barrow",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "As long as you have no cards in your graveyard, this card costs 2 less to activate.\n\nPut a haunt counter on your Phantasmagoria. Then put the top X cards from your deck into your graveyard, where X is the amount of haunt counters on your Phantasmagoria.",
      abilities: [
        {
          id: "OiyjVzW7Av-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have no cards in your graveyard, this card costs 2 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["graveyard"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
                  right: 0,
                },
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
          id: "OiyjVzW7Av-a2",
          kind: "card-resolution",
          text: "Put a haunt counter on your Phantasmagoria. Then put the top X cards from your deck into your graveyard, where X is the amount of haunt counters on your Phantasmagoria.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "mastery",
                  player: "controller",
                  name: "Phantasmagoria",
                },
                counter: {
                  named: "haunt",
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "mastery",
                  player: "controller",
                  name: "Phantasmagoria",
                },
                counter: {
                  named: "haunt",
                },
                amount: 1,
              },
              {
                kind: "mill",
                player: "controller",
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "mastery",
                    player: "controller",
                    name: "Phantasmagoria",
                  },
                  counter: {
                    named: "haunt",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default overflowTheBarrow;
