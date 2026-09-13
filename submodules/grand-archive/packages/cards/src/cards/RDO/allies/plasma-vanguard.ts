import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const plasmaVanguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wAabqFjdM5",
  slug: "plasma-vanguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wAabqFjdM5:face:default",
      catalogId: "wAabqFjdM5",
      name: "Plasma Vanguard",
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
      elements: ["EXIA"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Intercept\n\n[Damage 25+] Vigor\n\n[Class Bonus] On Enter: If your champion has ten or less damage counters on them, put three buff counters on Plasma Vanguard.\n",
      abilities: [
        {
          id: "wAabqFjdM5-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "wAabqFjdM5-a2",
          kind: "triggered",
          intrinsic: true,
          text: "[Damage 25+] Vigor",
          keyword: {
            name: "vigor",
          },
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 25,
                },
              },
            },
          ],
        },
        {
          id: "wAabqFjdM5-a3",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If your champion has ten or less damage counters on them, put three buff counters on Plasma Vanguard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "damage",
                },
                operator: "lte",
                right: 10,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default plasmaVanguard;
