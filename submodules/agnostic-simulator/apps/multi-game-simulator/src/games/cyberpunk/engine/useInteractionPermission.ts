import { useMemo } from "react";
import type { EngineInteractionView, EntityKind, InteractionInput } from "@tcg/protocol";
import { useEngineInteractionView, useEngineOptional } from "./engineContext";
import type { Side } from "./sides";

export interface SelectableInteraction {
  actionId: string;
  inputId: string;
  valueKind: "single" | "array" | "option";
  entityKind: EntityKind;
  min: number;
  max: number;
  optionId?: string;
}

/**
 * What a card on the board is allowed to do right now, given the engine's
 * prompt. Both click handlers and drag-and-drop must consult this hook so the
 * two interaction paths can never disagree about legality.
 */
export type Permission =
  | { kind: "inert" }
  | {
      kind: "armable";
      /**
       * Protocol action ids for which this card is a valid candidate. The UI
       * uses this to decide which destinations to highlight when armed.
       */
      actionIds: string[];
    }
  | {
      kind: "selectable";
      interaction: SelectableInteraction;
    };

interface PermissionMaps {
  /** Card ids that are valid sources / first-step candidates in `select-action`. */
  armable: Map<string, string[]>;
  /** Card ids that can be picked as a target in `select-target`. */
  selectable: Map<string, SelectableInteraction>;
}

type EntitySelectionInput = Extract<InteractionInput, { kind: "entity-selection" }>;

function isEntitySelectionInput(input: InteractionInput): input is EntitySelectionInput {
  return input.kind === "entity-selection";
}

/** Build per-card permission maps from the shared protocol view. */
export function computePermissions(view: EngineInteractionView): PermissionMaps {
  const armable = new Map<string, string[]>();
  const selectable = new Map<string, SelectableInteraction>();

  if (view.status === "ready" || view.status === "choosing") {
    for (const action of view.actions) {
      if (!action.enabled) continue;
      const readyInput = action.inputs.find(isEntitySelectionInput);
      const candidateInputs =
        view.status === "ready"
          ? readyInput
            ? [readyInput]
            : []
          : action.inputs.filter(isEntitySelectionInput);
      const candidates = candidateInputs.flatMap((input) =>
        input.candidates
          .filter((candidate) => candidate.enabled)
          .map((candidate) => candidate.entity.instanceId),
      );
      for (const id of candidates) {
        if (view.status === "ready") {
          const existing = armable.get(id);
          if (existing) {
            existing.push(action.id);
          } else {
            armable.set(id, [action.id]);
          }
        } else {
          const input = action.inputs.find(
            (candidateInput) =>
              candidateInput.kind === "entity-selection" &&
              candidateInput.candidates.some(
                (candidate) => candidate.enabled && candidate.entity.instanceId === id,
              ),
          );
          if (input?.kind === "entity-selection") {
            selectable.set(id, {
              actionId: action.id,
              inputId: input.id,
              valueKind: input.max > 1 || input.id.endsWith("Ids") ? "array" : "single",
              entityKind: input.entityKinds[0] ?? "card",
              min: input.min,
              max: input.max,
            });
          }
        }
      }

      if (view.status === "choosing") {
        for (const input of action.inputs) {
          if (input.kind !== "option-selection" || input.id !== "triggerId") continue;
          for (const option of input.options) {
            const sourceCardId = option.text.params?.sourceCardId;
            if (!option.enabled || typeof sourceCardId !== "string") continue;
            selectable.set(sourceCardId, {
              actionId: action.id,
              inputId: input.id,
              valueKind: "option",
              entityKind: "card",
              min: input.min,
              max: input.max,
              optionId: option.id,
            });
          }
        }
      }
    }
  }

  return { armable, selectable };
}

export function useInteractionPermissions(side: Side): PermissionMaps {
  const interactionView = useEngineInteractionView(side);
  const engine = useEngineOptional();
  return useMemo(
    () =>
      engine?.hasPendingRemoteMove ? emptyPermissionMaps() : computePermissions(interactionView),
    [engine?.hasPendingRemoteMove, interactionView],
  );
}

export function useInteractionPermission(side: Side, cardId: string): Permission {
  const maps = useInteractionPermissions(side);
  const armable = maps.armable.get(cardId);
  if (armable) {
    return { kind: "armable", actionIds: armable };
  }
  const selectable = maps.selectable.get(cardId);
  if (selectable) {
    return { kind: "selectable", interaction: selectable };
  }
  return { kind: "inert" };
}

function emptyPermissionMaps(): PermissionMaps {
  return { armable: new Map(), selectable: new Map() };
}
