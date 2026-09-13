import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfKnox: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WLPf8QTdsP",
  slug: "lesser-boon-of-knox",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "WLPf8QTdsP:face:default",
      catalogId: "WLPf8QTdsP",
      name: "Lesser Boon of Knox",
      cost: {
        kind: "reserve",
        amount: 4,
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
        "As you gain this boon, each opponent banishes a card at random from your memory face down. As long as that card is banished, that opponent may look at it and activate it, ignoring its elemental requirements. You draw a card for each card banished from your memory this way. (Start with the opponent next in turn order. You may still look at your own face down card.)",
      abilities: [
        {
          id: "WLPf8QTdsP-a1",
          kind: "card-resolution",
          text: "As you gain this boon, each opponent banishes a card at random from your memory face down. As long as that card is banished, that opponent may look at it and activate it, ignoring its elemental requirements. You draw a card for each card banished from your memory this way. (Start with the opponent next in turn order. You may still look at your own face down card.)",
          effect: {
            kind: "for-each-player",
            players: "each-opponent",
            bindEachAs: "knox-opponent",
            order: "turn-order-after-controller",
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "knox-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: {
                      binding: "knox-opponent",
                    },
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    method: "random",
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                  faceDown: true,
                },
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "look-at",
                  actor: {
                    binding: "knox-opponent",
                  },
                  subject: {
                    kind: "bound",
                    binding: "knox-card",
                  },
                  duration: {
                    kind: "while-subjects-in-zone",
                    subjects: {
                      kind: "bound",
                      binding: "knox-card",
                    },
                    zone: "banishment",
                    scope: "per-object",
                  },
                },
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "look-at",
                  actor: "controller",
                  subject: {
                    kind: "bound",
                    binding: "knox-card",
                  },
                  duration: {
                    kind: "while-subjects-in-zone",
                    subjects: {
                      kind: "bound",
                      binding: "knox-card",
                    },
                    zone: "banishment",
                    scope: "per-object",
                  },
                },
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "activate",
                  actor: {
                    binding: "knox-opponent",
                  },
                  subject: {
                    kind: "bound",
                    binding: "knox-card",
                  },
                  fromZone: "banishment",
                  duration: {
                    kind: "while-subjects-in-zone",
                    subjects: {
                      kind: "bound",
                      binding: "knox-card",
                    },
                    zone: "banishment",
                    scope: "per-object",
                  },
                },
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "ignore-element-requirement",
                  actor: {
                    binding: "knox-opponent",
                  },
                  subject: {
                    kind: "bound",
                    binding: "knox-card",
                  },
                  duration: {
                    kind: "while-subjects-in-zone",
                    subjects: {
                      kind: "bound",
                      binding: "knox-card",
                    },
                    zone: "banishment",
                    scope: "per-object",
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
        },
      ],
    },
  },
};

export default lesserBoonOfKnox;
