import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const longtailGrovesward: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jn4mwv930y",
  slug: "longtail-grovesward",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jn4mwv930y:face:default",
      catalogId: "jn4mwv930y",
      name: "Longtail Grovesward",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "TAMER"],
        subtypes: ["GUARDIAN", "TAMER", "ANIMAL", "HUMAN", "MOUSE"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Fast Activation (You may activate this card at fast speed.)\n\n[Level 1+] Longtail Grovesward gets +1LIFE.",
      abilities: [
        {
          id: "jn4mwv930y-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "jn4mwv930y-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] Longtail Grovesward gets +1LIFE.",
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
                  right: 1,
                },
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
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default longtailGrovesward;
