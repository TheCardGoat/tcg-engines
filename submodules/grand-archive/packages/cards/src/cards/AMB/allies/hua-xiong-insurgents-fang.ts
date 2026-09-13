import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const huaXiongInsurgentsFang: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TvugEkGGVd",
  slug: "hua-xiong-insurgents-fang",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TvugEkGGVd:face:default",
      catalogId: "TvugEkGGVd",
      name: "Hua Xiong, Insurgent's Fang",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "Vigor\n\n[Jin Bonus] Polearm attack cards you activate enter the intent with +2POWER.\n\n[Jin Bonus] REST, Discard a Polearm attack card: Prevent the next 2 damage that would be dealt to target unit you control this turn.",
      abilities: [
        {
          id: "TvugEkGGVd-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor",
          keyword: {
            name: "vigor",
          },
        },
        {
          id: "TvugEkGGVd-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Jin Bonus] Polearm attack cards you activate enter the intent with +2POWER.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "card-activated",
                actor: "controller",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ATTACK"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["POLEARM"],
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "modify-characteristic",
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TvugEkGGVd-a3",
          kind: "activated",
          text: "[Jin Bonus] REST, Discard a Polearm attack card: Prevent the next 2 damage that would be dealt to target unit you control this turn.",
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
                kind: "select-and-move",
                player: "controller",
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ATTACK"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POLEARM"],
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default huaXiongInsurgentsFang;
