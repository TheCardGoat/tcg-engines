import type { MatchupPlan } from "./types";

export const BEST_AI_MATCHUP_PLANS: readonly MatchupPlan[] = [
  {
    challengeBias: 1,
    id: "sapphire-steel-vs-amber-steel-stabilize",
    label: "Sapphire Steel stabilizes against Amber Steel",
    openingPlan: {
      maxLateCardsToKeep: 1,
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        playCard: -2,
        putCardIntoInkwell: 1,
      },
    },
    reason: "Trade some greed for early interaction and safer inks against pressure.",
    roleWeightsByTurnBucket: {
      mid: {
        mustAnswerThreat: 2,
        removal: 2,
      },
      opening: {
        mustAnswerThreat: 2,
        removal: 2,
      },
    },
    strategyTags: ["core", "situational"],
    when: {
      actorColorPairs: ["sapphire-steel"],
      opponentColorPairs: ["amber-steel"],
    },
  },
  {
    familyBias: {
      playCard: 1,
    },
    id: "sapphire-steel-mirror-value",
    label: "Sapphire Steel mirror value posture",
    openingPlan: {
      maxLateCardsToKeep: 2,
      openingFamilyBias: {
        playCard: 1,
      },
    },
    reason: "Mirrors reward keeping more value and converting mana advantage into board.",
    roleWeightsByTurnBucket: {
      late: {
        drawEngine: 1,
        ramp: 1,
      },
      mid: {
        drawEngine: 1,
        ramp: 1,
      },
      opening: {
        drawEngine: 1,
        ramp: 1,
      },
    },
    strategyTags: ["engine", "situational"],
    when: {
      actorColorPairs: ["sapphire-steel"],
      opponentColorPairs: ["sapphire-steel"],
    },
  },
  {
    challengeBias: 1,
    id: "amethyst-ruby-vs-aggro-survive",
    label: "Amethyst Ruby survives fast openings",
    openingPlan: {
      maxLateCardsToKeep: 1,
      openingFamilyBias: {
        challenge: 1,
        playCard: -1,
        putCardIntoInkwell: 1,
      },
    },
    reason: "The control deck should buy time first and only pivot to value once stable.",
    roleWeightsByTurnBucket: {
      mid: {
        removal: 2,
        sweeper: 1,
      },
      opening: {
        mustAnswerThreat: 2,
        removal: 2,
      },
    },
    strategyTags: ["core", "situational"],
    when: {
      actorColorPairs: ["amethyst-ruby"],
      opponentColorPairs: ["amber-emerald", "amber-steel"],
    },
  },
  {
    familyBias: {
      challenge: 1,
      playCard: 1,
    },
    id: "amber-steel-vs-control-pressure",
    label: "Amber Steel pressures control",
    openingPlan: {
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        challenge: 1,
        playCard: 1,
      },
    },
    reason: "Amber Steel should pressure control before late-game engines take over.",
    roleWeightsByTurnBucket: {
      mid: {
        removal: 1,
        tempoThreat: 1,
      },
      opening: {
        earlyPlay: 1,
        tempoThreat: 2,
      },
    },
    strategyTags: ["core", "situational"],
    when: {
      actorColorPairs: ["amber-steel"],
      opponentColorPairs: ["amethyst-ruby"],
    },
  },
  {
    familyBias: {
      challenge: 1,
      playCard: 1,
    },
    id: "amethyst-sapphire-vs-sapphire-steel-board-first",
    label: "Amethyst Sapphire fights for board against Sapphire Steel",
    openingPlan: {
      openingFamilyBias: {
        playCard: 1,
      },
    },
    reason: "The deck wins by landing synergy pieces before sapphire-steel fully stabilizes.",
    roleWeightsByTurnBucket: {
      mid: {
        drawEngine: 1,
        removal: 1,
      },
      opening: {
        ramp: 2,
        synergyAnchor: 1,
      },
    },
    strategyTags: ["engine", "situational"],
    when: {
      actorColorPairs: ["amethyst-sapphire"],
      opponentColorPairs: ["sapphire-steel"],
    },
  },
  {
    familyBias: {
      playCard: 1,
      quest: 2,
    },
    id: "amber-emerald-vs-sapphire-steel-race",
    label: "Amber Emerald races Sapphire Steel",
    openingPlan: {
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        playCard: 1,
        putCardIntoInkwell: -1,
        quest: 1,
      },
    },
    reason: "Keep the race fast and punish slower sapphire development windows.",
    roleWeightsByTurnBucket: {
      mid: {
        evasiveThreat: 2,
        tempoThreat: 2,
      },
      opening: {
        evasiveThreat: 2,
        tempoThreat: 2,
      },
    },
    strategyTags: ["core", "situational"],
    when: {
      actorColorPairs: ["amber-emerald"],
      opponentColorPairs: ["sapphire-steel"],
    },
  },
] as const;
