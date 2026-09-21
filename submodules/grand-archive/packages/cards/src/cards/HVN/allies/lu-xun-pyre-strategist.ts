import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luXunPyreStrategist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xllhbjr20n",
  slug: "lu-xun-pyre-strategist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xllhbjr20n:face:default",
      catalogId: "xllhbjr20n",
      name: "Lu Xun, Pyre Strategist",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "Kindle 3\n\nOn Enter: Put an enlighten counter on your champion.\n\n[Class Bonus] Whenever one or more enlighten counters are removed from your champion, you may rest Lu Xun. If you do, empower 3.",
      abilities: [
        {
          id: "xllhbjr20n-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 3",
          keyword: {
            name: "kindle",
            value: 3,
          },
        },
        {
          id: "xllhbjr20n-a2",
          kind: "triggered",
          text: "On Enter: Put an enlighten counter on your champion.",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
        {
          id: "xllhbjr20n-a3",
          kind: "triggered",
          text: "[Class Bonus] Whenever one or more enlighten counters are removed from your champion, you may rest Lu Xun. If you do, empower 3.",
          trigger: {
            kind: "event",
            event: {
              name: "counter-removed",
              counter: "enlighten",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "rest",
                    subject: {
                      kind: "source",
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "keyword-action",
                    action: "empower",
                    amount: 3,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default luXunPyreStrategist;
