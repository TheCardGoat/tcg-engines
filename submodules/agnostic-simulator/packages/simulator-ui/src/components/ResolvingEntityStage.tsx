import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardFace } from "./CardFace";
import { projectSimulatorEntityForFace } from "./entity-visibility";
import { useAnimationNode } from "../animation/hooks/useAnimationNode";
import { useOptionalAnimationRuntime } from "../animation/provider/contexts";
import styles from "./ResolvingEntityStage.module.css";

export interface ResolvingEntityStageProps {
  readonly entity: SimulatorEntity | null;
  readonly active: boolean;
  readonly anchorId: string;
  readonly label: string;
  readonly showLabel?: boolean;
  readonly className?: string;
  readonly labelClassName?: string;
  readonly entityClassName?: string;
  readonly testId?: string;
  readonly elevated?: boolean;
  readonly exiting?: boolean;
  readonly side?: "left" | "right";
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
  showLabel = true,
  className,
  labelClassName,
  entityClassName,
  testId = "resolving-entity-stage",
  elevated = false,
  exiting = false,
  side,
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
      className={[className, elevated && styles.elevated, exiting && styles.exiting]
        .filter(Boolean)
        .join(" ")}
      data-card-presentation-layer={elevated ? "focus" : undefined}
      data-resolution-side={side}
      data-resolution-phase={exiting ? "exiting" : active ? "pending" : "anchor"}
      data-testid={testId}
      data-active={active ? "true" : "false"}
      data-entity-id={projected?.id}
      data-sim-entity-id={projected?.id}
      aria-hidden={!active}
      aria-label={active && projected ? `${label}: ${projected.title}` : undefined}
    >
      {showLabel ? <span className={labelClassName}>{label}</span> : null}
      <div
        ref={anchorRef}
        className={[entityClassName, elevated && styles.entity].filter(Boolean).join(" ")}
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
