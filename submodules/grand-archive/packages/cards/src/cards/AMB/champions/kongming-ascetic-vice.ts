import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kongmingAsceticVice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a01pyxwo25",
  slug: "kongming-ascetic-vice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a01pyxwo25:face:default",
      catalogId: "a01pyxwo25",
      name: "Kongming, Ascetic Vice",
      lineageName: "Kongming",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        'Kongming Lineage (Kongming, Ascetic Vice must be leveled from a previous level "Kongming" champion.) \n\nOn Enter: Empower 3.\n\nInherited Effect — Whenever your Shifting Currents change from facing North to South, draw a card.',
      abilities: [
        {
          id: "a01pyxwo25-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Kongming Lineage (Kongming, Ascetic Vice must be leveled from a previous level "Kongming" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Kongming",
          },
        },
        {
          id: "a01pyxwo25-a2",
          kind: "triggered",
          text: "On Enter: Empower 3.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 3,
          },
        },
        {
          id: "a01pyxwo25-a3",
          kind: "triggered",
          text: "Inherited Effect — Whenever your Shifting Currents change from facing North to South, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "north",
                to: "south",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default kongmingAsceticVice;
