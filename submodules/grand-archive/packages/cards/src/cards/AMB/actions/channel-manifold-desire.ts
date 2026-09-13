import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const channelManifoldDesire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kywpjf1b4k",
  slug: "channel-manifold-desire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kywpjf1b4k:face:default",
      catalogId: "kywpjf1b4k",
      name: "Channel Manifold Desire",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, banish a preserved card from your material deck. \n\nEmpower X+2, where X is the reserve cost of the banished card. Then if your Shifting Currents face North, you may put a preserved card from your material deck into your hand.",
      abilities: [
        {
          id: "kywpjf1b4k-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish a preserved card from your material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "object-state",
                  state: "preserved",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "kywpjf1b4k-a2",
          kind: "card-resolution",
          text: "Empower X+2, where X is the reserve cost of the banished card. Then if your Shifting Currents face North, you may put a preserved card from your material deck into your hand.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
                collection: {
                  zones: ["banishment"],
                  host: {
                    kind: "source",
                  },
                  relationship: "activation-payment-of",
                },
                property: "reserve-cost",
                basis: "base",
                emptyValue: 0,
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "empower",
                player: "controller",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    {
                      kind: "aggregate-property",
                      operation: "maximum",
                      collection: {
                        zones: ["banishment"],
                        host: {
                          kind: "source",
                        },
                        relationship: "activation-payment-of",
                      },
                      property: "reserve-cost",
                      basis: "base",
                      emptyValue: 0,
                    },
                    2,
                  ],
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "north",
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "preserved-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "object-state",
                          state: "preserved",
                        },
                      },
                    },
                    effect: {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "preserved-card",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
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

export default channelManifoldDesire;
