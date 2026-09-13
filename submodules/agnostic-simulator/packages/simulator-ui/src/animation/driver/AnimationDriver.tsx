import { EntityTransferLayer } from "./EntityTransferLayer";
import { EntityStateChangeLayer } from "./EntityStateChangeLayer";
import { CombatOverlay } from "../overlays/CombatOverlay";
import { EffectOverlay } from "../overlays/EffectOverlay";
import { PhaseChangeOverlay } from "../overlays/PhaseChangeOverlay";
import { ValueDeltaOverlay } from "../overlays/ValueDeltaOverlay";
import { EmphasisOverlay } from "../overlays/EmphasisOverlay";
import { RandomizationOverlay } from "../overlays/RandomizationOverlay";
import { GameResultOverlay } from "../overlays/GameResultOverlay";
import { ComparisonOverlay } from "../overlays/ComparisonOverlay";

export function AnimationDriver() {
  return (
    <>
      <EntityTransferLayer />
      <EntityStateChangeLayer />
      <EmphasisOverlay />
      <EffectOverlay />
      <CombatOverlay />
      <ValueDeltaOverlay />
      <PhaseChangeOverlay />
      <RandomizationOverlay />
      <ComparisonOverlay />
      <GameResultOverlay />
    </>
  );
}
