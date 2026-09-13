import type {
  SimulatorCardAction,
  SimulatorEntity,
  SimulatorRendererProps,
} from "@tcg/simulator-contract";
import type { EngineInteractionView } from "@tcg/protocol";
import { CardContextMenuController } from "@tcg/simulator-ui";
import { useCallback, useMemo, type ReactNode } from "react";

import {
  getGearAttachTargets,
  getProgramSpatialTargets,
  interactionViewAbilityIndexForCard,
  PLAYER_SIDE_TO_ID,
  useEngine,
  type EngineCardType,
  type MoveId,
} from "../../engine";
import {
  CARD_ACTION_HOTKEY_SLOTS,
  getCardActionHotkey,
  getCardActionLabel,
  isCardActionHotkeyMoveId,
  type CardActionHotkeyMoveId,
} from "../GameBoard/cardActionHotkeys";
import { useAttackSelection } from "../GameBoard/useAttackSelection";
import { useMoveSelection } from "../GameBoard/MoveSelectionContext";
import { useCardPreview } from "../CardPreview/CardPreviewContext";
import { useSimulatorSettings } from "../../../../simulator/settings";
import { projectInteractionCardActions } from "../../../../simulator/card-context/project-card-actions";

interface CyberpunkCardContextControllerProps {
  readonly fixture: SimulatorRendererProps["fixture"];
  readonly children: ReactNode;
}

