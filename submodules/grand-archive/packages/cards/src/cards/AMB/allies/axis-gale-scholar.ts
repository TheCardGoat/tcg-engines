import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const axisGaleScholar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "384b3yjlhu",
  slug: "axis-gale-scholar",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "384b3yjlhu:face:default",
      catalogId: "384b3yjlhu",
      name: "Axis Gale Scholar",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "As long as your Shifting Currents face North, Axis Gale Scholar gets +2 POWER.\n\nAs long as your Shifting Currents face South, allies you control get +1 LIFE. ",
      abilities: [
        {
          id: "384b3yjlhu-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face North, Axis Gale Scholar gets +2 POWER.",
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
                  value: "North",
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
        {
          id: "384b3yjlhu-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face South, allies you control get +1 LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "South",
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default axisGaleScholar;
