import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crimsonVein: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QwF7kvdpFz",
  slug: "crimson-vein",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QwF7kvdpFz:face:default",
      catalogId: "QwF7kvdpFz",
      name: "Crimson Vein",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "ARTIFACT"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "[Class Bonus] Crimson Vein enters the field with three blood counters on it.\n\nWhenever you recover, put a blood counter on Crimson Vein.\n\nYour champion gets +XLIFE, where X is the amount of blood counters on Crimson Vein.\n\n\n\n",
      abilities: [
        {
          id: "QwF7kvdpFz-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Crimson Vein enters the field with three blood counters on it.",
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
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: {
                      named: "blood",
                    },
                    amount: 3,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "QwF7kvdpFz-a2",
          kind: "triggered",
          text: "Whenever you recover, put a blood counter on Crimson Vein.",
          trigger: {
            kind: "event",
            event: {
              name: "player-recovered",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "blood",
            },
            amount: 1,
          },
        },
        {
          id: "QwF7kvdpFz-a3",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +XLIFE, where X is the amount of blood counters on Crimson Vein.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "blood",
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default crimsonVein;
