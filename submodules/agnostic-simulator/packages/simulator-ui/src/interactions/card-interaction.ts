import type { SimulatorEntity } from "@tcg/simulator-contract";
import { useCallback, useEffect, useMemo, useState } from "react";

/** UI-safe description of an engine-validated action associated with card entities. */
export interface CardInteractionAction {
  readonly id: string;
  readonly sourceEntityIds: readonly string[];
  readonly label: string;
  readonly disabledReason?: string;
}

/** One mutually-exclusive presentation state, ordered by visual precedence. */
export type CardInteractionState =
  | { readonly kind: "idle" }
  | { readonly kind: "actionable"; readonly actionCount: number }
  | { readonly kind: "selected"; readonly actionCount: number }
  | { readonly kind: "targetable"; readonly label?: string };

export type CardInteractionStateResolver = (entity: SimulatorEntity) => CardInteractionState;

export interface CardActionPickerModel {
  readonly entity: SimulatorEntity;
  readonly actions: readonly CardInteractionAction[];
}

export interface CardInteractionControllerOptions {
  readonly actions: readonly CardInteractionAction[];
  readonly targetableEntityIds?: ReadonlySet<string>;
  readonly targetLabel?: string;
  /** Games can retain a deliberate select-then-act flow by leaving this false. */
  readonly autoExecuteSingle?: boolean;
  readonly onExecute: (actionId: string) => void;
  readonly onInspect: (entity: SimulatorEntity) => void;
  readonly onTarget?: (entity: SimulatorEntity) => void;
}

export interface CardInteractionController {
  readonly selectedEntityId: string | null;
  readonly actionPicker: CardActionPickerModel | null;
  readonly stateFor: (entity: SimulatorEntity) => CardInteractionState;
  readonly activate: (entity: SimulatorEntity) => void;
  readonly executeAction: (actionId: string) => void;
  readonly clear: () => void;
}

const IDLE_CARD_INTERACTION: CardInteractionState = { kind: "idle" };

export function cardInteractionStateFromFlags({
  selected = false,
  targetable = false,
  actionable = false,
}: {
  readonly selected?: boolean;
  readonly targetable?: boolean;
  readonly actionable?: boolean;
}): CardInteractionState {
  if (selected) return { kind: "selected", actionCount: 1 };
  if (targetable) return { kind: "targetable" };
  if (actionable) return { kind: "actionable", actionCount: 1 };
  return IDLE_CARD_INTERACTION;
}

export function actionsForCard(
  actions: readonly CardInteractionAction[],
  entityId: string,
): readonly CardInteractionAction[] {
  return actions.filter(
    (action) => action.disabledReason === undefined && action.sourceEntityIds.includes(entityId),
  );
}

/**
 * Resolves presentation with one explicit precedence:
 * selected > targetable > actionable > idle.
 */
export function resolveCardInteractionState({
  entityId,
  actions,
  selectedEntityId,
  targetableEntityIds,
  targetLabel,
}: {
  readonly entityId: string;
  readonly actions: readonly CardInteractionAction[];
  readonly selectedEntityId?: string | null;
  readonly targetableEntityIds?: ReadonlySet<string>;
  readonly targetLabel?: string;
}): CardInteractionState {
  const enabledActions = actionsForCard(actions, entityId);
  if (selectedEntityId === entityId && enabledActions.length > 0) {
    return { kind: "selected", actionCount: enabledActions.length };
  }
  if (targetableEntityIds?.has(entityId)) {
    return { kind: "targetable", ...(targetLabel ? { label: targetLabel } : {}) };
  }
  if (enabledActions.length > 0) {
    return { kind: "actionable", actionCount: enabledActions.length };
  }
  return IDLE_CARD_INTERACTION;
}

/** Shared click/select/inspect controller; engine payloads remain in the game-owned action registry. */
export function useCardInteractionController({
  actions,
  targetableEntityIds,
  targetLabel,
  autoExecuteSingle = false,
  onExecute,
  onInspect,
  onTarget,
}: CardInteractionControllerOptions): CardInteractionController {
  const [selectedEntity, setSelectedEntity] = useState<SimulatorEntity | null>(null);
  const selectedActions = useMemo(
    () => (selectedEntity ? actionsForCard(actions, selectedEntity.id) : []),
    [actions, selectedEntity],
  );

  useEffect(() => {
    if (selectedEntity && selectedActions.length === 0) setSelectedEntity(null);
  }, [selectedActions.length, selectedEntity]);

  const clear = useCallback(() => setSelectedEntity(null), []);

  const activate = useCallback(
    (entity: SimulatorEntity) => {
      if (targetableEntityIds?.has(entity.id) && onTarget) {
        onTarget(entity);
        setSelectedEntity(null);
        return;
      }

      const available = actionsForCard(actions, entity.id);
      if (available.length === 0) {
        setSelectedEntity(null);
        onInspect(entity);
        return;
      }

      if (autoExecuteSingle && available.length === 1) {
        onExecute(available[0]!.id);
        setSelectedEntity(null);
        return;
      }

      setSelectedEntity(entity);
    },
    [actions, autoExecuteSingle, onExecute, onInspect, onTarget, targetableEntityIds],
  );

  const executeAction = useCallback(
    (actionId: string) => {
      const action = selectedActions.find((candidate) => candidate.id === actionId);
      if (!action) return;
      onExecute(action.id);
      setSelectedEntity(null);
    },
    [onExecute, selectedActions],
  );

  const stateFor = useCallback(
    (entity: SimulatorEntity) =>
      resolveCardInteractionState({
        entityId: entity.id,
        actions,
        selectedEntityId: selectedEntity?.id,
        targetableEntityIds,
        targetLabel,
      }),
    [actions, selectedEntity?.id, targetLabel, targetableEntityIds],
  );

  return {
    selectedEntityId: selectedEntity?.id ?? null,
    actionPicker:
      selectedEntity && selectedActions.length > 0
        ? { entity: selectedEntity, actions: selectedActions }
        : null,
    stateFor,
    activate,
    executeAction,
    clear,
  };
}
