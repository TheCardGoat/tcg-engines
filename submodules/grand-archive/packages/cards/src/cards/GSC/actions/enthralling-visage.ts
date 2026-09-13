import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enthrallingVisage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ycwz9gv4vm",
  slug: "enthralling-visage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ycwz9gv4vm:face:default",
      catalogId: "ycwz9gv4vm",
      name: "Enthralling Visage",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time damage would be dealt to target unit this turn, prevent 2 of that damage. When damage is prevented this way, banish target card in a graveyard.",
      abilities: [
        {
          id: "ycwz9gv4vm-a1",
          kind: "card-resolution",
          text: "The next time damage would be dealt to target unit this turn, prevent 2 of that damage. When damage is prevented this way, banish target card in a graveyard.",
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
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
              amount: 2,
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
            afterApply: {
              kind: "conditional",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "modified-ability-result-amount",
                    metric: "damage-prevented",
                  },
                  operator: "gt",
                  right: 0,
                },
              },
              then: {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-card",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default enthrallingVisage;
