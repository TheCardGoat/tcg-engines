export type VisualAnimationEvent =
  | CombatVisualAnimationEvent
  | PhaseChangeVisualAnimationEvent
  | ResourceFloatVisualAnimationEvent;

export interface VisualAnimationBaseEvent {
  readonly id: string;
  readonly delayMs?: number;
  readonly durationMs?: number;
}

export interface CombatVisualAnimationEvent extends VisualAnimationBaseEvent {
  readonly primitive: "combat";
  readonly sourceEntityId: string;
  readonly targetEntityId?: string;
  readonly targetPlayerId?: string;
  readonly reason: "declared" | "resolved";
}

export interface PhaseChangeVisualAnimationEvent extends VisualAnimationBaseEvent {
  readonly primitive: "phaseChange";
  readonly from: string;
  readonly to: string;
}

export interface ResourceFloatVisualAnimationEvent extends VisualAnimationBaseEvent {
  readonly primitive: "resourceFloat";
  readonly playerId: string;
  readonly delta: number;
  readonly label?: string;
  readonly anchorId?: string;
}
