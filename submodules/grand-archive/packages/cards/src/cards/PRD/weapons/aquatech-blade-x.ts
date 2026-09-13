import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aquatechBladeX: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WI5oMtzP3W",
  slug: "aquatech-blade-x",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WI5oMtzP3W:face:default",
      catalogId: "WI5oMtzP3W",
      name: "AquaTech Blade X",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "SWORD"],
      },
      elements: ["EXALTED", "WATER"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "As long as you control a VelTech item, this card costs 1 less to materialize.\n\n[Class Bonus] REST, Banish a card with floating memory from your graveyard: Cascade— \n• 1— AquaTech Blade X gets +3POWER until end of turn. \n• 2— Recover 4. \n• 3— AquaTech Blade X gets +5POWER until end of turn. Then recover 5.",
      abilities: [
        {
          id: "WI5oMtzP3W-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a VelTech item, this card costs 1 less to materialize.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ITEM"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["VELTECH"],
                      },
                    ],
                  },
                },
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "WI5oMtzP3W-a2",
          kind: "activated",
          text: "[Class Bonus] REST, Banish a card with floating memory from your graveyard: Cascade—\n• 1— AquaTech Blade X gets +3POWER until end of turn.\n• 2— Recover 4.\n• 3— AquaTech Blade X gets +5POWER until end of turn. Then recover 5.",
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
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "has-keyword",
                  keyword: "floating-memory",
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
          cascade: {
            kind: "cascade",
            advanceOn: "activation",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                text: "AquaTech Blade X gets +3POWER until end of turn.",
                counts: [1],
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
                    amount: 3,
                  },
                },
              },
              {
                id: "cascade-2",
                text: "Recover 4.",
                counts: [2],
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 4,
                },
              },
              {
                id: "cascade-3",
                text: "AquaTech Blade X gets +5POWER until end of turn. Then recover 5.",
                counts: [3],
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
                        amount: 5,
                      },
                    },
                    {
                      kind: "recover",
                      player: "controller",
                      amount: 5,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default aquatechBladeX;
