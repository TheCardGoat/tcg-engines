import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfIsis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GlqhpkmflM",
  slug: "lesser-boon-of-isis",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "GlqhpkmflM:face:default",
      catalogId: "GlqhpkmflM",
      name: "Lesser Boon of Isis",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion’s class matches this card’s class.)\n\nAs you gain this boon, empower 3.\n\nWhenever your champion levels up into a champion card with base level 3, draw a card into your memory. Trigger this ability only once.\n",
      abilities: [
        {
          id: "GlqhpkmflM-a1",
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
          id: "GlqhpkmflM-a2",
          kind: "triggered",
          text: "As you gain this boon, empower 3.",
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
            action: "empower",
            amount: 3,
          },
        },
        {
          id: "GlqhpkmflM-a3",
          kind: "triggered",
          text: "Whenever your champion levels up into a champion card with base level 3, draw a card into your memory. Trigger this ability only once.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "level",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 3,
                      },
                    },
                  ],
                },
              },
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default lesserBoonOfIsis;
