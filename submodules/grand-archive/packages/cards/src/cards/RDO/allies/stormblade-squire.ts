import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stormbladeSquire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2hlW5LWSTe",
  slug: "stormblade-squire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2hlW5LWSTe:face:default",
      catalogId: "2hlW5LWSTe",
      name: "Stormblade Squire",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "On Attack: You may banish a card at random from your memory. If you do, scavenge 2+X for an arcane element card, where X is the reserve cost of the banished card.",
      abilities: [
        {
          id: "2hlW5LWSTe-a1",
          kind: "triggered",
          text: "On Attack: You may banish a card at random from your memory. If you do, scavenge 2+X for an arcane element card, where X is the reserve cost of the banished card.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "banished-cards",
                },
                property: "reserve-cost",
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
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
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                    method: "random",
                  },
                },
                {
                  kind: "keyword-action",
                  action: "scavenge",
                  amount: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      2,
                      {
                        kind: "variable",
                        symbol: "X",
                      },
                    ],
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["ARCANE"],
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

export default stormbladeSquire;