export function CyberpunkCardContextController({
  fixture,
  children,
}: CyberpunkCardContextControllerProps) {
  const engine = useEngine();
  const moveSelection = useMoveSelection();
  const attackSelection = useAttackSelection();
  const { show: showCardPreview, hide: hideCardPreview } = useCardPreview();
  const { settings, setCardInteractionMode } = useSimulatorSettings();
  const view = engine.interactionViews[engine.humanSide];
  const humanPlayerId = String(PLAYER_SIDE_TO_ID[engine.humanSide]);
  const zoneByEntityId = useMemo(() => {
    const map = new Map<string, string>();
    for (const zone of fixture.table.zones) {
      for (const entityId of zone.entityIds) map.set(entityId, zone.id);
    }
    return map;
  }, [fixture.table.zones]);
  const entityById = useMemo(
    () => new Map(fixture.entities.map((entity) => [entity.id, entity])),
    [fixture.entities],
  );

  const actionsForEntity = useCallback(
    (entityId: string): readonly SimulatorCardAction[] => {
      const entity = entityById.get(entityId);
      if (!entity || entity.ownerId !== humanPlayerId || entity.face === "hidden") return [];

      const protocolActions = projectInteractionCardActions(view, entityId, {
        presentationFor(action) {
          const known = isCardActionHotkeyMoveId(action.id) ? action.id : null;
          return {
            label: known ? getCardActionLabel(known) : undefined,
            detail: actionDetail(action.id),
            order: known ? actionOrder(known) : 100,
            shortcut: known ? getCardActionHotkey(known) : undefined,
          };
        },
        fallbackDisabledReason: "This action is unavailable in the current game state.",
      });
      const expandedActions = expandAbilityActions(protocolActions, view, entityId);
      const projectedCommands = new Set(
        expandedActions.flatMap((action) => {
          const commandRef = baseCommandRef(action.commandRef);
          return commandRef ? [commandRef] : [];
        }),
      );
      const zoneId = zoneByEntityId.get(entityId) ?? "";
      const structuralMoves = structuralMovesFor(entity, zoneId, projectedCommands);

      const structuralActions = structuralMoves.flatMap<SimulatorCardAction>((moveId) => {
        const matching = expandedActions.filter(
          (action) => baseCommandRef(action.commandRef) === moveId,
        );
        if (matching.length > 0) return matching;
        return [
          {
            id: `${moveId}:${entityId}`,
            sourceEntityId: entityId,
            label: getCardActionLabel(moveId),
            detail: actionDetail(moveId),
            order: actionOrder(moveId),
            shortcut: getCardActionHotkey(moveId),
            activation: actionActivation(moveId),
            commandRef: moveId,
            availability: {
              kind: "disabled",
              reason: disabledReasonFor(moveId, entity, engine),
              reasonCode: `cyberpunk.${moveId}.unavailable`,
            },
          } satisfies SimulatorCardAction,
        ];
      });
      const representedActionRefs = new Set(
        structuralActions.flatMap((action) => (action.commandRef ? [action.commandRef] : [])),
      );
      for (const rule of entity.details?.rules ?? []) {
        if (!rule.actionId?.startsWith("activateAbility:")) continue;
        if (representedActionRefs.has(rule.actionId)) continue;
        const abilityIndex = Number(rule.actionId.split(":")[1]);
        structuralActions.push({
          id: `${rule.actionId}:${entityId}`,
          sourceEntityId: entityId,
          label: rule.label ?? `Ability ${abilityIndex + 1}`,
          detail: rule.text,
          order: actionOrder("activateAbility") + abilityIndex / 100,
          shortcut: getCardActionHotkey("activateAbility"),
          activation: "begin-selection",
          commandRef: rule.actionId,
          availability: {
            kind: "disabled",
            reason: disabledReasonFor("activateAbility", entity, engine),
            reasonCode: "cyberpunk.activateAbility.unavailable",
          },
        });
      }
      return structuralActions;
    },
    [engine, entityById, humanPlayerId, view, zoneByEntityId],
  );

  const executeAction = useCallback(
    (action: SimulatorCardAction) => {
      if (action.availability.kind !== "enabled" || !action.commandRef) return;
      const [rawMoveId, abilityIndexText] = action.commandRef.split(":");
      if (!isCardActionHotkeyMoveId(rawMoveId)) return;
      const entity = entityById.get(action.sourceEntityId);
      if (!entity) return;
      const side = engine.humanSide;
      const as = PLAYER_SIDE_TO_ID[side];
      const cardId = entity.id;

      if (rawMoveId === "playCard") {
        const cardType = cardTypeFor(entity);
        const attachTargets = getGearAttachTargets({ interactionView: view }, cardId, cardType);
        const programTargets = getProgramSpatialTargets(
          { matchState: engine.matchState, side, interactionView: view },
          cardId,
        );
        if (attachTargets.length > 0 || programTargets.length > 0) {
          moveSelection.setSelection({
            side,
            moveId: rawMoveId,
            sourceCardId: cardId,
            sourceCardType: cardType,
          });
          return;
        }
        engine.dispatch({ type: rawMoveId, cardId, as });
        return;
      }
      if (rawMoveId === "sellCard" || rawMoveId === "goSolo") {
        engine.dispatch({ type: rawMoveId, cardId, as });
        return;
      }
      if (rawMoveId === "callLegend") {
        engine.dispatch({ type: rawMoveId, cardId, as });
        return;
      }
      if (rawMoveId === "attackUnit") {
        attackSelection.setAttacker(side, cardId, "fight");
        return;
      }
      if (rawMoveId === "attackRival") {
        engine.dispatch({ type: rawMoveId, attackerId: cardId, as });
        return;
      }
      if (rawMoveId === "useBlocker") {
        engine.dispatch({ type: rawMoveId, blockerId: cardId, as });
        return;
      }
      if (rawMoveId === "activateAbility") {
        const parsedAbilityIndex = abilityIndexText ? Number(abilityIndexText) : Number.NaN;
        const abilityIndex = Number.isInteger(parsedAbilityIndex)
          ? parsedAbilityIndex
          : interactionViewAbilityIndexForCard(view, cardId);
        if (abilityIndex === null) return;
        engine.dispatch({ type: rawMoveId, cardId, abilityIndex, as });
      }
    },
    [attackSelection, engine, entityById, moveSelection, view],
  );

  const promptActive =
    Boolean(engine.matchState.G.turnMetadata.pendingChoice) ||
    moveSelection.selection !== null ||
    attackSelection.selection !== null ||
    Boolean(engine.effectCardTargetSelection);

  const previewEntity = useCallback(
    (entity: SimulatorEntity) => {
      if (entity.face !== "public" || !entity.imageUrl) return;
      showCardPreview({
        imageUrl: entity.imageUrl,
        face: "public",
        alt: entity.title,
        details: {
          name: entity.title,
          cardType: entity.subtitle,
          cost: statValue(entity, "Cost"),
          effectiveCost: statValue(entity, "Cost"),
          power: statValue(entity, "Power"),
          effectivePower: statValue(entity, "Power"),
          classifications: entity.traits,
          rules: entity.details?.rules.map((rule) => rule.text),
          activeEffects: entity.activeEffects?.map((effect) => ({
            label: effect.label,
            detail: effect.detail,
          })),
        },
      });
    },
    [showCardPreview],
  );

  return (
    <CardContextMenuController
      entities={fixture.entities}
      actionsForEntity={actionsForEntity}
      mode={settings.cardInteractionMode}
      stateVersion={fixture.table.status.stateVersion}
      promptActive={promptActive}
      onModeChange={setCardInteractionMode}
      onAction={executeAction}
      onPreviewEntity={previewEntity}
      onPreviewEnd={hideCardPreview}
    >
      {children}
    </CardContextMenuController>
  );
}

