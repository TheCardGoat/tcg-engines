import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const meirenOfVerdancy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y46R5C190v",
  slug: "meiren-of-verdancy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y46R5C190v:face:default",
      catalogId: "y46R5C190v",
      name: "Meiren of Verdancy",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Kongming Bonus] Whenever your Shifting Currents change from facing East to South, recover 4.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "y46R5C190v-a1",
          kind: "triggered",
          text: "[Kongming Bonus] Whenever your Shifting Currents change from facing East to South, recover 4.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "east",
                to: "south",
              },
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
            kind: "recover",
            player: "controller",
            amount: 4,
          },
        },
        {
          id: "y46R5C190v-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default meirenOfVerdancy;
