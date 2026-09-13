import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const confidantsOath: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nlufjh84vm",
  slug: "confidants-oath",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nlufjh84vm:face:default",
      catalogId: "nlufjh84vm",
      name: "Confidant's Oath",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "RING"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Ciel Bonus] Whenever an omen counter is put on a card in your banishment, put a refinement counter on Confidant's Oath.\n\n(2), REST, Remove two refinement counters from Confidant's Oath: Draw a card.\n",
      abilities: [
        {
          id: "nlufjh84vm-a1",
          kind: "triggered",
          text: "[Ciel Bonus] Whenever an omen counter is put on a card in your banishment, put a refinement counter on Confidant's Oath.",
          trigger: {
            kind: "event",
            event: {
              name: "counter-added",
              actor: "controller",
              counter: "omen",
              subject: {
                kind: "event-object",
                owner: "controller",
                filter: {
                  kind: "zone",
                  oneOf: ["banishment"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: 1,
          },
        },
        {
          id: "nlufjh84vm-a2",
          kind: "activated",
          text: "(2), REST, Remove two refinement counters from Confidant's Oath: Draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
                amount: 2,
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default confidantsOath;
