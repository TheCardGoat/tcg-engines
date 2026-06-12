export type EffectExecutionStatus = "resolved" | "blocked" | "suspended";

export interface EffectExecutionResult<TRemaining = unknown> {
  status: EffectExecutionStatus;
  remaining?: readonly TRemaining[];
  blockedReason?: string;
}

export interface EffectRuntime<TAction, TContext> {
  canResolve(action: TAction, context: TContext): boolean;
  resolve(action: TAction, context: TContext): EffectExecutionResult;
}

export type PrimitiveValue =
  | { kind: "literal"; value: string | number | boolean | null }
  | { kind: "count"; target: CoreTargetRef; multiplier?: number }
  | { kind: "attribute"; target: CoreTargetRef; attribute: string };

export type CoreTargetRef = { kind: "resolved"; id: string } | { kind: "slot"; id: string };
export type CoreZoneRef = { zone: string; owner?: "self" | "friendly" | "opponent" | "any" };
export type CoreDuration = { scope: "instant" | "turn" | "battle" | "permanent" };
export type CoreChoicePrompt = { id: string; target: CoreTargetRef; min: number; max: number };

export interface NumericClamp {
  min?: number;
  max?: number | { kind: "attribute"; target: CoreTargetRef; attribute: string };
}

export type CorePrimitiveAction =
  | {
      op: "meta.adjustNumber";
      target: CoreTargetRef;
      key: string;
      amount: PrimitiveValue;
      clamp?: NumericClamp;
      duration?: CoreDuration;
    }
  | {
      op: "meta.set";
      target: CoreTargetRef;
      key: string;
      value: PrimitiveValue;
      duration?: CoreDuration;
    }
  | {
      op: "meta.remove";
      target: CoreTargetRef;
      key: string;
    }
  | {
      op: "entity.move";
      target: CoreTargetRef;
      destination: CoreZoneRef;
      position?: "top" | "bottom" | { index: number };
    }
  | {
      op: "entity.create";
      blueprint: string;
      owner: "self" | "friendly" | "opponent" | "any";
      destination: CoreZoneRef;
    }
  | {
      op: "event.emit";
      eventType: string;
      payload: Record<string, PrimitiveValue>;
    }
  | {
      op: "log.emit";
      messageKey: string;
      params?: Record<string, PrimitiveValue>;
    };

export type CoreEffectNode =
  | CorePrimitiveAction
  | { op: "sequence"; steps: CoreEffectNode[] }
  | { op: "parallel"; steps: CoreEffectNode[] }
  | {
      op: "when";
      condition: import("./conditions.ts").CoreCondition<string>;
      then: CoreEffectNode;
      otherwise?: CoreEffectNode;
    }
  | { op: "repeat"; count: PrimitiveValue; step: CoreEffectNode }
  | { op: "choose"; prompt: CoreChoicePrompt; then: CoreEffectNode }
  | { op: "optional"; prompt: CoreChoicePrompt; then: CoreEffectNode };

export interface PrimitivePatch {
  entityId: string;
  path: readonly string[];
  previous: unknown;
  next: unknown;
  eventHint?: string;
}

export interface PrimitiveRuntime<TContext> {
  preview(effect: CoreEffectNode, context: TContext): PrimitivePatch[];
  apply(effect: CoreEffectNode, context: TContext): EffectExecutionResult;
}

/**
 * Registry that converts a game's native effect DSL into shared effect nodes.
 */
export interface GameEffectRegistry<TNativeEffect, TContext> {
  compile(native: TNativeEffect, context: TContext): CoreEffectNode;
  describe(native: TNativeEffect, context: TContext): string;
  postApply?(
    native: TNativeEffect,
    patches: readonly PrimitivePatch[],
    context: TContext,
  ): EffectExecutionResult;
}
