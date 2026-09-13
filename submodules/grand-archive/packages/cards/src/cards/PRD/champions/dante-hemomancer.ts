import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const danteHemomancer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4FtNBFaOJp",
  slug: "dante-hemomancer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4FtNBFaOJp:face:default",
      catalogId: "4FtNBFaOJp",
      name: "Dante, Hemomancer",
      lineageName: "Dante",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Dante Lineage\n\nWhenever an empowered Spell action source you control deals damage for the first time, you may recover 2.\n\n(X), REST: Deal X unpreventable damage to Dante and empower X. X can't be 0 or greater than 4.",
      abilities: [
        {
          id: "4FtNBFaOJp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Dante Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Dante",
          },
        },
        {
          id: "4FtNBFaOJp-a2",
          kind: "triggered",
          text: "Whenever an empowered Spell action source you control deals damage for the first time, you may recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                    {
                      kind: "activation-state",
                      state: "empowered",
                    },
                  ],
                },
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "recover",
              player: "controller",
              amount: 2,
            },
          },
        },
        {
          id: "4FtNBFaOJp-a3",
          kind: "activated",
          text: "(X), REST: Deal X unpreventable damage to Dante and empower X. X can't be 0 or greater than 4.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 1,
              maximum: 4,
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "source",
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
                preventable: false,
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default danteHemomancer;
