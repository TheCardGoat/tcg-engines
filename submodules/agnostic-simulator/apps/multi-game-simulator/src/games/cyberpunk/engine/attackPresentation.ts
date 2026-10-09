import type { MoveLogEntry } from "./index";

export type VisibleAttackStep = "attack" | "react" | "fight" | "steal";

/** Internal result resolution remains part of the player's Fight phase. */
export function visibleAttackStep(step: string | undefined): VisibleAttackStep | undefined {
  switch (step) {
    case "fightResult":
      return "fight";
    case "attack":
    case "react":
    case "fight":
    case "steal":
      return step;
    default:
      return undefined;
  }
}

export function getVisibleAttackStep(
  attack: { attackerId?: unknown; defenderId?: unknown; kind?: string; step?: string } | null,
  moveLogs: ReadonlyArray<MoveLogEntry>,
): VisibleAttackStep | undefined {
  const step = visibleAttackStep(attack?.step);
  if (!attack || step !== "attack" || attack.kind !== "fight") return step;
  const redirected = moveLogs.some(
    ({ log }) =>
      log.type === "useBlocker" &&
      String(log.attackerId) === String(attack.attackerId) &&
      String(log.blockerId) === String(attack.defenderId),
  );
  return redirected ? "react" : step;
}
