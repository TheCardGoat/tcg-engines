import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfRegret: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uQeQhFl5Qm",
  slug: "lesser-boon-of-regret",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "uQeQhFl5Qm:face:default",
      catalogId: "uQeQhFl5Qm",
      name: "Lesser Boon of Regret",
      cost: {
        kind: "reserve",
        amount: 0,
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
        "As you gain this boon, put up to seven cards from your hand on the bottom of your deck in any order. Then draw that many cards.",
      abilities: [
        {
          id: "uQeQhFl5Qm-a1",
          kind: "triggered",
          text: "As you gain this boon, put up to seven cards from your hand on the bottom of your deck in any order. Then draw that many cards.",
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
            kind: "choose",
            selection: {
              id: "moved-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 7,
              },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "moved-cards",
                  },
                  from: "hand",
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                      orderChosenBy: "controller",
                    },
                  },
                  bindResultAs: "moved-card-count",
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: {
                    kind: "binding-count",
                    binding: "moved-card-count",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfRegret;
