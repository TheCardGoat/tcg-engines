import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shilowenPeacefulBeginnings: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "L9zeix1x4N",
  slug: "shilowen-peaceful-beginnings",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "L9zeix1x4N:face:default",
      catalogId: "L9zeix1x4N",
      name: "Shilowen, Peaceful Beginnings",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "KINGDOM"],
      },
      elements: ["NORM"],
      stats: {
        durability: 6,
      },
      rulesText:
        "Whenever an ally enters the field, you may remove two durability counters from Shilowen. If you do, put a bulwark counter on that ally. (If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
      abilities: [
        {
          id: "L9zeix1x4N-a1",
          kind: "triggered",
          text: "Whenever an ally enters the field, you may remove two durability counters from Shilowen. If you do, put a bulwark counter on that ally. (If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
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
                    kind: "remove-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "durability",
                    amount: 2,
                    bindResultAs: "removed-counters",
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
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    counter: "bulwark",
                    amount: 1,
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

export default shilowenPeacefulBeginnings;
