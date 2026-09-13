import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const whimsysWarden: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cworak5y4y",
  slug: "whimsys-warden",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cworak5y4y:face:default",
      catalogId: "cworak5y4y",
      name: "Whimsy's Warden",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.) \n\nAs long as you have two or more omens, Whimsy's Warden gets +2POWER.",
      abilities: [
        {
          id: "cworak5y4y-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "cworak5y4y-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have two or more omens, Whimsy's Warden gets +2POWER.",
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
                    kind: "player-property",
                    player: "controller",
                    property: "omens",
                  },
                  operator: "gte",
                  right: 2,
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

export default whimsysWarden;
