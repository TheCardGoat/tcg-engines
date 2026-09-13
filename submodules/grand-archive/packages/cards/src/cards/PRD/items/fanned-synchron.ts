import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fannedSynchron: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3h6eqjsLWG",
  slug: "fanned-synchron",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3h6eqjsLWG:face:default",
      catalogId: "3h6eqjsLWG",
      name: "Fanned Synchron",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BAUBLE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Fanned Synchron can't be suppressed.\n\nWhenever an on enter ability of a non-champion object you don't control triggers, that object deals 1 damage to its controller’s champion. If that object is wind element, that object deals 3 damage to its controller's champion instead. ",
      abilities: [
        {
          id: "3h6eqjsLWG-a1",
          kind: "static",
          staticKind: "effects",
          text: "Fanned Synchron can't be suppressed.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "suppress",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3h6eqjsLWG-a2",
          kind: "triggered",
          text: "Whenever an on enter ability of a non-champion object you don't control triggers, that object deals 1 damage to its controller’s champion. If that object is wind element, that object deals 3 damage to its controller's champion instead.",
          trigger: {
            kind: "event",
            event: {
              name: "ability-triggered",
              triggerName: "on-enter",
              sourceObject: {
                kind: "event-object",
                controller: "opponent",
                bindAs: "triggering-object",
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "bound",
              binding: "triggering-object",
            },
            recipient: {
              kind: "champion",
              player: {
                controllerOf: "triggering-object",
              },
            },
            amount: {
              kind: "conditional",
              condition: {
                kind: "subject-matches",
                subject: {
                  kind: "bound",
                  binding: "triggering-object",
                },
                filter: {
                  kind: "element",
                  oneOf: ["WIND"],
                },
              },
              then: 3,
              else: 1,
            },
          },
        },
      ],
    },
  },
};

export default fannedSynchron;
