import type {
  EngineInteractionView,
  EntityCandidate,
  InteractionAction,
  InteractionText,
} from "@tcg/protocol";
import type { SimulatorCardAction } from "@tcg/simulator-contract";

const SOURCE_ROLES = new Set(["source", "attacker", "defender", "from"]);

export interface CardActionPresentation {
  readonly label?: string;
  readonly detail?: string;
  readonly order: number;
  readonly shortcut?: string;
  readonly activation?: SimulatorCardAction["activation"];
}

export interface ProjectInteractionCardActionsOptions {
  readonly presentationFor: (action: InteractionAction, entityId: string) => CardActionPresentation;
  readonly fallbackDisabledReason?: string;
}

/**
 * Preserve action-level and source-candidate availability while projecting the
 * protocol into the renderer contract. This intentionally does not decide
 * which action categories apply to a card; game adapters own that catalog.
 */
export function projectInteractionCardActions(
  view: EngineInteractionView,
  entityId: string,
  options: ProjectInteractionCardActionsOptions,
): SimulatorCardAction[] {
  const projected: SimulatorCardAction[] = [];

  for (const action of view.actions) {
    const sourceCandidate = sourceCandidateFor(action, entityId);
    const isDirectSource = action.source?.instanceId === entityId;
    if (!sourceCandidate && !isDirectSource) continue;

    const presentation = options.presentationFor(action, entityId);
    const candidateEnabled = sourceCandidate?.enabled !== false;
    const enabled = action.enabled && candidateEnabled;
    const disabledText = sourceCandidate?.disabledText ?? action.disabledText;
    const reason =
      interactionTextLabel(disabledText) ??
      options.fallbackDisabledReason ??
      "Unavailable right now.";

    projected.push({
      id: `${action.id}:${entityId}`,
      sourceEntityId: entityId,
      label: presentation.label ?? interactionTextLabel(action.text) ?? humanizeId(action.id),
      detail: presentation.detail,
      order: presentation.order,
      shortcut: presentation.shortcut,
      activation: presentation.activation ?? activationFor(action),
      commandRef: action.id,
      availability: enabled
        ? { kind: "enabled" }
        : {
            kind: "disabled",
            reason,
            reasonCode: disabledText?.key,
          },
    });
  }

  return projected;
}

function sourceCandidateFor(
  action: InteractionAction,
  entityId: string,
): EntityCandidate | undefined {
  for (const input of action.inputs) {
    if (input.kind !== "entity-selection" || !SOURCE_ROLES.has(input.role)) continue;
    const candidate = input.candidates.find(
      (entry) => entry.entity.kind === "card" && entry.entity.instanceId === entityId,
    );
    if (candidate) return candidate;
  }
  return undefined;
}

function activationFor(action: InteractionAction): SimulatorCardAction["activation"] {
  const unresolvedInputs = action.inputs.filter((input) => {
    if (input.kind !== "entity-selection") return true;
    return !SOURCE_ROLES.has(input.role);
  });
  return unresolvedInputs.length > 0 ? "begin-selection" : "execute";
}

export function interactionTextLabel(text: InteractionText | undefined): string | undefined {
  if (!text) return undefined;
  const label = text.params?.label;
  if (typeof label === "string" && label.trim().length > 0) return label;

  const needed = numberParam(text, "needed") ?? numberParam(text, "required");
  const available = numberParam(text, "available");
  if (needed !== undefined && available !== undefined) {
    return `Needs ${needed} — ${available} available.`;
  }

  if (!text.key.includes(".")) return text.key;
  const lastSegment = text.key.split(".").at(-1);
  return lastSegment ? humanizeId(lastSegment) : undefined;
}

function numberParam(text: InteractionText, key: string): number | undefined {
  const value = text.params?.[key];
  return typeof value === "number" ? value : undefined;
}

export function humanizeId(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
