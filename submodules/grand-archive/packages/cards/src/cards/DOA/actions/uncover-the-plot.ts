import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const uncoverThePlot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4zkTRt8qXn",
  slug: "uncover-the-plot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4zkTRt8qXn:face:default",
      catalogId: "4zkTRt8qXn",
      name: "Uncover the Plot",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["LUXEM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target player reveals all cards in their memory. Draw a card.\n\n[Class Bonus] Put two preparation counters on your champion. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "4zkTRt8qXn-a1",
          kind: "card-resolution",
          text: "Target player reveals all cards in their memory. Draw a card.",
          targets: [
            {
              id: "target-player",
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
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: {
                  binding: "target-player",
                },
                selection: {
                  id: "revealed-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-player",
                  },
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-player",
                    },
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "4zkTRt8qXn-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put two preparation counters on your champion. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default uncoverThePlot;
