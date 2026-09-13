import type {
  LegalCommandDescriptor,
  PotentialCardCommandDescriptor,
} from "@tcg/op-engine/practice-st01";
import type { SimulatorCardAction } from "@tcg/simulator-contract";
import { CardContextMenuController } from "@tcg/simulator-ui";
import { useCallback, useMemo, type ReactNode } from "react";

import { useSimulatorSettings } from "../../../simulator/settings/index.ts";
import type { OnePieceStaticBoard } from "../data/staticBoard.ts";

interface OnePieceCardContextControllerProps {
  readonly board: OnePieceStaticBoard;
  readonly actions: readonly LegalCommandDescriptor[];
  readonly cardActions: readonly PotentialCardCommandDescriptor[];
  readonly onAction?: (action: LegalCommandDescriptor) => void;
  readonly children: ReactNode;
}

const ACTION_PRESENTATION: Record<
  string,
  {
    readonly label: string;
    readonly detail: string;
    readonly order: number;
    readonly shortcut: string;
  }
> = {
  playCard: {
    label: "Play Card",
    detail: "Rest the required DON!! and play this Character, Event, or Stage.",
    order: 10,
    shortcut: "1",
  },
  attachDon: {
    label: "Give DON!!",
    detail: "Attach one active DON!! to this Leader or Character.",
    order: 20,
    shortcut: "2",
  },
  declareAttack: {
    label: "Attack",
    detail: "Rest this Leader or Character and choose an eligible attack target.",
    order: 30,
    shortcut: "3",
  },
  activateEffect: {
    label: "Activate [Main]",
    detail: "Pay this card's activation cost and resolve its [Main] effect.",
    order: 40,
    shortcut: "4",
  },
  block: {
    label: "Use [Blocker]",
    detail: "Rest this [Blocker] during the Block Step to redirect the battle.",
    order: 50,
    shortcut: "5",
  },
  counter: {
    label: "Use [Counter]",
    detail: "Trash this card from hand during the Counter Step to add its Counter value.",
    order: 60,
    shortcut: "6",
  },
};

export function OnePieceCardContextController({
  board,
  actions,
  cardActions,
  onAction,
  children,
}: OnePieceCardContextControllerProps) {
  const { settings, setCardInteractionMode } = useSimulatorSettings();
  const descriptorById = useMemo(
    () => new Map(cardActions.map((descriptor) => [commandRef(descriptor), descriptor])),
    [cardActions],
  );
  const cardActionsByEntity = useMemo(() => {
    const result = new Map<string, PotentialCardCommandDescriptor[]>();
    for (const action of cardActions) {
      if (!action.sourceId) continue;
      const current = result.get(action.sourceId) ?? [];
      current.push(action);
      result.set(action.sourceId, current);
    }
    return result;
  }, [cardActions]);
  const entityById = useMemo(
    () => new Map(board.entities.map((entity) => [entity.id, entity])),
    [board.entities],
  );

  const actionsForEntity = useCallback(
    (entityId: string): readonly SimulatorCardAction[] => {
      const entity = entityById.get(entityId);
      if (!entity || entity.face === "hidden" || entity.ownerId !== "player") return [];
      const descriptors = cardActionsByEntity.get(entityId) ?? [];
      const normalized = descriptors.map((descriptor) =>
        normalizeCardAction(descriptor, entityId, commandRef(descriptor)),
      );
      const printedText = (entity.details?.rules ?? [])
        .map((rule) => `${rule.label ?? ""} ${rule.text}`)
        .join(" ")
        .toLocaleLowerCase();

      if (printedText.includes("[blocker]")) {
        normalized.push(
          disabledStructuralAction(
            entityId,
            "block",
            "You can only use [Blocker] during the Block Step of an opponent's attack.",
          ),
        );
      }
      if (entity.dataAttributes?.["data-zone"] === "hand" && printedText.includes("[counter]")) {
        normalized.push(
          disabledStructuralAction(
            entityId,
            "counter",
            "You can only use [Counter] from hand during the Counter Step.",
          ),
        );
      }
      return normalized;
    },
    [cardActionsByEntity, entityById],
  );

  const executeAction = useCallback(
    (action: SimulatorCardAction) => {
      if (action.availability.kind !== "enabled" || !action.commandRef) return;
      const descriptor = descriptorById.get(action.commandRef);
      if (descriptor) onAction?.(descriptor);
    },
    [descriptorById, onAction],
  );

  const promptActive = actions.some(
    (action) =>
      action.type === "resolvePrompt" ||
      action.type === "chooseJoKenPo" ||
      action.type === "chooseFirstPlayer" ||
      action.type === "mulligan" ||
      action.type === "keepHand" ||
      action.type === "startGame",
  );

  return (
    <CardContextMenuController
      entities={board.entities}
      actionsForEntity={actionsForEntity}
      mode={settings.cardInteractionMode}
      stateVersion={board.table.status.stateVersion}
      promptActive={promptActive}
      onModeChange={setCardInteractionMode}
      onAction={executeAction}
    >
      {children}
    </CardContextMenuController>
  );
}

function normalizeCardAction(
  descriptor: PotentialCardCommandDescriptor,
  entityId: string,
  ref: string,
): SimulatorCardAction {
  const presentation = presentationFor(descriptor.type);
  return {
    id: `${descriptor.type}:${entityId}`,
    sourceEntityId: entityId,
    label: presentation.label,
    detail: presentation.detail,
    order: presentation.order,
    shortcut: presentation.shortcut,
    activation:
      descriptor.targetIds?.length || descriptor.slotChoices?.length
        ? "begin-selection"
        : "execute",
    commandRef: ref,
    availability: descriptor.enabled
      ? { kind: "enabled" }
      : {
          kind: "disabled",
          reason: descriptor.disabledReason ?? "Unavailable right now.",
          reasonCode: descriptor.disabledReasonCode,
        },
  };
}

function disabledStructuralAction(
  entityId: string,
  type: "block" | "counter",
  reason: string,
): SimulatorCardAction {
  const presentation = presentationFor(type);
  return {
    id: `${type}:${entityId}`,
    sourceEntityId: entityId,
    ...presentation,
    activation: "begin-selection",
    commandRef: type,
    availability: {
      kind: "disabled",
      reason,
      reasonCode: `one-piece.${type}.wrong-timing`,
    },
  };
}

function presentationFor(type: string) {
  return (
    ACTION_PRESENTATION[type] ?? {
      label: type,
      detail: "Complete this One Piece card action.",
      order: 100,
      shortcut: "",
    }
  );
}

function commandRef(descriptor: PotentialCardCommandDescriptor): string {
  return `${descriptor.type}:${descriptor.sourceId ?? "global"}`;
}
