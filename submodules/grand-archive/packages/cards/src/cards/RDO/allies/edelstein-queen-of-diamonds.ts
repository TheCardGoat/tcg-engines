import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const edelsteinQueenOfDiamonds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AxHzxEHBHZ",
  slug: "edelstein-queen-of-diamonds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AxHzxEHBHZ:face:default",
      catalogId: "AxHzxEHBHZ",
      name: "Edelstein, Queen of Diamonds",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "You may banish three or more Suited Spell cards with total reserve cost 10 from your graveyard rather than pay this card’s reserve cost.\n\nOn Enter: Recover 4 and empower 4.\n\nWhenever you empower an amount, Edelstein gets +X POWER until end of turn, where X is that amount.",
      abilities: [
        {
          id: "AxHzxEHBHZ-a1",
          kind: "card-resolution",
          text: "You may banish three or more Suited Spell cards with total reserve cost 10 from your graveyard rather than pay this card’s reserve cost.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
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
                  amount: 3,
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
                        kind: "numeric",
                        comparison: {
                          left: {
                            kind: "property",
                            subject: {
                              kind: "candidate",
                            },
                            property: "reserve-cost",
                            basis: "base",
                          },
                          operator: "eq",
                          right: 10,
                        },
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SPELL"],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        {
          id: "AxHzxEHBHZ-a2",
          kind: "triggered",
          text: "On Enter: Recover 4 and empower 4.",
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
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 4,
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: 4,
              },
            ],
          },
        },
        {
          id: "AxHzxEHBHZ-a3",
          kind: "triggered",
          text: "Whenever you empower an amount, Edelstein gets +X POWER until end of turn, where X is that amount.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "empower",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "event-amount",
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: {
                kind: "variable",
                symbol: "X",
              },
            },
          },
        },
      ],
    },
  },
};

export default edelsteinQueenOfDiamonds;
