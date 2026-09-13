import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bandersnatchFrumiousFoe: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4yqL9xtzVi",
  slug: "bandersnatch-frumious-foe",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4yqL9xtzVi:face:default",
      catalogId: "4yqL9xtzVi",
      name: "Bandersnatch, Frumious Foe",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ANOMALY"],
        subtypes: ["ANOMALY", "SPECTER", "BEAST", "BEAR"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 6,
      },
      rulesText:
        "[Class Bonus] Taunt\n\nWhenever Bandersnatch is dealt damage, recover 3.\n\n(2), Sacrifice another ally:  Bandersnatch gets +2 POWER and gains cleave until end of turn.",
      abilities: [
        {
          id: "4yqL9xtzVi-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt",
          keyword: {
            name: "taunt",
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
          id: "4yqL9xtzVi-a2",
          kind: "triggered",
          text: "Whenever Bandersnatch is dealt damage, recover 3.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
        {
          id: "4yqL9xtzVi-a3",
          kind: "activated",
          text: "(2), Sacrifice another ally:  Bandersnatch gets +2 POWER and gains cleave until end of turn.",
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
                  amount: 2,
                },
              },
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
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "cleave",
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

export default bandersnatchFrumiousFoe;
