import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfDistance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l8PytM9CpG",
  slug: "lesser-boon-of-distance",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "l8PytM9CpG:face:default",
      catalogId: "l8PytM9CpG",
      name: "Lesser Boon of Distance",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion’s class matches this card’s class.)\n\n(2): Target Ranger unit becomes distant. If this is the third time this ability has resolved, draw a card into your memory. Activate this ability only thrice.",
      abilities: [
        {
          id: "l8PytM9CpG-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked (Play this card only if your champion’s class matches this card’s class.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "l8PytM9CpG-a2",
          kind: "activated",
          text: "(2): Target Ranger unit becomes distant. If this is the third time this ability has resolved, draw a card into your memory. Activate this ability only thrice.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          targets: [
            {
              id: "target-ranger-unit",
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
          limit: {
            count: 3,
            per: "source-instance",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-ranger-unit",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "ability-resolution-count",
                  ability: "this",
                  scope: "source-instance",
                  window: "game",
                  operator: "eq",
                  value: 3,
                  includesCurrent: true,
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

export default lesserBoonOfDistance;
