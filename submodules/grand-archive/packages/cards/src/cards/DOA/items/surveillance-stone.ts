import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surveillanceStone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kk46Whz7CJ",
  slug: "surveillance-stone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kk46Whz7CJ:face:default",
      catalogId: "kk46Whz7CJ",
      name: "Surveillance Stone",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever an opponent declares an attack with a unit for the third time each turn, you may banish Surveillance Stone. If you do, draw a card.",
      abilities: [
        {
          id: "kk46Whz7CJ-a1",
          kind: "triggered",
          text: "Whenever an opponent declares an attack with a unit for the third time each turn, you may banish Surveillance Stone. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              actor: "opponent",
              subject: {
                kind: "event-object",
                controller: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              occurrence: {
                count: 3,
                window: "this-turn",
                actorScope: "same-player",
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
                    kind: "banish-object",
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
                    kind: "draw",
                    player: "controller",
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

export default surveillanceStone;
