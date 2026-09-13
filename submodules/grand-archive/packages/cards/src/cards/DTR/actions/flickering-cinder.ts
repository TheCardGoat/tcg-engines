import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flickeringCinder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fqxo9o8yeq",
  slug: "flickering-cinder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fqxo9o8yeq:face:default",
      catalogId: "fqxo9o8yeq",
      name: "Flickering Cinder",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to target unit. Your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "fqxo9o8yeq-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit. Your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 1,
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default flickeringCinder;
