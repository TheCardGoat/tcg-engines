import type { PlayerId } from "../types";

type TurnOwnerStatus = {
  readonly turnOwnerId?: string;
  readonly otp?: string;
};

type TurnOwnerCtx = {
  readonly status?: TurnOwnerStatus;
  readonly priority?: {
    readonly holder?: string;
  };
  readonly playerIds?: readonly PlayerId[];
};

type TurnOwnerG = {
  readonly turnsCompletedByPlayer?: Record<string, number>;
};

/**
 * Canonical turn-owner resolver.
 *
 * Prefers explicit `status.turnOwnerId`. Falls back to OTP + completed-turns
 * only for migration/test states where `turnOwnerId` is absent.
 */
export function resolveTurnOwnerId(ctx: TurnOwnerCtx, G?: TurnOwnerG): PlayerId | undefined {
  const explicitTurnOwner = ctx.status?.turnOwnerId as PlayerId | undefined;
  if (explicitTurnOwner) {
    return explicitTurnOwner;
  }

  const otp = ctx.status?.otp as PlayerId | undefined;
  if (!otp) {
    return ctx.priority?.holder as PlayerId | undefined;
  }

  const playerIds = ctx.playerIds ?? [];
  if (playerIds.length === 0) {
    return otp;
  }

  const turnsCompleted = G?.turnsCompletedByPlayer ?? {};
  const totalCompletedTurns = Object.values(turnsCompleted).reduce(
    (sum, count) => sum + (count ?? 0),
    0,
  );
  if (totalCompletedTurns === 0) {
    return otp;
  }

  const otpIndex = playerIds.findIndex((playerId) => playerId === otp);
  if (otpIndex < 0) {
    return otp;
  }

  const offset = totalCompletedTurns % playerIds.length;
  return playerIds[(otpIndex + offset) % playerIds.length] as PlayerId;
}
