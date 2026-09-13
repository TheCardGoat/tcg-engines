import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aquiferSeneschal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8mrn8at13c",
  slug: "aquifer-seneschal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8mrn8at13c:face:default",
      catalogId: "8mrn8at13c",
      name: "Aquifer Seneschal",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "Hindered (This ally enters the field rested.)\n\n[Class Bonus] Taunt\n\nOn Enter: If you have three or more omens, wake up Aquifer Seneschal. Then if you have six or more omens, put a buff counter on Aquifer Seneschal.",
      abilities: [
        {
          id: "8mrn8at13c-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "8mrn8at13c-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt",
          keyword: {
            name: "taunt",
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
          id: "8mrn8at13c-a3",
          kind: "triggered",
          text: "On Enter: If you have three or more omens, wake up Aquifer Seneschal. Then if you have six or more omens, put a buff counter on Aquifer Seneschal.",
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
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "player-property",
                      player: "controller",
                      property: "omens",
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "wake",
                  subject: {
                    kind: "source",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "player-property",
                      player: "controller",
                      property: "omens",
                    },
                    operator: "gte",
                    right: 6,
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
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

export default aquiferSeneschal;
