import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sunderingMoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8677jq0hfm",
  slug: "sundering-moon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8677jq0hfm:face:default",
      catalogId: "8677jq0hfm",
      name: "Sundering Moon",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Jin Bonus] On Enter: If you control two or more wind element allies, Sundering Moon gets +1 POWER until end of turn.\n\n[Jin Bonus] (2), Return Sundering Moon to your material deck: Prevent the next 1 damage that would be dealt to target unit you control this turn.",
      abilities: [
        {
          id: "8677jq0hfm-a1",
          kind: "triggered",
          text: "[Jin Bonus] On Enter: If you control two or more wind element allies, Sundering Moon gets +1 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "element",
                          oneOf: ["WIND"],
                        },
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                      ],
                    },
                  },
                },
                operator: "gte",
                right: 2,
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          },
        },
        {
          id: "8677jq0hfm-a2",
          kind: "activated",
          text: "[Jin Bonus] (2), Return Sundering Moon to your material deck: Prevent the next 1 damage that would be dealt to target unit you control this turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "move-self",
                from: "field",
                to: "material-deck",
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
              amount: 1,
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

export default sunderingMoon;
