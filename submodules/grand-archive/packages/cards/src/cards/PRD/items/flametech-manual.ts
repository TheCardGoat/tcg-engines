import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flametechManual: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WZJxZMBAir",
  slug: "flametech-manual",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WZJxZMBAir:face:default",
      catalogId: "WZJxZMBAir",
      name: "FlameTech Manual",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "VELTECH", "BOOK"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] REST, Banish a fire element card from your graveyard: Cascade— \n• 1— Deal 2 damage to target champion.\n• 2— Empower 2. \n• 3— Sacrifice FlameTech Manual and empower 2. Then draw a card into your memory.",
      abilities: [
        {
          id: "WZJxZMBAir-a1",
          kind: "activated",
          text: "[Class Bonus] REST, Banish a fire element card from your graveyard: Cascade—\n• 1— Deal 2 damage to target champion.\n• 2— Empower 2.\n• 3— Sacrifice FlameTech Manual and empower 2. Then draw a card into your memory.",
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
                  kind: "element",
                  oneOf: ["FIRE"],
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
                text: "Deal 2 damage to target champion.",
                counts: [1],
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
                  amount: 2,
                },
              },
              {
                id: "cascade-2",
                text: "Empower 2.",
                counts: [2],
                effect: {
                  kind: "keyword-action",
                  action: "empower",
                  amount: 2,
                },
              },
              {
                id: "cascade-3",
                text: "Sacrifice FlameTech Manual and empower 2. Then draw a card into your memory.",
                counts: [3],
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "sacrifice",
                          subject: {
                            kind: "source",
                          },
                        },
                        {
                          kind: "keyword-action",
                          action: "empower",
                          amount: 2,
                        },
                      ],
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                      to: "memory",
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

export default flametechManual;
