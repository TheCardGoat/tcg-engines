import type { FabLegalCommand } from "@tcg/flesh-and-blood-engine/simulator";
import type { CardInteractionAction } from "@tcg/simulator-ui";

export interface FabCardActionProjection {
  readonly actions: readonly CardInteractionAction[];
  readonly commandByActionId: ReadonlyMap<string, FabLegalCommand>;
}

export interface FabAttackTargetDraft {
  readonly action: CardInteractionAction;
  readonly commandByTargetId: ReadonlyMap<string, FabLegalCommand>;
}

export interface FabAttackTargetCardActionProjection {
  readonly actions: readonly CardInteractionAction[];
  readonly draftByActionId: ReadonlyMap<string, FabAttackTargetDraft>;
}

function stableCommandValueKey(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableCommandValueKey).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableCommandValueKey(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? String(value);
}

function attackTargetGroupKey(command: FabLegalCommand): string | null {
  if (
    (command.move !== "begin-play" && command.move !== "activate") ||
    typeof command.payload.target !== "string"
  ) {
    return null;
  }
  const { target: _target, ...declaration } = command.payload;
  return `${command.move}:${command.sourceInstanceId ?? ""}:${stableCommandValueKey(declaration)}`;
}

/** Collapse otherwise-identical targeted attacks into one board-native target draft. */
export function projectFabAttackTargetCardActions(
  projection: FabCardActionProjection,
): FabAttackTargetCardActionProjection {
  const groups = new Map<
    string,
    { readonly actions: CardInteractionAction[]; readonly commands: FabLegalCommand[] }
  >();

  for (const action of projection.actions) {
    const command = projection.commandByActionId.get(action.id);
    if (!command) continue;
    const key = attackTargetGroupKey(command);
    if (!key) continue;
    const group = groups.get(key) ?? { actions: [], commands: [] };
    group.actions.push(action);
    group.commands.push(command);
    groups.set(key, group);
  }

  const replacedActionIds = new Set<string>();
  const replacementAfterActionId = new Map<string, CardInteractionAction>();
  const draftByActionId = new Map<string, FabAttackTargetDraft>();
  for (const group of groups.values()) {
    const commandByTargetId = new Map(
      group.commands.flatMap((command) =>
        typeof command.payload.target === "string"
          ? [[command.payload.target, command] as const]
          : [],
      ),
    );
    if (commandByTargetId.size < 2) continue;
    const firstAction = group.actions[0];
    const sourceEntityId = firstAction?.sourceEntityIds[0];
    if (!firstAction || !sourceEntityId) continue;
    const action: CardInteractionAction = {
      id: `fab:choose-attack-target:${firstAction.id}`,
      sourceEntityIds: [sourceEntityId],
      label: "Choose attack target",
    };
    for (const candidate of group.actions) replacedActionIds.add(candidate.id);
    replacementAfterActionId.set(firstAction.id, action);
    draftByActionId.set(action.id, { action, commandByTargetId });
  }

  return {
    actions: projection.actions.flatMap((action) => {
      const replacement = replacementAfterActionId.get(action.id);
      if (replacement) return [replacement];
      return replacedActionIds.has(action.id) ? [] : [action];
    }),
    draftByActionId,
  };
}

/**
 * Project engine-legal FAB commands into UI-safe card actions.
 * Only explicit card source fields participate: generic targets may be players,
 * prompt choices, or other game-native identifiers and are intentionally ignored.
 */
export function projectFabCardActions(
  commands: readonly FabLegalCommand[],
): FabCardActionProjection {
  const actions: CardInteractionAction[] = [];
  const commandByActionId = new Map<string, FabLegalCommand>();

  commands.forEach((command, commandIndex) => {
    // This card-scoped configuration has its own bell control. It must never
    // participate in the ordinary single-action card click path.
    if (
      command.move === "set-optional-trigger-automation" ||
      command.move === "set-automation-preferences"
    )
      return;
    const sourceEntityIds = sourceCardIds(command);
    if (sourceEntityIds.length === 0) return;
    const id = `fab:${command.move}:${commandIndex}:${sourceEntityIds.join("+")}`;
    actions.push({ id, sourceEntityIds, label: command.label });
    commandByActionId.set(id, command);
  });

  return { actions, commandByActionId };
}

export function sourceCardIds(command: FabLegalCommand): readonly string[] {
  const ids = new Set<string>();
  if (command.sourceInstanceId) ids.add(command.sourceInstanceId);
  if (typeof command.payload.instanceId === "string") ids.add(command.payload.instanceId);
  if (Array.isArray(command.payload.instanceIds)) {
    for (const id of command.payload.instanceIds) {
      if (typeof id === "string") ids.add(id);
    }
  }
  return [...ids];
}
