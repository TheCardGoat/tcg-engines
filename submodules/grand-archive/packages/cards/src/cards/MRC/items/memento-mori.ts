import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mementoMori: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9xycwz9gv4",
  slug: "memento-mori",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9xycwz9gv4:face:default",
      catalogId: "9xycwz9gv4",
      name: "Memento Mori",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN", "RANGER"],
        subtypes: ["GUARDIAN", "RANGER", "ACCESSORY"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Whenever an ally dies, put a prize counter on Memento Mori.\n\nBanish Memento Mori: Draw three cards. Activate this ability only at slow speed and only if there are six or more prize counters on Memento Mori.",
      abilities: [
        {
          id: "9xycwz9gv4-a1",
          kind: "triggered",
          text: "Whenever an ally dies, put a prize counter on Memento Mori.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "prize",
            },
            amount: 1,
          },
        },
        {
          id: "9xycwz9gv4-a2",
          kind: "activated",
          text: "Banish Memento Mori: Draw three cards. Activate this ability only at slow speed and only if there are six or more prize counters on Memento Mori.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "prize",
                },
              },
              operator: "gte",
              right: 6,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default mementoMori;
