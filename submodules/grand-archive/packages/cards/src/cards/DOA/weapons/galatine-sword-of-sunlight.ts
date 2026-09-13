import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const galatineSwordOfSunlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3traenEA8M",
  slug: "galatine-sword-of-sunlight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3traenEA8M:face:default",
      catalogId: "3traenEA8M",
      name: "Galatine, Sword of Sunlight",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "Whenever you activate a Sword attack card, put a durability counter on Galatine.\n\n[Class Bonus] Galatine gets +1 POWER for every three durability counters on it.",
      abilities: [
        {
          id: "3traenEA8M-a1",
          kind: "triggered",
          text: "Whenever you activate a Sword attack card, put a durability counter on Galatine.",
          trigger: {
            kind: "event",
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
                      oneOf: ["SWORD"],
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "durability",
            amount: 1,
          },
        },
        {
          id: "3traenEA8M-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Galatine gets +1 POWER for every three durability counters on it.",
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
                property: "power",
                operation: "add",
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: "durability",
                    },
                    3,
                  ],
                  rounding: "down",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default galatineSwordOfSunlight;
