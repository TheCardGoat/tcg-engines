import type { CardStrategyProfile } from "./types";

export const BEST_AI_CARD_PROFILES: readonly CardStrategyProfile[] = [
  {
    baseAdjust: {
      ink: -2,
      mulligan: 2,
      play: 1,
    },
    baseReason: "Core ramp piece that improves opening cohesion in sapphire decks.",
    definitionId: "gPY",
    label: "Tipo",
    rules: [
      {
        adjust: {
          ink: -2,
          mulligan: 2,
          play: 2,
        },
        id: "gpy-ramp-race",
        label: "Preserve Tipo in sapphire mirrors",
        reason: "Ramp matters more when both decks are fighting on expensive tempo turns.",
        strategyTags: ["engine", "situational"],
        when: {
          actorColorPairs: ["amethyst-sapphire", "sapphire-steel"],
          opponentColorPairs: ["amethyst-sapphire", "sapphire-steel"],
        },
      },
    ],
    strategyTags: ["core", "engine"],
  },
  {
    baseAdjust: {
      ink: -1,
      mulligan: 1,
      play: 1,
    },
    baseReason: "High-value draw engine worth protecting in slower games.",
    definitionId: "0RS",
    label: "Pete",
    rules: [
      {
        adjust: {
          ink: -3,
          mulligan: 2,
          play: 2,
        },
        id: "0rs-value-mirror",
        label: "Lean into Pete in value mirrors",
        reason: "Pete snowballs attrition games where both decks trade resources early.",
        strategyTags: ["engine", "situational"],
        when: {
          actorColorPairs: ["amethyst-sapphire", "sapphire-steel"],
          opponentColorPairs: ["amethyst-ruby", "amethyst-sapphire", "sapphire-steel"],
        },
      },
    ],
    strategyTags: ["core", "engine"],
  },
  {
    baseAdjust: {
      ink: 1,
      play: 1,
      target: 1,
    },
    baseReason: "Flexible removal spell that swings combat math when the target is worth the card.",
    definitionId: "EtL",
    label: "Grab Your Bow",
    rules: [
      {
        adjust: {
          ink: -6,
          mulligan: 5,
          play: 3,
          target: 3,
        },
        id: "etl-anti-aggro-bullet",
        label: "Keep Grab Your Bow against low-curve pressure",
        reason: "The card is a silver bullet into one-willpower and tempo-heavy openings.",
        strategyTags: ["silver-bullet", "situational"],
        targetPreference: {
          exertedOpposingScore: 2,
          lowStrengthOpposingScore: 4,
          opposingRoleWeights: {
            mustAnswerThreat: 4,
            tempoThreat: 2,
          },
        },
        when: {
          actorColorPairs: ["amethyst-ruby", "sapphire-steel"],
          opponentColorPairs: ["amber-emerald", "amber-steel"],
        },
      },
      {
        adjust: {
          ink: 4,
          mulligan: -2,
          play: -1,
        },
        id: "etl-dead-in-slower-games",
        label: "De-prioritize Grab Your Bow in slower pairings",
        reason: "The card is expendable when opponents do not expose enough small targets.",
        strategyTags: ["dead", "expendable"],
        when: {
          actorColorPairs: ["amethyst-ruby", "sapphire-steel"],
          opponentColorPairs: ["amethyst-ruby", "amethyst-sapphire", "sapphire-steel"],
        },
      },
    ],
    strategyTags: ["silver-bullet", "situational"],
  },
  {
    baseAdjust: {
      mulligan: 1,
      play: 2,
      target: 2,
    },
    baseReason: "Premium cheap interaction that enables tempo turns.",
    definitionId: "404",
    label: "Let the Storm Rage On",
    rules: [
      {
        adjust: {
          mulligan: 2,
          play: 2,
          target: 2,
        },
        id: "404-anti-pressure",
        label: "Bias cheap removal into pressure matchups",
        reason: "Cheap removal is a core stabilizer against fast lore decks.",
        strategyTags: ["core", "situational"],
        when: {
          actorColorPairs: ["amber-steel"],
          opponentColorPairs: ["amber-emerald", "amethyst-ruby"],
        },
      },
    ],
    strategyTags: ["core"],
  },
  {
    baseAdjust: {
      ink: -3,
      mulligan: 2,
      play: 2,
      target: 1,
    },
    baseReason: "Primary recovery engine that converts damaged allies into card flow.",
    definitionId: "mTY",
    label: "Rapunzel",
    rules: [
      {
        adjust: {
          mulligan: 2,
          play: 2,
          target: 2,
        },
        id: "mty-board-recovery",
        label: "Preserve Rapunzel against decks that force early trades",
        reason: "Rapunzel is a premium recovery anchor when the board is expected to trade.",
        strategyTags: ["engine", "situational"],
        targetPreference: {
          alliedRoleWeights: {
            synergyAnchor: 2,
            tempoThreat: 1,
          },
          damagedAlliedScore: 4,
        },
        when: {
          actorColorPairs: ["amber-steel"],
          opponentColorPairs: ["amber-emerald", "amber-steel"],
        },
      },
    ],
    strategyTags: ["core", "engine"],
  },
  {
    baseAdjust: {
      mulligan: 1,
      play: 2,
      target: 2,
    },
    baseReason: "Catch-all removal spell for decks trying to stick protected threats.",
    definitionId: "Ql7",
    label: "They Never Come Back",
    rules: [
      {
        adjust: {
          ink: -3,
          mulligan: 3,
          play: 2,
          target: 2,
        },
        id: "ql7-answer-tempo",
        label: "Hold They Never Come Back for pressure decks",
        reason: "The card trades up best when tempo threats must be answered on curve.",
        strategyTags: ["silver-bullet", "situational"],
        when: {
          actorColorPairs: ["amethyst-ruby"],
          opponentColorPairs: ["amber-emerald", "amber-steel"],
        },
      },
    ],
    strategyTags: ["situational"],
  },
  {
    baseAdjust: {
      challenge: 1,
      mulligan: 2,
      play: 1,
    },
    baseReason:
      "Low-cost synergy piece that is more important when the deck must establish board first.",
    definitionId: "F8I",
    label: "Basil",
    rules: [
      {
        adjust: {
          challenge: 3,
          mulligan: 2,
          play: 2,
        },
        id: "f8i-sapphire-board",
        label: "Push Basil in sapphire midrange mirrors",
        reason: "Basil is worth deploying and trading earlier when board snowball matters.",
        strategyTags: ["core", "situational"],
        when: {
          actorColorPairs: ["amethyst-sapphire"],
          opponentColorPairs: ["amethyst-ruby", "sapphire-steel"],
        },
      },
    ],
    strategyTags: ["core", "situational"],
  },
  {
    baseAdjust: {
      challenge: -1,
      ink: -1,
      mulligan: 1,
      play: 2,
    },
    baseReason: "Sticky value threat that rewards getting on board before attrition turns.",
    definitionId: "B2Y",
    label: "Genie",
    rules: [
      {
        adjust: {
          mulligan: 2,
          play: 3,
          target: 1,
        },
        id: "b2y-vs-sapphire-steel",
        label: "Advance Genie into sapphire-steel",
        reason: "Genie pressures slower sapphire decks while forcing awkward answers.",
        strategyTags: ["engine", "situational"],
        when: {
          actorColorPairs: ["amethyst-ruby", "amethyst-sapphire"],
          opponentColorPairs: ["sapphire-steel"],
        },
      },
    ],
    strategyTags: ["core", "engine"],
  },
  {
    baseAdjust: {
      ink: 2,
      target: 1,
    },
    baseReason: "Matchup-dependent interaction that should usually be converted into ink.",
    definitionId: "DI6",
    label: "Freeze the Vine",
    rules: [
      {
        adjust: {
          ink: -5,
          mulligan: 4,
          play: 3,
          target: 3,
        },
        id: "di6-anti-sapphire-bullet",
        label: "Treat Freeze the Vine as a silver bullet into sapphire decks",
        reason: "The card is specifically here to punish large sapphire pivots and tempo anchors.",
        strategyTags: ["silver-bullet", "situational"],
        when: {
          actorColorPairs: ["amber-emerald"],
          opponentColorPairs: ["amethyst-sapphire", "sapphire-steel"],
        },
      },
      {
        adjust: {
          ink: 4,
          mulligan: -2,
        },
        id: "di6-dead-elsewhere",
        label: "Convert Freeze the Vine outside its target matchups",
        reason: "Outside sapphire decks the card is frequently dead weight.",
        strategyTags: ["dead", "expendable"],
        when: {
          actorColorPairs: ["amber-emerald"],
          opponentColorPairs: ["amber-emerald", "amber-steel", "amethyst-ruby"],
        },
      },
    ],
    strategyTags: ["silver-bullet", "dead"],
  },
  {
    baseAdjust: {
      play: 1,
      target: 2,
    },
    baseReason: "Interaction spell that scales with opposing must-answer threats.",
    definitionId: "sQ9",
    label: "Strength of a Raging Fire",
    rules: [
      {
        adjust: {
          play: 2,
          target: 2,
        },
        id: "sq9-midrange-removal",
        label: "Press efficient removal in board-focused games",
        reason: "The spell gains value where opposing tempo threats decide the race.",
        strategyTags: ["core", "situational"],
        when: {
          actorColorPairs: ["amber-steel", "sapphire-steel"],
          opponentColorPairs: ["amber-steel", "sapphire-steel"],
        },
      },
    ],
    strategyTags: ["core"],
  },
  {
    baseAdjust: {
      challenge: -2,
      mulligan: 2,
      play: 2,
    },
    baseReason: "Primary lore threat that should usually stay pointed at questing.",
    definitionId: "lih",
    label: "Daisy Duck",
    rules: [
      {
        adjust: {
          challenge: 3,
        },
        id: "lih-trade-into-control",
        label: "Allow Daisy to trade when control must be pressed off board",
        reason:
          "Against slower decks, converting Daisy into an efficient trade can unlock the race.",
        strategyTags: ["situational"],
        when: {
          actorColorPairs: ["amber-steel"],
          opponentColorPairs: ["amethyst-ruby"],
        },
      },
    ],
    strategyTags: ["core", "situational"],
  },
] as const;
