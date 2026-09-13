import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfRakko: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "V8aPGgLyh5",
  slug: "lesser-boon-of-rakko",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "V8aPGgLyh5:face:default",
      catalogId: "V8aPGgLyh5",
      name: "Lesser Boon of Rakko",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["ANOMALY"],
        subtypes: ["ANOMALY", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "(3): Activate this ability only twice. Depending on D6+D6– \n• 2– Each player discards a card.\n• 3 to 5– Nothing happens.\n• 6 to 8–Each player draws a card.\n• 9 to 11– You draw a card.\n• 12– You draw two cards.\n",
      abilities: [
        {
          id: "V8aPGgLyh5-a1",
          kind: "activated",
          text: "(3): Activate this ability only twice. Depending on D6+D6–\n• 2– Each player discards a card.\n• 3 to 5– Nothing happens.\n• 6 to 8–Each player draws a card.\n• 9 to 11– You draw a card.\n• 12– You draw two cards.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
          limit: {
            count: 2,
            per: "source-instance",
          },
          effect: {
            kind: "branch-on-value",
            value: {
              kind: "die",
              sides: 6,
              count: 2,
            },
            branches: [
              {
                minimum: 2,
                maximum: 2,
                effect: {
                  kind: "discard",
                  player: "each-player",
                  selection: {
                    id: "each-discard",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "each-player",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "each-player",
                    },
                  },
                },
              },
              {
                minimum: 3,
                maximum: 5,
                effect: {
                  kind: "no-op",
                },
              },
              {
                minimum: 6,
                maximum: 8,
                effect: {
                  kind: "draw",
                  player: "each-player",
                  amount: 1,
                },
              },
              {
                minimum: 9,
                maximum: 11,
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                minimum: 12,
                maximum: 12,
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default lesserBoonOfRakko;
