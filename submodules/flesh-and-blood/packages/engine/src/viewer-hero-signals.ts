import type { FabRulesSnapshot } from "./kernel/transaction-kernel.ts";

export type FabViewerHeroSignal =
  | {
      readonly kind: "flag";
      readonly id: "cheered" | "booed" | "charged";
      readonly duration: "this-turn";
    }
  | {
      readonly kind: "count";
      readonly id: "intimidate" | "weapon-attacks" | "soul-added";
      readonly value: number;
      readonly duration: "this-turn";
    };

interface HeroSignalPlayer {
  readonly playerId: string;
  readonly heroCardId: string | null;
  readonly history: {
    readonly turn: {
      readonly crowdCheered: boolean;
      readonly crowdBooed: boolean;
      readonly charged: boolean;
      readonly intimidatesThisTurn: number;
      readonly weaponAttacks: number;
    };
  };
}
type HeroSignalState = Pick<FabRulesSnapshot, "objects" | "turnNumber">;

type HeroSignalProjector = (
  state: HeroSignalState,
  player: HeroSignalPlayer,
) => readonly FabViewerHeroSignal[];

const tuffnutSignals: HeroSignalProjector = (_state, player) => [
  ...(player.history.turn.crowdCheered
    ? ([{ kind: "flag", id: "cheered", duration: "this-turn" }] as const)
    : []),
  ...(player.history.turn.crowdBooed
    ? ([{ kind: "flag", id: "booed", duration: "this-turn" }] as const)
    : []),
];

const rhinarSignals: HeroSignalProjector = (_state, player) =>
  player.history.turn.intimidatesThisTurn > 0
    ? [
        {
          kind: "count",
          id: "intimidate",
          value: player.history.turn.intimidatesThisTurn,
          duration: "this-turn",
        },
      ]
    : [];

const boltynSignals: HeroSignalProjector = (state, player) => {
  const soulAdded = Object.values(state.objects).filter((object) =>
    object?.history.moves.some(
      (move) =>
        move.turnNumber === state.turnNumber &&
        move.to.zone === "soul" &&
        move.to.playerId === player.playerId,
    ),
  ).length;

  return [
    ...(player.history.turn.charged
      ? ([{ kind: "flag", id: "charged", duration: "this-turn" }] as const)
      : []),
    ...(player.history.turn.weaponAttacks > 0
      ? ([
          {
            kind: "count",
            id: "weapon-attacks",
            value: player.history.turn.weaponAttacks,
            duration: "this-turn",
          },
        ] as const)
      : []),
    ...(soulAdded > 0
      ? ([{ kind: "count", id: "soul-added", value: soulAdded, duration: "this-turn" }] as const)
      : []),
  ];
};

/**
 * Curated hero-native signal inventory. Canonical identity is authoritative;
 * printed text is deliberately never parsed to infer UI state.
 */
const HERO_SIGNAL_PROJECTORS: Readonly<Record<string, HeroSignalProjector>> = {
  // Tuffnut, Bumbling Hulkster / Tuffnut
  wqmMJj8PqzNHg7Q7LMqTR: tuffnutSignals,
  wKnhnNTHKHqFfjgdn9LLP: tuffnutSignals,
  // Rhinar, Reckless Rampage / Rhinar
  wr9wBtTWwRrPrdhCRHCdN: rhinarSignals,
  wNRqrHCn6rrKLhrDkqPwp: rhinarSignals,
  // Ser Boltyn, Breaker of Dawn / Boltyn
  QrKGJL7bHCFKbr9N9MNpm: boltynSignals,
  Fmf8trg9w8B8BBbWrf8w9: boltynSignals,
};

export function projectFabViewerHeroSignals(
  state: HeroSignalState,
  player: HeroSignalPlayer,
): readonly FabViewerHeroSignal[] {
  if (!player.heroCardId) return [];
  const canonicalId = state.objects[player.heroCardId]?.canonicalId ?? player.heroCardId;
  return HERO_SIGNAL_PROJECTORS[canonicalId]?.(state, player) ?? [];
}
