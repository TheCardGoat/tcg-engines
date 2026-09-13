import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mistswornMagister: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rqjnvhf26m",
  slug: "mistsworn-magister",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rqjnvhf26m:face:default",
      catalogId: "rqjnvhf26m",
      name: "Mistsworn Magister",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nDeluge 3 — On Death: If you have three or more water element cards in your graveyard, put two enlighten counters on your champion.",
      abilities: [
        {
          id: "rqjnvhf26m-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
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
          id: "rqjnvhf26m-a2",
          kind: "triggered",
          text: "Deluge 3 — On Death: If you have three or more water element cards in your graveyard, put two enlighten counters on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["graveyard"],
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                  },
                },
                operator: "gte",
                right: 3,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "enlighten",
              amount: 2,
            },
          },
          label: {
            name: "Deluge 3",
          },
        },
      ],
    },
  },
};

export default mistswornMagister;
