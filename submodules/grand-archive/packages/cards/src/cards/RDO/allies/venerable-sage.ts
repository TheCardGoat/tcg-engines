import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const venerableSage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FwPdj4PkSS",
  slug: "venerable-sage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FwPdj4PkSS:face:default",
      catalogId: "FwPdj4PkSS",
      name: "Venerable Sage",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Kongming Bonus] Whenever your Shifting Currents change directions, Venerable Sage gets +1POWER and +1LIFE until end of turn.",
      abilities: [
        {
          id: "FwPdj4PkSS-a1",
          kind: "triggered",
          text: "[Kongming Bonus] Whenever your Shifting Currents change directions, Venerable Sage gets +1POWER and +1LIFE until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {},
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
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
                  amount: 1,
                },
              },
              {
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
                  property: "life",
                  operation: "add",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default venerableSage;
