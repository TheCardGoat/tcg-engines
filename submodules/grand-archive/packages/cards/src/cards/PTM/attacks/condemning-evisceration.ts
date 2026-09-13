import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const condemningEvisceration: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r84E55KBLM",
  slug: "condemning-evisceration",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r84E55KBLM:face:default",
      catalogId: "r84E55KBLM",
      name: "Condemning Evisceration",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["EXALTED", "WATER"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] Prepare 1\n\nOn Champion Hit: If Condemning Evisceration was prepared, you may banish a card with floating memory from your graveyard. If you do, deal 4 damage to the hit champion. ",
      abilities: [
        {
          id: "r84E55KBLM-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Prepare 1",
          keyword: {
            name: "prepare",
            value: 1,
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
          id: "r84E55KBLM-a2",
          kind: "triggered",
          text: "On Champion Hit: If Condemning Evisceration was prepared, you may banish a card with floating memory from your graveyard. If you do, deal 4 damage to the hit champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "choose",
                selection: {
                  id: "banished-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "has-keyword",
                      keyword: "floating-memory",
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "banished-card",
                      },
                      from: "graveyard",
                      destination: {
                        zone: "banishment",
                      },
                    },
                    {
                      kind: "deal-damage",
                      source: {
                        kind: "source",
                      },
                      recipient: {
                        kind: "event-recipient",
                      },
                      amount: 4,
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default condemningEvisceration;
