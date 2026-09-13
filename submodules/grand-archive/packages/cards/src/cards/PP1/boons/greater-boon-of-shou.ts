import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfShou: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Zw0T2GmowK",
  slug: "greater-boon-of-shou",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "Zw0T2GmowK:face:default",
      catalogId: "Zw0T2GmowK",
      name: "Greater Boon of Shou",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 2 (Play this card only if your champion’s base level is 2 or higher.)\n\nAs you gain this boon, draw a card.\n\nAt the beginning of your recollection phase, glimpse 2.",
      abilities: [
        {
          id: "Zw0T2GmowK-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 2 (Play this card only if your champion’s base level is 2 or higher.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "base",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "Zw0T2GmowK-a2",
          kind: "triggered",
          text: "As you gain this boon, draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "Zw0T2GmowK-a3",
          kind: "triggered",
          text: "At the beginning of your recollection phase, glimpse 2.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default greaterBoonOfShou;
