import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const merlinAmethystsGlow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dPP9I4nVn0",
  slug: "merlin-amethysts-glow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dPP9I4nVn0:face:default",
      catalogId: "dPP9I4nVn0",
      name: "Merlin, Amethyst's Glow",
      lineageName: "Merlin",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Merlin Lineage\n\nOn Enter: Put two sheen counters on target unit. \n\n(9): Draw a card and put a preparation counter on Merlin. Activate this ability only once. This ability costs (X) less to activate, where X is the amount of sheen counters on your Fractured Memories.",
      abilities: [
        {
          id: "dPP9I4nVn0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Merlin Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Merlin",
          },
        },
        {
          id: "dPP9I4nVn0-a2",
          kind: "triggered",
          text: "On Enter: Put two sheen counters on target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: {
              named: "sheen",
            },
            amount: 2,
          },
        },
        {
          id: "dPP9I4nVn0-a3",
          kind: "activated",
          text: "(9): Draw a card and put a preparation counter on Merlin. Activate this ability only once. This ability costs (X) less to activate, where X is the amount of sheen counters on your Fractured Memories.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 9,
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "mastery",
                  player: "controller",
                  name: "Fractured Memories",
                },
                counter: {
                  named: "sheen",
                },
              },
            },
          ],
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default merlinAmethystsGlow;
