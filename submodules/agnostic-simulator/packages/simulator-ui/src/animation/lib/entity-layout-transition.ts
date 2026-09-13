import type { CompiledAnimationPlan } from "@tcg/simulator-runtime/animation";
import type { Transition } from "motion";

const LAYOUT_EASE = [0.22, 1, 0.36, 1] as const;

export function entityLayoutTransition(
  _entityId: string,
  compiledPlan: CompiledAnimationPlan | null | undefined,
): Transition {
  return {
    duration: (compiledPlan?.reflowDurationMs ?? 200) / 1_000,
    ease: LAYOUT_EASE,
  };
}

export function entityParticipatesInLayout(
  entityId: string,
  zoneId: string | undefined,
  compiledPlan: CompiledAnimationPlan | null | undefined,
): boolean {
  // The provider installs a compiled plan while the old presentation is still
  // rendered for the preparation frame. That gives Motion a source layout
  // without keeping every idle entity enrolled in layout projection. Updates
  // without a semantic plan intentionally snap in the transition store.
  if (!compiledPlan) return false;
  return hasEntityTransfer(entityId, compiledPlan) || hasZoneTransfer(zoneId, compiledPlan);
}

export function hasEntityTransfer(
  entityId: string,
  compiledPlan: CompiledAnimationPlan | null | undefined,
): boolean {
  return (
    compiledPlan?.steps.some((entry) => {
      if (entry.step.type !== "entityTransfer") return false;
      return (
        entry.step.entity.id === entityId ||
        (entry.step.from?.kind === "entity" && entry.step.from.id === entityId) ||
        (entry.step.to?.kind === "entity" && entry.step.to.id === entityId)
      );
    }) ?? false
  );
}

export function hasSourceCardExit(
  entityId: string,
  compiledPlan: CompiledAnimationPlan | null | undefined,
): boolean {
  return (
    compiledPlan?.steps.some(
      (entry) =>
        entry.step.type === "effect" &&
        entry.step.presentation === "source-card" &&
        entry.step.source?.kind === "entity" &&
        entry.step.source.id === entityId &&
        entry.step.sourceExitTo !== undefined,
    ) ?? false
  );
}

export function hasZoneTransfer(
  zoneId: string | undefined,
  compiledPlan: CompiledAnimationPlan | null | undefined,
): boolean {
  if (!zoneId) return false;
  return (
    compiledPlan?.steps.some((entry) => {
      if (entry.step.type !== "entityTransfer") return false;
      const { from, to } = entry.step;
      return (
        (from?.kind === "zone" && from.id === zoneId) || (to?.kind === "zone" && to.id === zoneId)
      );
    }) ?? false
  );
}
