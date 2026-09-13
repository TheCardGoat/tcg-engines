import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tonorisCreationsWill: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n2jnltv5kl",
  slug: "tonoris-creations-will",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n2jnltv5kl:face:default",
      catalogId: "n2jnltv5kl",
      name: "Tonoris, Creation's Will",
      lineageName: "Tonoris",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NEOS"],
      stats: {
        level: 3,
        life: 30,
      },
      rulesText:
        'Tonoris Lineage\n\nIf you would summon one or more tokens, you may summon that many Aurousteel Greatsword tokens instead.\n\nToken weapons you control have "Sacrifice this object: Target weapon gets +X POWER until end of turn where X is this object\'s power."',
      abilities: [
        {
          id: "n2jnltv5kl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Tonoris Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Tonoris",
          },
        },
        {
          id: "n2jnltv5kl-a2",
          kind: "static",
          staticKind: "effects",
          text: "If you would summon one or more tokens, you may summon that many Aurousteel Greatsword tokens instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "tokens-summoned",
                actor: "controller",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "token",
                    value: true,
                  },
                },
              },
              optionalFor: "controller",
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "summon",
                  object: "Aurousteel Greatsword",
                  controller: "controller",
                  amount: {
                    kind: "event-amount",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "n2jnltv5kl-a3",
          kind: "static",
          staticKind: "effects",
          text: 'Token weapons you control have "Sacrifice this object: Target weapon gets +X POWER until end of turn where X is this object\'s power."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "token",
                        value: true,
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
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
                  id: "granted-n2jnltv5kl-a3",
                  kind: "activated",
                  text: "Sacrifice this object: Target weapon gets +X POWER until end of turn where X is this object's power.",
                  activation: "ability",
                  cost: {
                    kind: "sacrifice",
                    subject: {
                      kind: "source",
                    },
                  },
                  variables: [
                    {
                      symbol: "X",
                      kind: "derived",
                      amount: {
                        kind: "property",
                        subject: {
                          kind: "source",
                        },
                        property: "power",
                        basis: "last-known",
                      },
                    },
                  ],
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
                        filter: {
                          kind: "type",
                          oneOf: ["WEAPON"],
                        },
                      },
                    },
                  ],
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "bound",
                      binding: "target-weapon",
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
                      amount: {
                        kind: "variable",
                        symbol: "X",
                      },
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

export default tonorisCreationsWill;
