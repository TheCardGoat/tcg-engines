import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ionizerXUltra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1Hb6HXKXzG",
  slug: "ionizer-x-ultra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1Hb6HXKXzG:face:default",
      catalogId: "1Hb6HXKXzG",
      name: "Ionizer X Ultra",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "ACCESSORY"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "Non-Champion Object Link\n\nOn Enter: Put two static counters on linked object. Then if there are four or more static counters on it, draw a card into your memory.",
      abilities: [
        {
          id: "1Hb6HXKXzG-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Non-Champion Object Link",
          keyword: {
            name: "link",
            target: "non-champion-object",
          },
        },
        {
          id: "1Hb6HXKXzG-a2",
          kind: "triggered",
          text: "On Enter: Put two static counters on linked object. Then if there are four or more static counters on it, draw a card into your memory.",
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
                kind: "add-counter",
                subject: {
                  kind: "linked-object",
                },
                counter: "static",
                amount: 2,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "linked-object",
                      },
                      counter: "static",
                    },
                    operator: "gte",
                    right: 4,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default ionizerXUltra;
