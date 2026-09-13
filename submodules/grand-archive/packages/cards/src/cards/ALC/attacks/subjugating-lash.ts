import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const subjugatingLash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bcizm6h38l",
  slug: "subjugating-lash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bcizm6h38l:face:default",
      catalogId: "bcizm6h38l",
      name: "Subjugating Lash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "LASH"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "As long as your champion has twelve or more damage counters on them, Subjugating Lash gets +2 POWER.",
      abilities: [
        {
          id: "bcizm6h38l-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your champion has twelve or more damage counters on them, Subjugating Lash gets +2 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
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
                  right: 12,
                },
              },
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default subjugatingLash;
