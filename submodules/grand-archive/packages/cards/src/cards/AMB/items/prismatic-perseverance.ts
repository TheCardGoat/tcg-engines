import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prismaticPerseverance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x3ljhn5iu9",
  slug: "prismatic-perseverance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x3ljhn5iu9:face:default",
      catalogId: "x3ljhn5iu9",
      name: "Prismatic Perseverance",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "[Level 2+] [Damage 15+] All elements are enabled for you.",
      abilities: [
        {
          id: "x3ljhn5iu9-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] [Damage 15+] All elements are enabled for you.",
          restrictions: [
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
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 15,
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "ALL",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default prismaticPerseverance;
