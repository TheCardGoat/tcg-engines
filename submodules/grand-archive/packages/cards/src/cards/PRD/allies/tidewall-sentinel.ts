import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidewallSentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ncod1l0Oby",
  slug: "tidewall-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ncod1l0Oby:face:default",
      catalogId: "ncod1l0Oby",
      name: "Tidewall Sentinel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Taunt\n\nOn Enter: You may banish a card with floating memory from your graveyard. If you do, draw a card and put a bulwark counter on Tidewall Sentinel. (If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
      abilities: [
        {
          id: "ncod1l0Oby-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "ncod1l0Oby-a2",
          kind: "triggered",
          text: "On Enter: You may banish a card with floating memory from your graveyard. If you do, draw a card and put a bulwark counter on Tidewall Sentinel. (If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
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
                          kind: "has-keyword",
                          keyword: "floating-memory",
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
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "source",
                        },
                        counter: "bulwark",
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

export default tidewallSentinel;
