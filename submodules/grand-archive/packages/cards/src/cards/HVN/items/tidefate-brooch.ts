import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidefateBrooch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vubaywkr69",
  slug: "tidefate-brooch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vubaywkr69:face:default",
      catalogId: "vubaywkr69",
      name: "Tidefate Brooch",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "At the beginning of your end phase, put X refinement counters on Tidefate Brooch, where X is the amount of Fatestone and/or Fatebound objects you control.\n(3), Banish Tidefate Brooch: Put the top ten cards of your deck into your graveyard. Activate this ability only if there are ten or more refinement counters on Tidefate Brooch.",
      abilities: [
        {
          id: "vubaywkr69-a1",
          kind: "triggered",
          text: "At the beginning of your end phase, put X refinement counters on Tidefate Brooch, where X is the amount of Fatestone and/or Fatebound objects you control.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["FATESTONE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["FATEBOUND"],
                      },
                    ],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "vubaywkr69-a2",
          kind: "activated",
          text: "(3), Banish Tidefate Brooch: Put the top ten cards of your deck into your graveyard. Activate this ability only if there are ten or more refinement counters on Tidefate Brooch.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          condition: {
            kind: "has-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
              },
              operator: "gte",
              right: 10,
            },
          },
          effect: {
            kind: "mill",
            player: "controller",
            amount: 10,
          },
        },
      ],
    },
  },
};

export default tidefateBrooch;
