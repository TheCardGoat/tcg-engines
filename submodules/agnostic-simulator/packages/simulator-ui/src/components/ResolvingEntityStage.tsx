import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardFace } from "./CardFace";
import { projectSimulatorEntityForFace } from "./entity-visibility";
import { useAnimationNode } from "../animation/hooks/useAnimationNode";
import { useOptionalAnimationRuntime } from "../animation/provider/contexts";

export interface ResolvingEntityStageProps {
  readonly entity: SimulatorEntity | null;
  readonly active: boolean;
  readonly anchorId: string;
  readonly label: string;
  readonly className?: string;
  readonly labelClassName?: string;
  readonly entityClassName?: string;
  readonly testId?: string;
}

/**
 * Shared, privacy-safe stage for a card or token whose effect is resolving.
 * The renderer only receives the viewer-authorized entity projection.
 */
export function ResolvingEntityStage({
  entity,
  active,
  anchorId,
  label,
  className,
  labelClassName,
  entityClassName,
  testId = "resolving-entity-stage",
}: ResolvingEntityStageProps) {
  const runtime = useOptionalAnimationRuntime();
  const anchorRef = useAnimationNode(
    { kind: "anchor", id: anchorId },
    { presence: "present", density: "normal" },
  );
  const projected = entity
    ? projectSimulatorEntityForFace(entity, entity.face === "hidden" ? "hidden" : "public")
    : null;

  return (
    <div
      {...(projected?.dataAttributes ?? {})}
      className={className}
      data-testid={testId}
      data-active={active ? "true" : "false"}
      data-entity-id={projected?.id}
      data-sim-entity-id={projected?.id}
      aria-hidden={!active}
      aria-label={active && projected ? `${label}: ${projected.title}` : undefined}
    >
      <span className={labelClassName}>{label}</span>
      <div
        ref={anchorRef}
        className={entityClassName}
        data-testid={`${testId}-entity`}
        data-sim-anchor-id={anchorId}
      >
        {projected ? (
          runtime ? (
            <runtime.entityRenderer entity={projected} density="normal" />
          ) : (
            <CardFace
              entity={projected}
              density="normal"
              fill
              fullImageChrome="edge-to-edge"
              fullImageFit="contain"
            />
          )
        ) : null}
      </div>
    </div>
  );
}
