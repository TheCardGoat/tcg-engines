import { z } from "zod";
import type { TimeControlConfig } from "@tcg/shared/game-engine";

/** Hosted time policy is separate from the reversible FAB rules state. */
export const FabClockSchema = z.object({
  timeControl: z.object({
    mode: z.literal("dynamic"),
    config: z.object({
      initialReserveMs: z.number().positive(),
      perActionBonusMs: z.number().nonnegative(),
      turnPassBonusMs: z.number().nonnegative(),
      reserveCapMs: z.number().positive(),
      graceMs: z.number().nonnegative(),
    }),
  }),
  clockState: z.record(
    z.string(),
    z.object({
      reserveMsRemaining: z.number(),
      lastUpdatedAtMs: z.number(),
      isOnClock: z.boolean(),
    }),
  ),
});
export type FabClock = z.infer<typeof FabClockSchema>;

export function readFabClock(state: unknown): FabClock | undefined {
  if (!state || typeof state !== "object" || !("ctx" in state) || state.ctx == null)
    return undefined;
  return FabClockSchema.parse(state.ctx);
}

export function createFabClock(
  config: TimeControlConfig | undefined,
  players: readonly string[],
  active: string | undefined,
  now: number,
): FabClock | undefined {
  if (!config || config.mode === "none") return undefined;
  if (config.mode !== "dynamic")
    throw new Error(`Unsupported FAB time-control mode "${config.mode}"`);
  const clock = FabClockSchema.parse({
    timeControl: {
      mode: "dynamic",
      config: {
        initialReserveMs: config.initialReserveMs,
        perActionBonusMs: config.perActionBonusMs ?? 0,
        turnPassBonusMs: config.turnPassBonusMs ?? 0,
        reserveCapMs: config.extras?.reserveCapMs ?? config.initialReserveMs,
        graceMs: config.extras?.graceMs ?? 0,
      },
    },
    clockState: Object.fromEntries(
      players.map((id) => [
        id,
        {
          reserveMsRemaining: config.initialReserveMs,
          lastUpdatedAtMs: now,
          isOnClock: id === active,
        },
      ]),
    ),
  });
  return clock;
}

export function fabRemainingMs(clock: FabClock, playerId: string, now: number): number {
  const player = clock.clockState[playerId];
  if (!player) return 0;
  return (
    player.reserveMsRemaining - (player.isOnClock ? Math.max(0, now - player.lastUpdatedAtMs) : 0)
  );
}

export function advanceFabClock(
  clock: FabClock,
  input: {
    actorId: string;
    activeId: string | undefined;
    now: number;
    actionBonus: boolean;
    turnEnded: boolean;
  },
): FabClock {
  const config = clock.timeControl.config;
  return {
    ...clock,
    clockState: Object.fromEntries(
      Object.entries(clock.clockState).map(([id]) => {
        const bonus =
          id === input.actorId
            ? (input.actionBonus ? config.perActionBonusMs : 0) +
              (input.turnEnded ? config.turnPassBonusMs : 0)
            : 0;
        return [
          id,
          {
            reserveMsRemaining: Math.min(
              config.reserveCapMs,
              fabRemainingMs(clock, id, input.now) + bonus,
            ),
            lastUpdatedAtMs: input.now,
            isOnClock: id === input.activeId,
          },
        ];
      }),
    ),
  };
}
