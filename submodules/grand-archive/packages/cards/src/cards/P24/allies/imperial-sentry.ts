import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialSentry: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "plywc08c9h",
  slug: "imperial-sentry",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "plywc08c9h:face:default",
      catalogId: "plywc08c9h",
      name: "Imperial Sentry",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally. Apply this effect only if your champion's class matches this card's class.) \n\n[Level 2+] Imperial Sentry gets +1 LIFE.",
      abilities: [
        {
          id: "plywc08c9h-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "intercept",
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
        },
        {
          id: "plywc08c9h-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] Imperial Sentry gets +1 LIFE.",
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

export default imperialSentry;
