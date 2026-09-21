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
import { usePaymentSelection } from "../PaymentSelection/PaymentSelectionContext";
import { useSimulatorSettings } from "../../../../simulator/settings";
import { projectInteractionCardActions } from "../../../../simulator/card-context/project-card-actions";
import {
  MANUAL_CARD_ZONE_TARGETS,
  MANUAL_DECK_MOVE_TARGETS,
  MANUAL_GIG_FACE_MAX,
} from "../../engine/boardCorrection";
import { CYBERPUNK_CARD_CONTEXT_VISUAL_IDENTITY } from "./CyberpunkCardContextVisualIdentity";

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
  const { dispatchCostedAction, paymentSelectionActive } = usePaymentSelection();
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
      if (!entity) return [];
      if (entity.face === "hidden" && entity.ownerId !== humanPlayerId) return [];
      if (entity.ownerId !== humanPlayerId && !engine.boardCorrectionEnabled) return [];

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
      const expandedActions = expandAbilityActions(protocolActions, view, entity, entityId);
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
        const presentation = abilityActionPresentation(entity, abilityIndex);
        structuralActions.push({
          id: `${rule.actionId}:${entityId}`,
          sourceEntityId: entityId,
          label: presentation.label,
          detail: presentation.detail,
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
      const correctionActions = engine.boardCorrectionEnabled
        ? correctionActionsForEntity({
            entity,
            zoneId,
            entities: fixture.entities,
            matchState: engine.matchState,
          })
        : [];
      if (engine.boardCorrectionEnabled) {
        if (correctionActions.length > 0) return correctionActions;
        return structuralActions.filter((action) => action.availability.kind === "enabled");
      }
      if (entity.ownerId !== humanPlayerId) return [];
      return structuralActions;
    },
    [engine, entityById, fixture.entities, humanPlayerId, view, zoneByEntityId],
  );
  const autoActivationActionsForEntity = useCallback(
    (entityId: string): readonly SimulatorCardAction[] =>
      actionsForEntity(entityId).filter((action) => {
        const commandRef = baseCommandRef(action.commandRef);
        return commandRef === "useBlocker" || commandRef === "activateAbility";
      }),
    [actionsForEntity],
  );

  const executeAction = useCallback(
    (action: SimulatorCardAction) => {
      if (action.availability.kind !== "enabled" || !action.commandRef) return;
      const as = PLAYER_SIDE_TO_ID[engine.humanSide];
      if (action.commandRef.startsWith("manualMoveCard:")) {
        const [toZone, position] = action.commandRef.slice("manualMoveCard:".length).split(":");
        if (
          toZone === "hand" ||
          toZone === "field" ||
          toZone === "eddieArea" ||
          toZone === "trash" ||
          toZone === "legendArea" ||
          toZone === "deck"
        ) {
          engine.dispatch({
            type: "manualMoveCard",
            cardId: action.sourceEntityId,
            toZone,
            deckPosition:
              toZone === "deck" && (position === "top" || position === "bottom")
                ? position
                : undefined,
            trashPosition: toZone === "trash" && position === "bottom" ? "bottom" : undefined,
            as,
          });
        }
        return;
      }
      if (action.commandRef.startsWith("manualSetCardFace:")) {
        engine.dispatch({
          type: "manualSetCardFace",
          cardId: action.sourceEntityId,
          faceDown: action.commandRef.endsWith(":down"),
          as,
        });
        return;
      }
      if (action.commandRef === "manualDetachGear") {
        engine.dispatch({ type: "manualDetachGear", gearId: action.sourceEntityId, as });
        return;
      }
      if (action.commandRef.startsWith("manualAttachGear:")) {
        engine.dispatch({
          type: "manualAttachGear",
          gearId: action.sourceEntityId,
          hostId: action.commandRef.slice("manualAttachGear:".length),
          as,
        });
        return;
      }
      if (action.commandRef.startsWith("manualSetGigValue:")) {
        const value = Number(action.commandRef.slice("manualSetGigValue:".length));
        if (Number.isInteger(value)) {
          engine.dispatch({
            type: "manualSetGigValue",
            dieId: action.sourceEntityId,
            value,
            as,
          });
        }
        return;
      }
      if (action.commandRef === "manualExertCard") {
        engine.dispatch({ type: "manualExertCard", cardId: action.sourceEntityId, as });
        return;
      }
      if (action.commandRef === "manualReadyCard") {
        engine.dispatch({ type: "manualReadyCard", cardId: action.sourceEntityId, as });
        return;
      }
      if (action.commandRef.startsWith("manualDrawCard:")) {
        const from = action.commandRef.slice("manualDrawCard:".length);
        const owner = playerIdFromText(entityById.get(action.sourceEntityId)?.ownerId);
        if (from === "top" || from === "bottom") {
          engine.dispatch({
            type: "manualDrawCard",
            from,
            playerId: owner ?? undefined,
            as,
          });
        }
        return;
      }
      if (action.commandRef.startsWith("manualMoveGig:")) {
        const [, toPlayerIdText, location] = action.commandRef.split(":");
        const toPlayerId = playerIdFromText(toPlayerIdText);
        if (toPlayerId !== null && (location === "gigArea" || location === "fixerArea")) {
          engine.dispatch({
            type: "manualMoveGig",
            dieId: action.sourceEntityId,
            toPlayerId,
            location,
            as,
          });
        }
        return;
      }
      const [rawMoveId, abilityIndexText] = action.commandRef.split(":");
      if (!isCardActionHotkeyMoveId(rawMoveId)) return;
      const entity = entityById.get(action.sourceEntityId);
      if (!entity) return;
      const side = engine.humanSide;
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
        dispatchCostedAction({ type: "playCard", cardId, as });
        return;
      }
      if (rawMoveId === "sellCard") {
        engine.dispatch({ type: rawMoveId, cardId, as });
        return;
      }
      if (rawMoveId === "goSolo") {
        dispatchCostedAction({ type: rawMoveId, cardId, as });
        return;
      }
      if (rawMoveId === "callLegend") {
        dispatchCostedAction({ type: rawMoveId, cardId, as });
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
    [attackSelection, dispatchCostedAction, engine, entityById, moveSelection, view],
  );

  const promptActive =
    !engine.boardCorrectionEnabled &&
    (Boolean(engine.matchState.G.turnMetadata.pendingChoice) ||
      moveSelection.selection !== null ||
      attackSelection.selection !== null ||
      Boolean(engine.effectCardTargetSelection));

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
      autoActivationActionsForEntity={autoActivationActionsForEntity}
      autoActivateSingleEnabledAction
      mode={settings.cardInteractionMode}
      stateVersion={
        fixture.table.status.stateVersion + (engine.boardCorrectionEnabled ? 1_000_000_000 : 0)
      }
      promptActive={promptActive || paymentSelectionActive}
      allowNonPublicEntities={engine.boardCorrectionEnabled}
      onModeChange={setCardInteractionMode}
      onAction={executeAction}
      onPreviewEntity={previewEntity}
      onPreviewEnd={hideCardPreview}
      visualIdentity={CYBERPUNK_CARD_CONTEXT_VISUAL_IDENTITY}
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
  entity: SimulatorEntity,
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
      const presentation =
        index === undefined ? undefined : abilityActionPresentation(entity, index);
      result.push({
        ...action,
        ...presentation,
        commandRef: index === undefined ? action.commandRef : `${action.commandRef}:${index}`,
      });
      continue;
    }
    for (const index of indexes) {
      const presentation = abilityActionPresentation(entity, index);
      result.push({
        ...action,
        id: `${action.id}:${index}`,
        label: presentation.label,
        detail: presentation.detail,
        commandRef: `${action.commandRef}:${index}`,
      });
    }
  }
  return result;
}

