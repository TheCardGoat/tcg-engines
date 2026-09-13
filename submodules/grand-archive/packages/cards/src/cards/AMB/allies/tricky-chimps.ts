import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trickyChimps: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bhhdb7x044",
  slug: "tricky-chimps",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bhhdb7x044:face:default",
      catalogId: "bhhdb7x044",
      name: "Tricky Chimps",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "MONKEY"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: If an opponent controls two or more allies, Tricky Chimps gets +2 POWER until end of turn.",
      abilities: [
        {
          id: "bhhdb7x044-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If an opponent controls two or more allies, Tricky Chimps gets +2 POWER until end of turn.",
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
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
                    player: "each-opponent",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
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
                amount: 2,
              },
            },
          },
        },
      ],
    },
  },
};

export default trickyChimps;
