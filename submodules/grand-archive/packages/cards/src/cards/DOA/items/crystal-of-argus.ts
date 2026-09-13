import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystalOfArgus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j5iQQPd2m5",
  slug: "crystal-of-argus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j5iQQPd2m5:face:default",
      catalogId: "j5iQQPd2m5",
      name: "Crystal of Argus",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] Your champion gets +1 level for every three enlighten counters on them. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "j5iQQPd2m5-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Your champion gets +1 level for every three enlighten counters on them. (Apply this effect only if your champion's class matches this card's class.)",
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
                property: "level",
                operation: "add",
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "enlighten",
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

export default crystalOfArgus;
