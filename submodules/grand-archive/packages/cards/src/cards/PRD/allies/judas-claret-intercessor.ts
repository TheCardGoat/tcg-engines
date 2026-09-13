import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const judasClaretIntercessor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AbjQkcN57S",
  slug: "judas-claret-intercessor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AbjQkcN57S:face:default",
      catalogId: "AbjQkcN57S",
      name: "Judas, Claret Intercessor",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE", "WARRIOR"],
        subtypes: ["MAGE", "WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "Whenever a player sacrifices an ally, put a buff counter on Judas.\n\n[Class Bonus] Sacrifice another ally: Judas gains spellshroud until end of turn.\n\n[Class Bonus] (2), Sacrifice another ally: Draw a card into your memory and empower 2.",
      abilities: [
        {
          id: "AbjQkcN57S-a1",
          kind: "triggered",
          text: "Whenever a player sacrifices an ally, put a buff counter on Judas.",
          trigger: {
            kind: "event",
            event: {
              name: "object-sacrificed",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "AbjQkcN57S-a2",
          kind: "activated",
          text: "[Class Bonus] Sacrifice another ally: Judas gains spellshroud until end of turn.",
          activation: "ability",
          cost: {
            kind: "select-and-sacrifice",
            player: "controller",
            count: {
              kind: "exactly",
              amount: 1,
            },
            bindResultAs: "sacrificed-object",
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                {
                  kind: "not-source",
                },
              ],
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
        {
          id: "AbjQkcN57S-a3",
          kind: "activated",
          text: "[Class Bonus] (2), Sacrifice another ally: Draw a card into your memory and empower 2.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default judasClaretIntercessor;
