import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const siphoningStab: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iZRVjvAZVG",
  slug: "siphoning-stab",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iZRVjvAZVG:face:default",
      catalogId: "iZRVjvAZVG",
      name: "Siphoning Stab",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
      },
      rulesText:
        '[Class Bonus] As long as the attacker is attacking using a Polearm weapon, Siphoning Stab has "On Hit: Recover X, where X is the amount of damage dealt by this hit."',
      abilities: [
        {
          id: "iZRVjvAZVG-a1",
          kind: "static",
          staticKind: "effects",
          text: '[Class Bonus] As long as the attacker is attacking using a Polearm weapon, Siphoning Stab has "On Hit: Recover X, where X is the amount of damage dealt by this hit."',
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "related",
                  subject: {
                    kind: "source",
                  },
                  relation: "attacker",
                },
                usingFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POLEARM"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-zjtwd7-a1",
                  kind: "triggered",
                  text: "On Hit: Recover X, where X is the amount of damage dealt by this hit.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-hit",
                      subject: {
                        kind: "ability-bearer",
                      },
                    },
                  },
                  variables: [
                    {
                      symbol: "X",
                      kind: "derived",
                      amount: {
                        kind: "modified-ability-result-amount",
                        metric: "damage-dealt",
                      },
                    },
                  ],
                  effect: {
                    kind: "recover",
                    player: "controller",
                    amount: {
                      kind: "modified-ability-result-amount",
                      metric: "damage-dealt",
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default siphoningStab;
