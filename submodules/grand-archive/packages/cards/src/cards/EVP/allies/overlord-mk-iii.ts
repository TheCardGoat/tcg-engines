import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const overlordMkIii: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sl7ddcgw05",
  slug: "overlord-mk-iii",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sl7ddcgw05:face:default",
      catalogId: "sl7ddcgw05",
      name: "Overlord Mk III",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 5,
        life: 5,
      },
      rulesText:
        "As an additional cost to activate this card, sacrifice four Powercells.\n\nIntercept, Spellshroud, Steadfast, True Sight\n\nAt the beginning of your end phase, you may banish an Automaton card from your graveyard. If you do, put a buff counter on Overlord Mk III and draw a card.",
      abilities: [
        {
          id: "sl7ddcgw05-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice four Powercells.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 4,
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "sl7ddcgw05-a2",
          kind: "keyword-group",
          text: "Intercept, Spellshroud, Steadfast, True Sight",
          keywords: [
            {
              name: "intercept",
            },
            {
              name: "spellshroud",
            },
            {
              name: "steadfast",
            },
            {
              name: "true-sight",
            },
          ],
        },
        {
          id: "sl7ddcgw05-a3",
          kind: "triggered",
          text: "At the beginning of your end phase, you may banish an Automaton card from your graveyard. If you do, put a buff counter on Overlord Mk III and draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
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
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["AUTOMATON"],
                        },
                      },
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
                    kind: "sequence",
                    effects: [
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "source",
                        },
                        counter: "buff",
                        amount: 1,
                      },
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                    ],
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

export default overlordMkIii;
