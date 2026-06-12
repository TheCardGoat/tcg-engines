import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  IconBolt,
  IconClockPause,
  IconShield,
  IconSkull,
  IconSwordOff,
  IconZoomIn,
} from "@tabler/icons-react";
import {
  buildInteractionSubmissionForActionId,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { useCardInspect } from "./CardInspectContext";
import type { CardPreviewDetails } from "./CardPreviewContext";
import { CardImage } from "./CardImage";
import { CardNameToken } from "./CardNameToken";
import { simEntityAnchor } from "./animationAnchors";
import { encodeCardSourceId, encodeTargetId, useDragDrop } from "./DragDropContext";
import { useAttackSelectionState } from "./useAttackSelection";
import { useMoveSelection, useMoveSelectionStateForSide } from "./MoveSelectionContext";
import { useFloatingPointMenu } from "./useFloatingPointMenu";
import {
  CARD_ACTION_HOTKEY_SLOTS,
  getCardActionHotkey,
  getCardActionLabel,
  isCardActionHotkeyMoveId,
  type CardActionHotkeyMoveId,
} from "./cardActionHotkeys";
import {
  PLAYER_SIDE_TO_ID,
  getGearAttachTargets,
  getProgramSpatialTargets,
  interactionSubmissionToEngineAction,
  interactionViewAbilityIndexForCard,
  interactionViewActionHasCandidate,
  interactionViewCanFightTarget,
  useEngineOptional,
  useInteractionPermission,
  type CardActiveEffectView,
  type EngineCardType,
  type EffectiveRule,
  type MoveId,
  type Side,
} from "../../engine";
import classes from "./Card.module.css";

const GEAR_PEEK_PERCENT = 24;
/** Sentinel side used when a card is rendered without engine awareness. */
const NO_SIDE: Side = "player";
type CardMenuAction = {
  id: CardActionHotkeyMoveId;
  label: string;
  hotkey: string;
  run: () => void;
};

export interface CardGearAttachment {
  imageUrl: string;
  name: string;
  cardId?: string;
  cardType?: EngineCardType;
  power?: number | null;
  effectivePower?: number | null;
  cost?: number | null;
  effectiveCost?: number | null;
  costEffects?: readonly CardActiveEffectView[];
  classifications?: readonly string[];
  keywords?: readonly string[];
  rulesText?: string | null;
  effectiveRules?: readonly EffectiveRule[];
  activeEffects?: readonly CardActiveEffectView[];
  hasSellTag?: boolean;
}

interface CardProps {
  imageUrl?: string;
  name?: string;
  /** Card frame color — used for hover-preview accent border. */
  color?: "blue" | "green" | "red" | "yellow";
  faceDown?: boolean;
  gear?: CardGearAttachment[];
  /** Where this card lives — required to participate in drag-and-drop. */
  zone?: string;
  index?: number;
  /** Allow dropping another card onto this one (e.g. to attach gear). */
  acceptsDrop?: boolean;
  /**
   * Engine instance id. When provided alongside `side`, the card is "engine
   * aware" and consults `useInteractionPermission` to gate drag/click + render
   * the appropriate state. Without these props, the card is always draggable
   * (legacy sample-fixture behavior).
   */
  cardId?: string;
  /** Public card category. Only rendered into DOM attributes while face-up. */
  cardType?: EngineCardType;
  side?: Side;
  /** When set, the card is "armed" (user picked it as the source of a 2-step move). */
  armed?: boolean;
  /** Whether the primary card face is spent/tapped. Attached gear remains upright. */
  tapped?: boolean;
  /** Whether a unit entered the field this turn and is still attack-restricted. */
  playedThisTurn?: boolean;
  /** Some zones show spent state with their own overlay instead of rotating the card. */
  rotateWhenTapped?: boolean;
  /** Owner-only look effect: render the face while preserving face-down semantics. */
  peeked?: boolean;
  /** Engine-effective rules shown as compact ability badges on face-up cards. */
  effectiveRules?: readonly EffectiveRule[];
  /** Printed rules text shown when the hover preview image is still loading or unavailable. */
  rulesText?: string | null;
  /** Faction/sub-type tags shown in preview fallback. */
  classifications?: readonly string[];
  /** Printed keywords shown in preview fallback. */
  keywords?: readonly string[];
  /** Sell tag (`€$`) shown in preview fallback. */
  hasSellTag?: boolean;
  /** Engine cost (eddies). Surfaced as `data-cost` and the cost badge. */
  cost?: number | null;
  /** Engine-computed cost after card-level modifiers. */
  effectiveCost?: number | null;
  /** Active cost modifiers currently changing this card's play cost. */
  costEffects?: readonly CardActiveEffectView[];
  /** Printed power before gear, static modifiers, and temporary effects. */
  power?: number | null;
  /** Engine-computed power after gear and active modifiers. */
  effectivePower?: number | null;
  /** Active effects currently changing or threatening this card. */
  activeEffects?: readonly CardActiveEffectView[];
  /** Click hook — receives the cardId (or undefined for legacy cards). */
  onCardClick?: (cardId: string | undefined) => void;
}

export function Card({
  imageUrl,
  name,
  color,
  faceDown = false,
  gear = [],
  zone,
  index,
  acceptsDrop = false,
  cardId,
  cardType,
  side,
  armed = false,
  tapped = false,
  rotateWhenTapped = true,
  peeked = false,
  effectiveRules = [],
  rulesText,
  classifications = [],
  keywords = [],
  hasSellTag = false,
  playedThisTurn = false,
  cost,
  effectiveCost,
  costEffects = [],
  power,
  effectivePower,
  activeEffects = [],
  onCardClick,
}: CardProps) {
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const powerMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Hooks are always called. When the card is not engine-aware (no cardId or
  // no provider), the hooks return safe defaults.
  const engineCtx = useEngineOptional();
  const choiceSide = engineCtx?.humanSide ?? side ?? NO_SIDE;
  const choicePermission = useInteractionPermission(choiceSide, cardId ?? "");
  const selectablePermission =
    choicePermission.kind === "selectable"
      ? { side: choiceSide, permission: choicePermission }
      : null;
  const permission = selectablePermission?.permission ?? choicePermission;
  const permissionSide = selectablePermission?.side ?? side ?? NO_SIDE;
  const choiceTargetKind = selectablePermission
    ? selectablePermission.permission.interaction.entityKind === "die"
      ? "gig"
      : "card"
    : null;
  const effectCardTargetSelected = Boolean(
    cardId &&
    engineCtx?.effectCardTargetSelection?.side === permissionSide &&
    engineCtx.effectCardTargetSelection.targetIds.includes(cardId),
  );
  const selectedMoveState = useMoveSelectionStateForSide(side ?? NO_SIDE);
  const selectedMove = selectedMoveState?.moveId ?? null;
  const moveSelection = useMoveSelection();
  const globalSelectedMoveState =
    moveSelection.selection?.side === (engineCtx?.humanSide ?? NO_SIDE)
      ? moveSelection.selection
      : null;
  const attackSelection = useAttackSelectionState(side, cardId);
  const engineAware = Boolean(cardId && side && engineCtx);
  const { activeSource } = useDragDrop();
  const sourcePermission = useInteractionPermission(
    engineCtx?.humanSide ?? NO_SIDE,
    activeSource?.cardId ?? "",
  );
  const globalSelectedSourcePermission = useInteractionPermission(
    engineCtx?.humanSide ?? NO_SIDE,
    globalSelectedMoveState?.sourceCardId ?? "",
  );
  const { inspect } = useCardInspect();
  const selectedPlayCardSourceCandidate =
    selectedMove === "playCard" &&
    !selectedMoveState?.sourceCardId &&
    Boolean(
      cardId &&
      side &&
      engineCtx &&
      interactionViewActionHasCandidate(
        engineCtx.interactionViews[side],
        "playCard",
        "cardId",
        cardId,
      ),
    );
  const selectedMoveIsLegal =
    Boolean(selectedMove) &&
    permission.kind === "armable" &&
    permission.actionIds.some((actionId) => actionId === selectedMove) &&
    (selectedMove !== "playCard" || selectedPlayCardSourceCandidate);
  const selectedGearAttachTargets =
    selectedMoveState?.moveId === "playCard" &&
    selectedMoveState.sourceCardId &&
    selectedMoveState.sourceCardType === "gear" &&
    engineCtx
      ? getGearAttachTargets(
          {
            interactionView: engineCtx.interactionViews[side ?? NO_SIDE],
          },
          selectedMoveState.sourceCardId,
          selectedMoveState.sourceCardType,
        )
      : [];
  const selectedGearAttachTarget = Boolean(
    selectedMoveState?.moveId === "playCard" &&
    selectedMoveState.sourceCardId &&
    cardId &&
    selectedGearAttachTargets.includes(cardId),
  );
  const activeGearAttachTarget =
    activeSource?.zone === "p-hand" &&
    activeSource.cardId &&
    activeSource.cardType === "gear" &&
    cardId &&
    engineCtx &&
    getGearAttachTargets(
      {
        interactionView: engineCtx.interactionViews[engineCtx.humanSide],
      },
      activeSource.cardId,
      activeSource.cardType,
    ).includes(cardId);
  const selectedProgramSpatialTargets =
    globalSelectedMoveState?.moveId === "playCard" &&
    globalSelectedMoveState.sourceCardId &&
    globalSelectedSourcePermission.kind === "armable" &&
    engineCtx
      ? getProgramSpatialTargets(
          {
            matchState: engineCtx.matchState,
            side: globalSelectedMoveState.side,
            interactionView: engineCtx.interactionViews[globalSelectedMoveState.side],
          },
          globalSelectedMoveState.sourceCardId,
        )
      : [];
  const selectedProgramSpatialTarget = Boolean(
    globalSelectedMoveState?.moveId === "playCard" &&
    globalSelectedMoveState.sourceCardId &&
    cardId &&
    selectedProgramSpatialTargets.includes(cardId),
  );
  const activeProgramSpatialTarget =
    activeSource?.zone === "p-hand" &&
    activeSource.cardId &&
    cardId &&
    sourcePermission.kind === "armable" &&
    engineCtx &&
    getProgramSpatialTargets(
      {
        matchState: engineCtx.matchState,
        side: engineCtx.humanSide,
        interactionView: engineCtx.interactionViews[engineCtx.humanSide],
      },
      activeSource.cardId,
    ).includes(cardId);
  const isValidAttackDropTarget =
    engineAware &&
    acceptsDrop &&
    activeSource?.cardId &&
    cardId &&
    activeSource.zone === "p-field" &&
    zone === "opp-field" &&
    engineCtx &&
    interactionViewCanFightTarget(
      engineCtx.interactionViews[engineCtx.humanSide],
      activeSource.cardId,
      cardId,
    );
  const isValidGearDropTarget = engineAware && acceptsDrop && Boolean(activeGearAttachTarget);
  const isValidProgramDropTarget =
    engineAware && acceptsDrop && Boolean(activeProgramSpatialTarget);

  const draggable =
    zone !== undefined &&
    index !== undefined &&
    !faceDown &&
    (!engineAware || permission.kind === "armable");

  const sourceId = draggable
    ? encodeCardSourceId({
        type: "card",
        zone: zone!,
        index: index!,
        imageUrl,
        name,
        cardId,
        cardType,
      })
    : "";
  const droppableId =
    acceptsDrop && zone !== undefined && index !== undefined
      ? encodeTargetId({ type: "card", zone: zone!, index: index!, cardId })
      : "";

  const drag = useDraggable({ id: sourceId, disabled: !draggable });
  const drop = useDroppable({ id: droppableId, disabled: !droppableId });

  const dragStyle = drag.isDragging ? { opacity: 0 } : undefined;

  useEffect(() => {
    if (!actionMenuAnchor) return;
    const close = () => setActionMenuAnchor(null);
    const closeOnKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        close();
      }
    };
    document.addEventListener("pointerdown", close);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    document.addEventListener("keydown", closeOnKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
      document.removeEventListener("keydown", closeOnKey);
    };
  }, [actionMenuAnchor]);

  const executePlayCard = (sourceCardId: string, actionSide: Side) => {
    if (!engineCtx) return;
    const attachTargets = getGearAttachTargets(
      { interactionView: engineCtx.interactionViews[actionSide] },
      sourceCardId,
      cardType,
    );
    if (attachTargets.length > 0) {
      moveSelection.setSelection({
        side: actionSide,
        moveId: "playCard",
        sourceCardId,
        sourceCardType: cardType,
      });
      return;
    }
    const programTargets = getProgramSpatialTargets(
      {
        matchState: engineCtx.matchState,
        side: actionSide,
        interactionView: engineCtx.interactionViews[actionSide],
      },
      sourceCardId,
    );
    if (programTargets.length > 0) {
      moveSelection.setSelection({
        side: actionSide,
        moveId: "playCard",
        sourceCardId,
        sourceCardType: cardType,
      });
      return;
    }
    engineCtx.dispatch({
      type: "playCard",
      cardId: sourceCardId,
      as: PLAYER_SIDE_TO_ID[actionSide],
    });
    moveSelection.clearSelection();
  };

  const executeDirectMove = (moveId: MoveId, actionSide: Side, sourceCardId: string) => {
    if (!engineCtx) return;
    const asPlayer = PLAYER_SIDE_TO_ID[actionSide];
    if (moveId === "playCard") {
      executePlayCard(sourceCardId, actionSide);
      return;
    }
    if (moveId === "sellCard") {
      engineCtx.dispatch({ type: "sellCard", cardId: sourceCardId, as: asPlayer });
      moveSelection.clearSelection();
      return;
    }
    if (moveId === "callLegend") {
      engineCtx.dispatch({ type: "callLegend", cardId: sourceCardId, as: asPlayer });
      moveSelection.clearSelection();
      return;
    }
    if (moveId === "goSolo") {
      engineCtx.dispatch({ type: "goSolo", cardId: sourceCardId, as: asPlayer });
      moveSelection.clearSelection();
      return;
    }
    if (moveId === "attackUnit") {
      attackSelection.selectAttacker("fight");
      moveSelection.clearSelection();
      return;
    }
    if (moveId === "attackRival") {
      engineCtx.dispatch({ type: "attackRival", attackerId: sourceCardId, as: asPlayer });
      moveSelection.clearSelection();
      return;
    }
    if (moveId === "useBlocker") {
      engineCtx.dispatch({ type: "useBlocker", blockerId: sourceCardId, as: asPlayer });
      moveSelection.clearSelection();
      return;
    }
    if (moveId === "activateAbility") {
      const abilityIndex = interactionViewAbilityIndexForCard(
        engineCtx.interactionViews[actionSide],
        sourceCardId,
      );
      if (abilityIndex !== null) {
        engineCtx.dispatch({
          type: "activateAbility",
          cardId: sourceCardId,
          abilityIndex,
          as: asPlayer,
        });
        moveSelection.clearSelection();
      }
    }
  };

  const executeSelectedTarget = () => {
    if (
      !engineCtx ||
      !selectedMoveState?.sourceCardId ||
      selectedMoveState.moveId !== "playCard" ||
      !selectedGearAttachTarget ||
      !cardId ||
      !side
    ) {
      return false;
    }
    engineCtx.dispatch({
      type: "playCard",
      cardId: selectedMoveState.sourceCardId,
      attachToId: cardId,
      as: PLAYER_SIDE_TO_ID[side],
    });
    moveSelection.clearSelection();
    return true;
  };

  const executeProgramTarget = () => {
    if (
      !engineCtx ||
      !globalSelectedMoveState?.sourceCardId ||
      globalSelectedMoveState.moveId !== "playCard" ||
      !selectedProgramSpatialTarget ||
      !cardId
    ) {
      return false;
    }
    const asPlayer = PLAYER_SIDE_TO_ID[globalSelectedMoveState.side];
    const result = engineCtx.dispatch({
      type: "playCard",
      cardId: globalSelectedMoveState.sourceCardId,
      as: asPlayer,
    });
    if (result.success) {
      engineCtx.dispatch({ type: "resolveEffectTarget", targetIds: [cardId], as: asPlayer });
    }
    moveSelection.clearSelection();
    return true;
  };

  const executeChoice = () => {
    if (!engineCtx || permission.kind !== "selectable" || !cardId) {
      return false;
    }
    const asPlayer = PLAYER_SIDE_TO_ID[permissionSide];
    const interaction = permission.interaction;
    if (
      (interaction.actionId === "resolveEffectTarget" ||
        interaction.actionId === "resolveDiscardFromHand") &&
      (interaction.max ?? 0) > 1
    ) {
      return engineCtx.toggleEffectCardTarget(permissionSide, cardId);
    }
    const value =
      interaction.valueKind === "option"
        ? interaction.optionId
        : interaction.valueKind === "array"
          ? [cardId]
          : cardId;
    if (value === undefined) {
      return false;
    }
    const submission = buildInteractionSubmissionForActionId({
      view: engineCtx.interactionViews[permissionSide],
      actionId: interaction.actionId,
      values: { [interaction.inputId]: value as InteractionSubmissionValue },
    });
    if (!submission) {
      return false;
    }
    const action = interactionSubmissionToEngineAction(submission, asPlayer);
    if (!action) {
      return false;
    }
    engineCtx.dispatch(action);
    return true;
  };

  const actionMenuActions: CardMenuAction[] = [];
  if (engineAware && !selectedMove && permission.kind === "armable" && cardId && side) {
    const availableMoves = new Set<CardActionHotkeyMoveId>();
    for (const actionId of permission.actionIds) {
      if (!isCardActionHotkeyMoveId(actionId)) continue;
      availableMoves.add(actionId);
    }

    for (const slot of CARD_ACTION_HOTKEY_SLOTS) {
      const moveId = slot.moveId;
      if (!availableMoves.has(moveId)) continue;
      actionMenuActions.push({
        id: moveId,
        label: getCardActionLabel(moveId),
        hotkey: getCardActionHotkey(moveId),
        run: () => executeDirectMove(moveId, side, cardId),
      });
    }
  }

  const openActionMenu = (ev: MouseEvent<HTMLDivElement>) => {
    if (actionMenuActions.length === 0) {
      return false;
    }
    const rect = ev.currentTarget.getBoundingClientRect();
    setActionMenuAnchor({
      x: Math.min(window.innerWidth - 12, Math.max(12, rect.left + rect.width / 2)),
      y: Math.min(window.innerHeight - 12, Math.max(12, rect.top + rect.height * 0.2)),
    });
    return true;
  };

  const handleClick = (ev: MouseEvent<HTMLDivElement>) => {
    if (!engineAware || !engineCtx) {
      return;
    }
    ev.stopPropagation();
    setActionMenuAnchor(null);
    if (!selectedMove && openActionMenu(ev)) {
      return;
    }
    if (executeSelectedTarget()) {
      return;
    }
    if (executeProgramTarget()) {
      return;
    }
    if (selectedMove && selectedMoveIsLegal && cardId && side && permission.kind === "armable") {
      executeDirectMove(selectedMove, side, cardId);
      return;
    }
    if (attackSelection.canSelectFightTarget) {
      attackSelection.selectFightTarget();
      moveSelection.clearSelection();
      return;
    }
    if (attackSelection.canStartAttack) {
      attackSelection.selectAttacker();
      moveSelection.clearSelection();
      return;
    }
    if (permission.kind === "inert") {
      return;
    }
    if (executeChoice()) {
      return;
    }
    // Other choice types (blockerInterrupt context, searchDeck) handled elsewhere.
    onCardClick?.(cardId);
  };

  // Inspect button: a small magnifier in the bottom-left corner of every
  // face-up card. Tap opens the inspect overlay. Stops pointer propagation
  // so dnd-kit doesn't read the press as the start of a drag.
  const handleInspect = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    if (faceDown || !imageUrl) {
      return;
    }
    inspect({
      imageUrl,
      name,
      zone,
      color,
      attachments: gear.map((g) => ({ imageUrl: g.imageUrl, name: g.name })),
    });
  };

  const stopPointer = (ev: PointerEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
  };
  const stopCostClick = (ev: MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
  };
  const stopCostPointer = (ev: PointerEvent<HTMLDivElement>) => {
    ev.stopPropagation();
  };
  const handlePowerClick = (ev: MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    if (!hasPowerEffect) return;
    if (powerMenuCloseTimer.current) {
      clearTimeout(powerMenuCloseTimer.current);
      powerMenuCloseTimer.current = null;
    }
    setPowerMenuOpen((open) => !open);
  };
  const stopPowerMenuClick = (ev: MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
  };
  const stopPowerPointer = (ev: PointerEvent<HTMLDivElement>) => {
    ev.stopPropagation();
  };
  const handlePowerPointerEnter = (ev: PointerEvent<HTMLDivElement>) => {
    if (ev.pointerType === "touch") return;
    openPowerMenu();
  };
  const handlePowerPointerLeave = (ev: PointerEvent<HTMLDivElement>) => {
    if (ev.pointerType === "touch") return;
    closePowerMenuSoon();
  };
  const openPowerMenu = () => {
    if (powerMenuCloseTimer.current) {
      clearTimeout(powerMenuCloseTimer.current);
      powerMenuCloseTimer.current = null;
    }
    setPowerMenuOpen(true);
  };
  const closePowerMenuSoon = () => {
    if (powerMenuCloseTimer.current) {
      clearTimeout(powerMenuCloseTimer.current);
    }
    powerMenuCloseTimer.current = setTimeout(() => {
      setPowerMenuOpen(false);
      powerMenuCloseTimer.current = null;
    }, 320);
  };
  const closePowerMenuOnBlur = (ev: FocusEvent<HTMLDivElement>) => {
    if (ev.currentTarget.contains(ev.relatedTarget)) return;
    closePowerMenuSoon();
  };

  const interactionState = engineAware
    ? attackSelection.canSelectFightTarget
      ? "selectable"
      : selectedGearAttachTarget
        ? "selectable"
        : selectedProgramSpatialTarget
          ? "selectable"
          : selectedMove
            ? selectedMoveIsLegal
              ? "selectable"
              : "inert"
            : permission.kind
    : "legacy";
  const stateClass =
    interactionState === "inert"
      ? classes.inert
      : interactionState === "selectable"
        ? classes.selectable
        : interactionState === "armable"
          ? armed || attackSelection.isSelectedAttacker
            ? `${classes.armable} ${classes.armed}`
            : classes.armable
          : "";

  const gearCount = gear.length;
  const powerEffects = [
    ...activeEffects
      .filter((effect) => effect.modifierLabel)
      .map((effect) => ({
        id: effect.id,
        sourceCardId: effect.sourceCardId,
        sourceName: effect.sourceName,
        modifierLabel: effect.modifierLabel,
      })),
    ...gear
      .filter((attachment) => typeof attachment.power === "number" && attachment.power !== 0)
      .map((attachment) => ({
        id: attachment.cardId ?? attachment.name,
        sourceCardId: attachment.cardId,
        sourceName: attachment.name,
        modifierLabel: signedNumber(attachment.power ?? 0),
      })),
  ];
  const hasPowerEffect = powerEffects.length > 0;
  const hasModifiedPower =
    power !== undefined &&
    power !== null &&
    effectivePower !== undefined &&
    effectivePower !== null &&
    effectivePower !== power;
  const showPowerBadge =
    !faceDown &&
    imageUrl &&
    effectivePower !== undefined &&
    effectivePower !== null &&
    (engineCtx?.matchState.G.gamePhase === "main" || hasModifiedPower || hasPowerEffect);
  const combatRole =
    engineCtx?.matchState.G.gamePhase === "main" &&
    engineCtx.matchState.G.attackState?.kind === "fight" &&
    cardId
      ? String(engineCtx.matchState.G.attackState.attackerId) === cardId
        ? "attacker"
        : String(engineCtx.matchState.G.attackState.defenderId) === cardId
          ? "defender"
          : null
      : null;
  const blockedByPlayedThisTurn =
    cardType === "unit" &&
    playedThisTurn &&
    !effectiveRules.includes("canAttackOnPlayedTurnAgainstUnits");
  const abilityBadges = buildAbilityBadges(effectiveRules, blockedByPlayedThisTurn);
  const statusBadges = buildStatusBadges(activeEffects);
  const hasModifiedCost =
    cost !== undefined &&
    cost !== null &&
    effectiveCost !== undefined &&
    effectiveCost !== null &&
    effectiveCost !== cost;
  const showCostBadge = !faceDown && imageUrl && hasModifiedCost;
  const costAriaLabel =
    cost !== undefined && cost !== null && hasModifiedCost
      ? `${cost} printed cost, ${effectiveCost} current cost`
      : `${effectiveCost ?? cost} cost`;
  const isSelected = armed || attackSelection.isSelectedAttacker || effectCardTargetSelected;
  const isHandCard = zone === "p-hand" || zone === "opp-hand";
  const powerAriaLabel =
    power !== undefined && power !== null && hasModifiedPower
      ? `${power} printed power, ${effectivePower} current power`
      : `${effectivePower} power`;
  const powerBadge =
    !isHandCard && showPowerBadge ? (
      <div
        className={classes.powerBadge}
        data-modified={hasPowerEffect ? "true" : "false"}
        data-open={hasPowerEffect && powerMenuOpen ? "true" : "false"}
        data-combat-role={combatRole ?? undefined}
        aria-label={
          combatRole
            ? `${combatRole === "attacker" ? "Attacker" : "Defender"} power ${effectivePower}`
            : powerAriaLabel
        }
        aria-expanded={hasPowerEffect ? powerMenuOpen : undefined}
        tabIndex={hasPowerEffect ? 0 : undefined}
        onClick={handlePowerClick}
        onFocus={openPowerMenu}
        onBlur={closePowerMenuOnBlur}
        onPointerEnter={hasPowerEffect ? handlePowerPointerEnter : undefined}
        onPointerLeave={hasPowerEffect ? handlePowerPointerLeave : undefined}
        onPointerDown={stopPowerPointer}
        onPointerUp={stopPowerPointer}
      >
        <span className={classes.powerLabel}>PWR</span>
        <span className={classes.powerValue}>{effectivePower}</span>
        {hasPowerEffect ? (
          <div
            className={classes.powerMenu}
            aria-label="Power effects"
            onClick={stopPowerMenuClick}
          >
            {powerEffects.map((effect) => (
              <div key={effect.id} className={classes.powerMenuRow}>
                <span className={classes.powerDelta}>{effect.modifierLabel}</span>
                <CardNameToken
                  cardId={effect.sourceCardId}
                  fallbackName={effect.sourceName}
                  className={classes.powerSource}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    ) : null;
  // Action hints are idle affordances: the card can start at least one move,
  // but the player has not pressed a prompt verb yet. Selection candidates are
  // the armed-prompt state: a verb like Play/Sell is active and this card is a
  // valid highlighted target. `data-actionable` intentionally covers both.
  const isActionHint = !selectedMove && permission.kind === "armable";
  const isSelectionCandidate = Boolean(selectedMove && selectedMoveIsLegal);
  const publicCardAttrs = faceDown
    ? {}
    : {
        "data-card-id": cardId,
        "data-card-name": name,
        "data-card-type": cardType,
        "data-card-color": color,
        "data-cost": cost ?? undefined,
        "data-effective-cost": effectiveCost ?? cost ?? undefined,
        "data-power": effectivePower ?? power ?? undefined,
        // Note: physical readiness lives on the outer field-unit wrapper
        // (data-ready mirrors `tapped`). The inner card intentionally does
        // not expose data-ready — interaction-permission state is already
        // surfaced via `data-actionable` / `data-action-hint` and would
        // conflict with the wrapper for an off-turn ready unit.
      };
  const previewDetails: CardPreviewDetails | undefined =
    faceDown && !peeked
      ? undefined
      : {
          name,
          cardType,
          cost,
          effectiveCost,
          power,
          effectivePower,
          classifications,
          keywords,
          rules: [
            ...keywords.map(formatPreviewKeyword),
            ...(rulesText ? [rulesText] : []),
            ...effectiveRules
              .filter((rule) => !keywords.includes(rule))
              .map((rule) => `Effective: ${formatPreviewKeyword(rule)}.`),
          ],
          costEffects,
          activeEffects,
          hasSellTag,
        };

  return (
    <div
      ref={(node) => {
        drag.setNodeRef(node);
        drop.setNodeRef(node);
      }}
      className={[
        classes.stack,
        stateClass,
        peeked && faceDown ? classes.peekedFaceDown : "",
        isValidAttackDropTarget ? classes.validAttackDropTarget : "",
        isValidGearDropTarget ? classes.validGearDropTarget : "",
        isValidProgramDropTarget ? classes.validProgramDropTarget : "",
        drop.isOver ? classes.dropOver : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-interaction-state={interactionState}
      data-testid={faceDown ? "face-down-card" : "card"}
      data-zone={zone}
      data-zone-index={index}
      data-side={side}
      data-face-down={faceDown ? "true" : "false"}
      data-spent={tapped ? "true" : "false"}
      data-played-this-turn={playedThisTurn ? "true" : "false"}
      data-peeked={peeked ? "true" : "false"}
      data-selectable={interactionState === "selectable" ? "true" : "false"}
      data-actionable={
        interactionState === "selectable" || interactionState === "armable" ? "true" : "false"
      }
      data-action-hint={isActionHint ? "true" : "false"}
      data-selection-candidate={isSelectionCandidate ? "true" : "false"}
      data-selected={isSelected ? "true" : "false"}
      data-choice-selected={effectCardTargetSelected ? "true" : "false"}
      data-selected-move={selectedMove ?? undefined}
      data-choice-eligible={selectablePermission ? "true" : "false"}
      data-choice-side={selectablePermission?.side}
      data-choice-type={selectablePermission?.permission.interaction.actionId}
      data-choice-target-kind={choiceTargetKind ?? undefined}
      data-drop-hint={
        isValidAttackDropTarget
          ? "attackUnit"
          : isValidGearDropTarget
            ? "attachGear"
            : isValidProgramDropTarget
              ? "programTarget"
              : undefined
      }
      {...simEntityAnchor({
        entityId: !faceDown || peeked ? cardId : undefined,
        zoneId: zone,
        side,
        face: faceDown && !peeked ? "hidden" : "public",
      })}
      {...publicCardAttrs}
      style={dragStyle}
      onClick={handleClick}
      {...(draggable ? drag.listeners : undefined)}
      {...(draggable ? drag.attributes : undefined)}
    >
      {gear.map((g, i) => {
        const offsetPercent = (i + 1) * GEAR_PEEK_PERCENT;
        return (
          <AttachedGear
            key={`${g.cardId ?? g.name}-${i}`}
            gear={g}
            side={side}
            offsetPercent={offsetPercent}
            zIndex={gearCount - i}
          />
        );
      })}
      <div className={`${classes.unit} ${tapped && rotateWhenTapped ? classes.tappedUnit : ""}`}>
        <CardImage
          imageUrl={imageUrl}
          faceDown={faceDown && !peeked}
          cardType={cardType}
          alt={faceDown ? (peeked ? "Peeked face-down card" : "Face-down card") : (name ?? "")}
          color={color}
          previewDetails={previewDetails}
        />
        {showCostBadge ? (
          <div
            className={classes.costBadge}
            data-modified="true"
            aria-label={costAriaLabel}
            tabIndex={0}
            onClick={stopCostClick}
            onPointerDown={stopCostPointer}
            onPointerUp={stopCostPointer}
          >
            <span className={classes.costLabel}>COST</span>
            <span className={classes.costValue}>{effectiveCost}</span>
            {costEffects.length > 0 ? (
              <div className={classes.costMenu} aria-label="Cost effects">
                {costEffects.map((effect) => (
                  <div key={effect.id} className={classes.costMenuRow}>
                    <span className={classes.costDelta}>{effect.modifierLabel}</span>
                    <span className={classes.costDetail}>{effect.detail}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {!faceDown && imageUrl ? (
          <button
            type="button"
            aria-label="Inspect card"
            className={classes.inspectBtn}
            onClick={handleInspect}
            onPointerDown={stopPointer}
            onPointerUp={stopPointer}
          >
            <IconZoomIn size="65%" stroke={2} aria-hidden="true" />
          </button>
        ) : null}
        {!isHandCard && !faceDown && imageUrl && abilityBadges.length + statusBadges.length > 0 ? (
          <div className={classes.abilityRail} aria-label="Card abilities and effects">
            {[...abilityBadges, ...statusBadges].map((badge) => {
              const Icon = badge.Icon;
              return (
                <span
                  key={badge.id}
                  className={classes.abilityBadge}
                  data-rule={badge.rule}
                  data-ready={badge.rule === "blocker" ? (!tapped).toString() : undefined}
                  data-tooltip={badge.label}
                  aria-label={badge.label}
                  role="img"
                  tabIndex={0}
                >
                  <Icon size="74%" stroke={2.45} aria-hidden="true" />
                </span>
              );
            })}
          </div>
        ) : null}
        {combatRole ? null : powerBadge}
      </div>
      {combatRole ? powerBadge : null}
      {actionMenuAnchor
        ? createPortal(
            <CardActionMenu
              x={actionMenuAnchor.x}
              y={actionMenuAnchor.y}
              cardName={name}
              cardId={cardId}
              actions={actionMenuActions}
              onClose={() => setActionMenuAnchor(null)}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

function CardActionMenu({
  x,
  y,
  cardName,
  cardId,
  actions,
  onClose,
}: {
  x: number;
  y: number;
  cardName?: string;
  cardId?: string;
  actions: CardMenuAction[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const position = useFloatingPointMenu(ref, { x, y, align: "center", offset: 8, padding: 8 });
  const handlePointer = (ev: PointerEvent<HTMLDivElement>) => {
    ev.stopPropagation();
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
      const action = actions.find((candidate) => candidate.hotkey === ev.key);
      if (!action) return;
      ev.preventDefault();
      ev.stopPropagation();
      onClose();
      action.run();
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [actions, onClose]);

  return (
    <div
      ref={ref}
      className={classes.actionMenu}
      style={
        {
          left: `${position.left}px`,
          top: `${position.top}px`,
          "--menu-arrow-left": `${position.arrowLeft}px`,
        } as CSSProperties
      }
      role="menu"
      aria-label={cardName ? `${cardName} actions` : "Card actions"}
      data-testid="card-action-menu"
      data-for-card-id={cardId ?? undefined}
      data-side={position.side}
      onPointerDown={handlePointer}
      onClick={(ev) => ev.stopPropagation()}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={classes.actionMenuItem}
          role="menuitem"
          aria-keyshortcuts={action.hotkey}
          data-testid={`card-action-${action.id}`}
          data-hotkey={action.hotkey}
          onClick={(ev) => {
            ev.stopPropagation();
            onClose();
            action.run();
          }}
        >
          <span>{action.label}</span>
          <kbd className={classes.actionMenuHotkey}>{action.hotkey}</kbd>
        </button>
      ))}
    </div>
  );
}

function formatPreviewKeyword(rule: string): string {
  return rule
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function AttachedGear({
  gear,
  side,
  offsetPercent,
  zIndex,
}: {
  gear: CardGearAttachment;
  side?: Side;
  offsetPercent: number;
  zIndex: number;
}) {
  const engineCtx = useEngineOptional();
  const choiceSide = engineCtx?.humanSide ?? side ?? NO_SIDE;
  const choicePermission = useInteractionPermission(choiceSide, gear.cardId ?? "");
  const selectablePermission =
    choicePermission.kind === "selectable"
      ? { side: choiceSide, permission: choicePermission }
      : null;
  const permission = selectablePermission?.permission ?? { kind: "inert" as const };
  const permissionSide = selectablePermission?.side ?? side ?? NO_SIDE;
  const selectable = Boolean(gear.cardId && engineCtx && permission.kind === "selectable");

  const resolveGearTarget = () => {
    if (!selectable || !engineCtx || !gear.cardId || permission.kind !== "selectable") {
      return;
    }
    const asPlayer = PLAYER_SIDE_TO_ID[permissionSide];
    const interaction = permission.interaction;
    if (
      (interaction.actionId === "resolveEffectTarget" ||
        interaction.actionId === "resolveDiscardFromHand") &&
      (interaction.max ?? 0) > 1
    ) {
      engineCtx.toggleEffectCardTarget(permissionSide, gear.cardId);
      return;
    }
    const value =
      interaction.valueKind === "option"
        ? interaction.optionId
        : interaction.valueKind === "array"
          ? [gear.cardId]
          : gear.cardId;
    if (value === undefined) {
      return;
    }
    const submission = buildInteractionSubmissionForActionId({
      view: engineCtx.interactionViews[permissionSide],
      actionId: interaction.actionId,
      values: { [interaction.inputId]: value as InteractionSubmissionValue },
    });
    if (!submission) return;
    const action = interactionSubmissionToEngineAction(submission, asPlayer);
    if (action) engineCtx.dispatch(action);
  };

  const handleGearClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    resolveGearTarget();
  };

  return (
    <div
      className={[classes.gear, selectable ? classes.selectable : ""].filter(Boolean).join(" ")}
      style={{
        transform: `translateY(${offsetPercent}%)`,
        zIndex,
      }}
      data-testid="attached-gear"
      data-card-id={gear.cardId}
      data-card-name={gear.name}
      data-card-type={gear.cardType}
      data-choice-side={selectablePermission?.side}
      data-choice-type={selectablePermission?.permission.interaction.actionId}
      {...simEntityAnchor({
        entityId: gear.cardId,
        zoneId: "attached-gear",
        side,
        face: "public",
      })}
    >
      <CardImage
        imageUrl={gear.imageUrl}
        alt={gear.name}
        previewDetails={{
          name: gear.name,
          cardType: gear.cardType,
          cost: gear.cost,
          effectiveCost: gear.effectiveCost,
          power: gear.power,
          effectivePower: gear.effectivePower,
          classifications: gear.classifications,
          keywords: gear.keywords,
          rules: [
            ...(gear.keywords?.map(formatPreviewKeyword) ?? []),
            ...(gear.rulesText ? [gear.rulesText] : []),
            ...(gear.effectiveRules
              ?.filter((rule) => !(gear.keywords ?? []).includes(rule))
              .map((rule) => `Effective: ${formatPreviewKeyword(rule)}.`) ?? []),
          ],
          costEffects: gear.costEffects,
          activeEffects: gear.activeEffects,
          hasSellTag: gear.hasSellTag,
        }}
      />
      {selectable ? (
        <button
          type="button"
          className={classes.gearHitTarget}
          aria-label={`Select ${gear.name}`}
          data-card-id={gear.cardId}
          data-card-name={gear.name}
          data-card-type={gear.cardType}
          data-choice-eligible="true"
          data-choice-side={selectablePermission?.side}
          data-choice-type={selectablePermission?.permission.interaction.actionId}
          onClick={handleGearClick}
        />
      ) : null}
    </div>
  );
}

function buildAbilityBadges(rules: readonly EffectiveRule[], blockedByPlayedThisTurn: boolean) {
  const has = (rule: EffectiveRule) => rules.includes(rule);
  return [
    blockedByPlayedThisTurn
      ? {
          id: "playedThisTurnCantAttack",
          rule: "playedThisTurnCantAttack" as const,
          label: "Just played: can't attack this turn",
          Icon: IconClockPause,
        }
      : null,
    has("blocker")
      ? {
          id: "blocker",
          rule: "blocker" as const,
          label: "BLOCKER: ready unit can redirect a rival attack",
          Icon: IconShield,
        }
      : null,
    has("cantAttack")
      ? {
          id: "cantAttack",
          rule: "cantAttack" as const,
          label: "Can't attack",
          Icon: IconSwordOff,
        }
      : null,
    has("goSolo")
      ? {
          id: "goSolo",
          rule: "goSolo" as const,
          label: "GO SOLO: can be played ready and attack this turn",
          Icon: IconBolt,
        }
      : null,
  ].filter((badge): badge is NonNullable<typeof badge> => Boolean(badge));
}

function buildStatusBadges(effects: readonly CardActiveEffectView[]) {
  const defeatSources = [
    ...new Set(
      effects
        .filter((effect) => effect.defeatsAtEndOfTurn)
        .map((effect) => effect.sourceName)
        .filter(Boolean),
    ),
  ];
  if (defeatSources.length === 0) return [];
  return [
    {
      id: "defeatEndTurn",
      rule: "defeatEndTurn" as const,
      label: `Defeated at end of turn by ${defeatSources.join(", ")}`,
      Icon: IconSkull,
    },
  ];
}

function signedNumber(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}
