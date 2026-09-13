import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surpriseReveal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pi3DyYU6Sa",
  slug: "surprise-reveal",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "pi3DyYU6Sa:face:default",
      catalogId: "pi3DyYU6Sa",
      name: "Surprise Reveal",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target opponent reveals all cards in their hand and memory. You gain the Crowd's Favor status.\n\n[Class Bonus] Draw a card. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "pi3DyYU6Sa-a1",
          kind: "card-resolution",
          text: "Target opponent reveals all cards in their hand and memory. You gain the Crowd's Favor status.",
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
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "revealed-opponent-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-opponent",
                  },
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["hand", "memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "set-player-state",
                player: "controller",
                state: {
                  named: "Crowd's Favor",
                },
                value: true,
              },
            ],
          },
        },
        {
          id: "pi3DyYU6Sa-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Draw a card. (Apply this effect only if your champion’s class matches this card’s class.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
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

export default surpriseReveal;
