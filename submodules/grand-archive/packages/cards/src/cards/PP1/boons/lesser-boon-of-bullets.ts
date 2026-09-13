import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfBullets: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UI0lAtGQBb",
  slug: "lesser-boon-of-bullets",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "UI0lAtGQBb:face:default",
      catalogId: "UI0lAtGQBb",
      name: "Lesser Boon of Bullets",
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
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion’s class matches this card’s class.)\n\n(2): Materialize a Bullet card from your material deck. This ability costs (1) more to activate for each time you’ve activated it this game.",
      abilities: [
        {
          id: "UI0lAtGQBb-a1",
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
          id: "UI0lAtGQBb-a2",
          kind: "activated",
          text: "(2): Materialize a Bullet card from your material deck. This ability costs (1) more to activate for each time you’ve activated it this game.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          costModifiers: [
            {
              operation: "add",
              amount: {
                kind: "event-total",
                event: {
                  name: "ability-activated",
                  subject: {
                    kind: "source",
                  },
                },
                window: "game",
                metric: "event-count",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["BULLET"],
                },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfBullets;
