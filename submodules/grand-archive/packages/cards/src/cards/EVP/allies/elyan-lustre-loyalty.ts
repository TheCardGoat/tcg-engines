import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const elyanLustreLoyalty: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2jgiM0p4dt",
  slug: "elyan-lustre-loyalty",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2jgiM0p4dt:face:default",
      catalogId: "2jgiM0p4dt",
      name: "Elyan, Lustre Loyalty",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Stealth\n\n[Class Bonus] Whenever you recover an amount, Elyan gets +XPOWER until end of turn, where X is that amount. Then if X is 4 or more, Elyan gains unblockable until end of turn.",
      abilities: [
        {
          id: "2jgiM0p4dt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth",
          keyword: {
            name: "stealth",
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
        },
        {
          id: "2jgiM0p4dt-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you recover an amount, Elyan gets +XPOWER until end of turn, where X is that amount. Then if X is 4 or more, Elyan gains unblockable until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "player-recovered",
              actor: "controller",
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
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "variable",
                      symbol: "X",
                    },
                    operator: "gte",
                    right: 4,
                  },
                },
                then: {
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
                      name: "unblockable",
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

export default elyanLustreLoyalty;
