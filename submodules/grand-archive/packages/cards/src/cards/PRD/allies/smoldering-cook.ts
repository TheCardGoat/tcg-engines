import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const smolderingCook: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HtxzN0sQCJ",
  slug: "smoldering-cook",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HtxzN0sQCJ:face:default",
      catalogId: "HtxzN0sQCJ",
      name: "Smoldering Cook",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "RANGER"],
        subtypes: ["CLERIC", "RANGER", "KITCHEN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)\n\nREST, Sacrifice a Food item: Deal 3 damage to target champion. ",
      abilities: [
        {
          id: "HtxzN0sQCJ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
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
          id: "HtxzN0sQCJ-a2",
          kind: "activated",
          text: "REST, Sacrifice a Food item: Deal 3 damage to target champion.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
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
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FOOD"],
                    },
                  ],
                },
              },
            ],
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default smolderingCook;