function printedAbilityText(entity: SimulatorEntity, abilityIndex: number): string | undefined {
  const rule = entity.details?.rules?.find(
    (candidate) => candidate.actionId === `activateAbility:${abilityIndex}`,
  );
  const text = rule?.text?.trim();
  return text ? text : undefined;
}

function abilityActionPresentation(
  entity: SimulatorEntity,
  abilityIndex: number,
): { label: string; detail?: string } {
  const text = printedAbilityText(entity, abilityIndex);
  if (text) return { label: text, detail: undefined };
  return {
    label: `Ability ${abilityIndex + 1}`,
    detail: actionDetail("activateAbility"),
  };
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

function currentManualZone(
  zoneId: string,
  engineZone?: string,
): "hand" | "field" | "eddieArea" | "trash" | "legendArea" | "deck" | null {
  const source = engineZone ?? zoneId;
  if (source.endsWith("hand") || source === "hand") return "hand";
  if (source.endsWith("field") || source === "field") return "field";
  if (source.includes("eddie") || source === "eddieArea") return "eddieArea";
  if (source.endsWith("trash") || source === "trash") return "trash";
  if (source.toLowerCase().includes("legend") || source === "legendArea") return "legendArea";
  if (source.endsWith("deck") || source === "deck") return "deck";
  return null;
}

function playerIdFromText(
  value: string | undefined,
): (typeof PLAYER_SIDE_TO_ID)[keyof typeof PLAYER_SIDE_TO_ID] | null {
  if (value === String(PLAYER_SIDE_TO_ID.player)) return PLAYER_SIDE_TO_ID.player;
  if (value === String(PLAYER_SIDE_TO_ID.opponent)) return PLAYER_SIDE_TO_ID.opponent;
  return null;
}

function correctionActionsForEntity({
  entity,
  zoneId,
  entities,
  matchState,
}: {
  entity: SimulatorEntity;
  zoneId: string;
  entities: readonly SimulatorEntity[];
  matchState: ReturnType<typeof useEngine>["matchState"];
}): SimulatorCardAction[] {
  if (entity.kind === "die") {
    return correctionActionsForDie({ entity, zoneId, matchState });
  }
  if (entity.id.endsWith("-deck-stack") || entity.traits.includes("deck")) {
    return correctionActionsForDeck(entity);
  }

  const actions: SimulatorCardAction[] = [];
  const instance = matchState.G.cardIndex[entity.id];
  const currentZone = currentManualZone(zoneId, instance?.zone);
  const cardType = cardTypeFor(entity);
  const isLegend = cardType === "legend" || entity.kind === "leader";
  if (currentZone) {
    const destinations = [
      ...MANUAL_CARD_ZONE_TARGETS.filter((target) => {
        if (target.zone === currentZone) return false;
        if (target.zone === "legendArea" && !isLegend) return false;
        return true;
      }).map((target) => ({
        id: `manualMoveCard:${target.zone}:${entity.id}`,
        label: target.label,
        commandRef: `manualMoveCard:${target.zone}`,
      })),
      ...MANUAL_DECK_MOVE_TARGETS.map((target) => ({
        id: `manualMoveCard:deck:${target.position}:${entity.id}`,
        label: target.label,
        commandRef: `manualMoveCard:deck:${target.position}`,
      })),
      {
        id: `manualMoveCard:trash:bottom:${entity.id}`,
        label: "Trash (bottom)",
        commandRef: "manualMoveCard:trash:bottom",
      },
    ];
    if (destinations.length > 0) {
      actions.push({
        id: `manualMoveCard:${entity.id}`,
        sourceEntityId: entity.id,
        label: "Move",
        detail: "Send this card to another zone.",
        order: 200,
        activation: "begin-selection",
        availability: { kind: "enabled" },
        children: destinations.map((target, index) => ({
          id: target.id,
          sourceEntityId: entity.id,
          label: target.label,
          order: 201 + index,
          activation: "execute" as const,
          commandRef: target.commandRef,
          availability: { kind: "enabled" as const },
        })),
      });
    }
  }

  const spent = instance?.meta.spent === true;
  if (
    instance &&
    (currentZone === "field" || currentZone === "eddieArea" || currentZone === "legendArea")
  ) {
    actions.push({
      id: spent ? `manualReadyCard:${entity.id}` : `manualExertCard:${entity.id}`,
      sourceEntityId: entity.id,
      label: spent ? "Ready" : "Spend",
      detail: spent ? "Turn this card ready." : "Turn this card spent.",
      order: 190,
      activation: "execute",
      commandRef: spent ? "manualReadyCard" : "manualExertCard",
      availability: { kind: "enabled" },
    });
  }

  if (isLegend && instance?.zone === "legendArea") {
    const faceDown = instance.meta.faceDown === true;
    actions.push({
      id: `manualSetCardFace:${entity.id}`,
      sourceEntityId: entity.id,
      label: faceDown ? "Flip face-up" : "Flip face-down",
      detail: "Board correction: flip this Legend without moving it.",
      order: 191,
      activation: "execute",
      commandRef: faceDown ? "manualSetCardFace:up" : "manualSetCardFace:down",
      availability: { kind: "enabled" },
    });
  }

  const isGear = entity.subtitle === "gear" || cardType === "gear";
  if (isGear && instance?.meta.attachedToId) {
    actions.push({
      id: `manualDetachGear:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Unattach",
      order: 220,
      activation: "execute",
      commandRef: "manualDetachGear",
      availability: { kind: "enabled" },
    });
  }
  if (isGear && !instance?.meta.attachedToId) {
    const hosts = entities.filter(
      (candidate) =>
        candidate.ownerId === entity.ownerId &&
        candidate.id !== entity.id &&
        (candidate.kind === "unit" || candidate.kind === "leader") &&
        candidate.face === "public",
    );
    const attachChildren = hosts.map((host, index) => ({
      id: `manualAttachGear:${host.id}:${entity.id}`,
      sourceEntityId: entity.id,
      label: host.title,
      order: 231 + index,
      activation: "execute" as const,
      commandRef: `manualAttachGear:${host.id}`,
      availability: { kind: "enabled" as const },
    }));
    if (attachChildren.length === 1) {
      actions.push({
        ...attachChildren[0]!,
        label: `Attach to ${attachChildren[0]!.label}`,
        order: 230,
      });
    } else if (attachChildren.length > 1) {
      actions.push({
        id: `manualAttachGear:${entity.id}`,
        sourceEntityId: entity.id,
        label: "Attach",
        detail: "Choose a Unit or Legend to attach this Gear to.",
        order: 230,
        activation: "begin-selection",
        availability: { kind: "enabled" },
        children: attachChildren,
      });
    }
  }
  return actions;
}

function correctionActionsForDeck(entity: SimulatorEntity): SimulatorCardAction[] {
  return [
    {
      id: `manualDrawCard:top:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Draw top",
      detail: "Move the top card of this deck to hand.",
      order: 200,
      activation: "execute",
      commandRef: "manualDrawCard:top",
      availability: { kind: "enabled" },
    },
    {
      id: `manualDrawCard:bottom:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Draw bottom",
      detail: "Move the bottom card of this deck to hand.",
      order: 201,
      activation: "execute",
      commandRef: "manualDrawCard:bottom",
      availability: { kind: "enabled" },
    },
  ];
}

function correctionActionsForDie({
  entity,
  zoneId,
  matchState,
}: {
  entity: SimulatorEntity;
  zoneId: string;
  matchState: ReturnType<typeof useEngine>["matchState"];
}): SimulatorCardAction[] {
  const die = matchState.G.gigDice[entity.id];
  if (!die) return [];
  const ownerId = playerIdFromText(entity.ownerId);
  if (ownerId === null) return [];
  const rivalId =
    ownerId === PLAYER_SIDE_TO_ID.player ? PLAYER_SIDE_TO_ID.opponent : PLAYER_SIDE_TO_ID.player;
  const inGigArea = zoneId.endsWith("-gigArea");
  const inFixer = zoneId.endsWith("-fixer");
  const max = MANUAL_GIG_FACE_MAX[die.dieType];
  const actions: SimulatorCardAction[] = [];
  if (inGigArea) {
    actions.push({
      id: `manualSetGigValue:dec:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Decrease face",
      order: 200,
      activation: "execute",
      commandRef: `manualSetGigValue:${die.faceValue - 1}`,
      availability:
        die.faceValue <= 1
          ? { kind: "disabled", reason: "This Gig is already at its minimum face." }
          : { kind: "enabled" },
    });
    actions.push({
      id: `manualSetGigValue:inc:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Increase face",
      order: 201,
      activation: "execute",
      commandRef: `manualSetGigValue:${die.faceValue + 1}`,
      availability:
        die.faceValue >= max
          ? { kind: "disabled", reason: "This Gig is already at its maximum face." }
          : { kind: "enabled" },
    });
  }
  const moveChildren: SimulatorCardAction[] = [];
  if (inGigArea) {
    moveChildren.push({
      id: `manualMoveGig:rival:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Give to rival",
      order: 211,
      activation: "execute",
      commandRef: `manualMoveGig:${rivalId}:gigArea`,
      availability: { kind: "enabled" },
    });
    moveChildren.push({
      id: `manualMoveGig:fixer:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Return to fixer",
      order: 212,
      activation: "execute",
      commandRef: `manualMoveGig:${ownerId}:fixerArea`,
      availability: { kind: "enabled" },
    });
  }
  if (inFixer) {
    moveChildren.push({
      id: `manualMoveGig:gig:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Move to Gigs",
      order: 211,
      activation: "execute",
      commandRef: `manualMoveGig:${ownerId}:gigArea`,
      availability: { kind: "enabled" },
    });
  }
  if (moveChildren.length === 1) {
    actions.push(moveChildren[0]!);
  } else if (moveChildren.length > 1) {
    actions.push({
      id: `manualMoveGig:${entity.id}`,
      sourceEntityId: entity.id,
      label: "Move",
      detail: "Send this Gig to another area.",
      order: 210,
      activation: "begin-selection",
      availability: { kind: "enabled" },
      children: moveChildren,
    });
  }
  return actions;
}