function statValue(entity: SimulatorEntity, label: string): number | null {
  const value = entity.stats.find((stat) => stat.label === label)?.value;
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function structuralMovesFor(
  entity: SimulatorEntity,
  zoneId: string,
  projectedCommands: ReadonlySet<string>,
): CardActionHotkeyMoveId[] {
  const moves = new Set<CardActionHotkeyMoveId>();
  const traits = new Set(entity.traits.map(normalizeTrait));

  if (zoneId.endsWith("-hand")) {
    moves.add("playCard");
    if (entity.decorations?.some((decoration) => decoration.id === "sell-tag")) {
      moves.add("sellCard");
    }
    if (traits.has("gosolo")) moves.add("goSolo");
  }

  if (zoneId.endsWith("-legendArea") && entity.kind === "leader") {
    moves.add("callLegend");
  }

  if (zoneId.endsWith("-field") && entity.kind === "unit") {
    moves.add("attackUnit");
    moves.add("attackRival");
    if (traits.has("blocker")) moves.add("useBlocker");
  }

  for (const commandRef of projectedCommands) {
    if (isCardActionHotkeyMoveId(commandRef)) moves.add(commandRef);
  }

  return CARD_ACTION_HOTKEY_SLOTS.map((slot) => slot.moveId).filter((moveId) => moves.has(moveId));
}

function expandAbilityActions(
  actions: readonly SimulatorCardAction[],
  view: EngineInteractionView,
  entityId: string,
): SimulatorCardAction[] {
  const result: SimulatorCardAction[] = [];
  for (const action of actions) {
    if (action.commandRef !== "activateAbility") {
      result.push(action);
      continue;
    }
    const actionView = view.actions.find((candidate) => candidate.id === "activateAbility");
    const abilityInput = actionView?.inputs.find(
      (input) => input.kind === "option-selection" && input.id === "abilityIndex",
    );
    const indexes =
      abilityInput?.kind === "option-selection"
        ? abilityInput.options.flatMap((option) => {
            const cardId = option.text.params?.cardId;
            const index = Number(option.text.params?.index ?? option.id);
            return cardId === entityId && Number.isInteger(index) ? [index] : [];
          })
        : [];
    if (indexes.length <= 1) {
      const index = indexes[0];
      result.push({
        ...action,
        commandRef: index === undefined ? action.commandRef : `${action.commandRef}:${index}`,
      });
      continue;
    }
    for (const index of indexes) {
      result.push({
        ...action,
        id: `${action.id}:${index}`,
        label: `Ability ${index + 1}`,
        commandRef: `${action.commandRef}:${index}`,
      });
    }
  }
  return result;
}

function disabledReasonFor(
  moveId: CardActionHotkeyMoveId,
  entity: SimulatorEntity,
  engine: ReturnType<typeof useEngine>,
): string {
  if (engine.activeSide !== engine.humanSide) return "It is not your turn.";
  if (engine.matchState.G.gamePhase !== "main") {
    return moveId === "useBlocker"
      ? "No rival attack can be blocked right now."
      : "Available during your Main Phase.";
  }
  if (moveId === "playCard" || moveId === "goSolo") {
    const cost = Number(entity.stats.find((stat) => stat.label === "Cost")?.value ?? 0);
    const available =
      engine.matchState.G.players[String(PLAYER_SIDE_TO_ID[engine.humanSide])]?.eddies;
    if (typeof available === "number" && cost > available) {
      return `Needs ${cost} Eddies — ${available} available.`;
    }
    return "This card's play requirements are not met.";
  }
  if (moveId === "sellCard") {
    const player = engine.matchState.G.players[String(PLAYER_SIDE_TO_ID[engine.humanSide])];
    return player?.soldThisTurn
      ? "You have already sold a card this turn."
      : "This card cannot be sold right now.";
  }
  if (moveId === "attackUnit" || moveId === "attackRival") {
    if (entity.states.includes("rested")) return "This Unit is spent.";
    if (entity.dataAttributes?.["data-has-lag"] === "true") {
      return "This Unit has Lag and cannot attack yet.";
    }
    return moveId === "attackUnit"
      ? "There is no spent rival Unit this Unit can attack."
      : "This Unit cannot attack the rival right now.";
  }
  if (moveId === "activateAbility") return "This ability's activation requirements are not met.";
  if (moveId === "useBlocker") return "No rival attack can be blocked right now.";
  if (moveId === "callLegend") return "You cannot Call this Legend right now.";
  return "Unavailable right now.";
}

function actionDetail(moveId: string): string | undefined {
  const details: Partial<Record<MoveId, string>> = {
    playCard: "Pay its current Eddie cost and resolve its Play effect.",
    sellCard: "Reveal this Sell-tag card and place it face-down in your Eddies area.",
    callLegend: "Spend 1 Eddie to flip this Legend face-up.",
    goSolo: "Play this Unit ready so it can attack this turn.",
    attackUnit: "Spend this Unit, then choose a spent rival Unit.",
    attackRival: "Spend this Unit to attack the rival directly.",
    useBlocker: "Spend this ready Unit to redirect the rival attack.",
    activateAbility: "Pay the printed activation cost and resolve this ability.",
  };
  return details[moveId as MoveId];
}

function actionOrder(moveId: CardActionHotkeyMoveId): number {
  return CARD_ACTION_HOTKEY_SLOTS.findIndex((slot) => slot.moveId === moveId);
}

function actionActivation(moveId: CardActionHotkeyMoveId): SimulatorCardAction["activation"] {
  return moveId === "playCard" || moveId === "attackUnit" ? "begin-selection" : "execute";
}

function normalizeTrait(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function baseCommandRef(value: string | undefined): string | undefined {
  return value?.split(":")[0];
}

function cardTypeFor(entity: SimulatorEntity): EngineCardType | undefined {
  const value = entity.dataAttributes?.["data-card-type"];
  return value === "unit" || value === "gear" || value === "program" || value === "legend"
    ? value
    : undefined;
}
