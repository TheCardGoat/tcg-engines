import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const penetratorRound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "97n2jnltv5",
  slug: "penetrator-round",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "97n2jnltv5:face:default",
      catalogId: "97n2jnltv5",
      name: "Penetrator Round",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["FIRE"],
      stats: {
        power: 0,
      },
      rulesText:
        'Renewable\n\nREST: Load Penetrator Round into target unloaded Gun weapon you control. \n\n[Class Bonus] [Level 2+] On Attack: This attack gains "Combat damage dealt by this attack is unpreventable."',
      abilities: [
        {
          id: "97n2jnltv5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "97n2jnltv5-a2",
          kind: "activated",
          text: "REST: Load Penetrator Round into target unloaded Gun weapon you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "97n2jnltv5-a3",
          kind: "triggered",
          text: '[Class Bonus] [Level 2+] On Attack: This attack gains "Combat damage dealt by this attack is unpreventable."',
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
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
              kind: "permanent",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-dp8szm-a1",
                kind: "static",
                staticKind: "effects",
                text: "Combat damage dealt by this attack is unpreventable.",
                effects: [
                  {
                    kind: "rule-modification",
                    mode: "forbid",
                    action: "prevent-damage",
                    using: {
                      kind: "source",
                    },
                    damageKind: "combat",
                    duration: {
                      kind: "while-source-in-functional-zone",
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default penetratorRound;
