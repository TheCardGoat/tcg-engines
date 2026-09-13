import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const formidableYouxia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "acmde97dbu",
  slug: "formidable-youxia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "acmde97dbu:face:default",
      catalogId: "acmde97dbu",
      name: "Formidable Youxia",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nAs long as your Shifting Currents face East, Formidable Youxia gets +2 LIFE.",
      abilities: [
        {
          id: "acmde97dbu-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "acmde97dbu-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face East, Formidable Youxia gets +2 LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "East",
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
                property: "life",
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

export default formidableYouxia;
