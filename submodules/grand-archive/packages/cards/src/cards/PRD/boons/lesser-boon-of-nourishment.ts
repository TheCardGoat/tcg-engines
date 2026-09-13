import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfNourishment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TEAB07h5C8",
  slug: "lesser-boon-of-nourishment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TEAB07h5C8:face:default",
      catalogId: "TEAB07h5C8",
      name: "Lesser Boon of Nourishment",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "As you gain this boon, scavenge 13 for a Kitchen or Food card.\n\n(2): Target opponent gains control of target Food item you control. If they do, you draw a card into your memory. Activate this ability only at slow speed.",
      abilities: [
        {
          id: "TEAB07h5C8-a1",
          kind: "triggered",
          text: "As you gain this boon, scavenge 13 for a Kitchen or Food card.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 13,
            filter: {
              kind: "subtype",
              oneOf: ["FOOD"],
            },
          },
        },
        {
          id: "TEAB07h5C8-a2",
          kind: "activated",
          text: "(2): Target opponent gains control of target Food item you control. If they do, you draw a card into your memory. Activate this ability only at slow speed.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          speed: "slow",
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
            {
              id: "target-food",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FOOD"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                bindSucceededAs: "control-changed",
                effect: {
                  kind: "change-control",
                  subject: {
                    kind: "bound",
                    binding: "target-food",
                  },
                  controller: {
                    binding: "target-opponent",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "control-changed",
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

export default lesserBoonOfNourishment;
