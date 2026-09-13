import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wulinLancer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1i2luu7dft",
  slug: "wulin-lancer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1i2luu7dft:face:default",
      catalogId: "1i2luu7dft",
      name: "Wulin Lancer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Whenever your Shifting Currents change from facing North to West, Wulin Lancer gets +2 POWER until end of turn.",
      abilities: [
        {
          id: "1i2luu7dft-a1",
          kind: "triggered",
          text: "Whenever your Shifting Currents change from facing North to West, Wulin Lancer gets +2 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "north",
                to: "west",
              },
            },
          },
          effect: {
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
      ],
    },
  },
};

export default wulinLancer;
