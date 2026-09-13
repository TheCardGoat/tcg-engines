import { ClockReadout } from "@tcg/simulator-ui";
import { fabRemainingMs, type FabClock } from "@tcg/flesh-and-blood-server-adapter/clock";

export function FabMatchClock({
  clock,
  playerId,
  label,
  now,
}: {
  clock?: FabClock;
  playerId: string;
  label: string;
  now: number;
}) {
  if (!clock || !clock.clockState[playerId]) return null;
  const remaining = fabRemainingMs(clock, playerId, now);
  const expired = remaining <= 0;
  const seconds = Math.ceil(Math.max(0, remaining) / 1000);
  const value = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <ClockReadout
      labelMode="aria"
      label={label}
      value={value}
      aria-label={`${label}: ${value}${expired ? ", time expired" : ""}`}
      title={expired ? "Time expired" : undefined}
      active={clock.clockState[playerId]?.isOnClock}
      urgency={expired ? "critical" : remaining <= 30_000 ? "warning" : "normal"}
      data-expired={expired ? "true" : undefined}
      className={expired ? "text-red-400" : remaining <= 30_000 ? "text-amber-300" : undefined}
    />
  );
}
