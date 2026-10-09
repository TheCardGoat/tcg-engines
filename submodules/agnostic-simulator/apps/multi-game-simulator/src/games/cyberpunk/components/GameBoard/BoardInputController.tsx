import { useCallback, useEffect, useRef, useState } from "react";
import type { DropDisposition } from "@tcg/simulator-ui";
import { useAttackSelection, useDragDrop, useMoveSelection } from "./index";
import { usePaymentSelection } from "../PaymentSelection/PaymentSelectionContext";
import type { PaymentAction } from "../PaymentSelection/paymentSelectionContextValue";
import {
  interactionActionIsAvailable,
  interactionViewActionHasCandidate,
  interactionViewHasAttacker,
  mapDropToAction,
  PLAYER_SIDE_TO_ID,
  useEngineOptional,
  useEngineInteractionView,
  useSideZones,
  type CardDropEvent,
  type Side,
} from "../../engine";

interface PendingProgramDrop {
  sourceCardId: string;
  targetCardId: string;
  side: Side;
  playStateVersion: number;
  sawPaymentSelection: boolean;
  sawRemotePending: boolean;
}

/**
 * A released drop whose play the board still believes in, parked until the
 * transient window that ate it closes: an animation holding the command gate,
 * a combat/choice prompt, or a pending remote move. The card stays parked at
 * the release point (DragDropContext holds the session) until this intent
 * dispatches, times out, or turns permanently illegal.
 */
interface ParkedDropIntent {
  action: PaymentAction;
  cardId: string;
  sourceCardType: "legend" | "unit" | "gear" | "program" | null;
  targetCardId: string | null;
  side: Side;
  expiresAt: number;
}

const PARKED_DROP_TIMEOUT_MS = 10_000;

/** A plain play (hand → field) or GO SOLO (legend area → field) drop shape. */
function isCostedPlayDropShape(event: CardDropEvent): boolean {
  return (
    event.target.type === "zone" &&
    event.target.zone === "p-field" &&
    (event.source.zone === "p-hand" || event.source.zone === "p-legendArea")
  );
}

export function DropDispatchBridge() {
  const { registerCardDropHandler, gearTargets, activeSource, setParkedDropCardId } = useDragDrop();
  const engine = useEngineOptional();
  const { dispatchCostedAction, paymentSelectionActive } = usePaymentSelection();
  const moveSelection = useMoveSelection();
  const humanSide = engine?.humanSide ?? "player";
  const humanZones = useSideZones(humanSide);
  const humanInteractionView = useEngineInteractionView(humanSide);

  const [parkedDrop, setParkedDropState] = useState<ParkedDropIntent | null>(null);
  const [parkTick, setParkTick] = useState(0);

  const engineRef = useRef(engine);
  const zonesRef = useRef(humanZones);
  const interactionViewRef = useRef(humanInteractionView);
  const sideRef = useRef<Side>(humanSide);
  const selectionRef = useRef(moveSelection);
  // The drop handler effect does not depend on the gate, so read it through a
  // ref — a captured dispatchCostedAction would go stale on arm/mode changes.
  const costedDispatchRef = useRef(dispatchCostedAction);
  const targetsRef = useRef({ gearTargets });
  const programDropRef = useRef<PendingProgramDrop | null>(null);
  targetsRef.current = { gearTargets };

  engineRef.current = engine;
  zonesRef.current = humanZones;
  interactionViewRef.current = humanInteractionView;
  sideRef.current = humanSide;
  selectionRef.current = moveSelection;
  costedDispatchRef.current = dispatchCostedAction;

  useEffect(() => {
    const intent = programDropRef.current;
    if (!intent || !engine || intent.side !== humanSide) {
      return;
    }
    if (paymentSelectionActive) {
      intent.sawPaymentSelection = true;
      return;
    }
    if (engine.hasPendingRemoteMove) {
      intent.sawRemotePending = true;
      return;
    }
    const sourceInHand = humanZones.hand.some((card) => card.cardId === intent.sourceCardId);
    if (
      sourceInHand &&
      (intent.sawPaymentSelection || intent.sawRemotePending) &&
      humanInteractionView.status === "ready"
    ) {
      // Payment was cancelled or the server rejected the play.
      programDropRef.current = null;
      return;
    }
    if (humanInteractionView.stateVersion <= intent.playStateVersion) {
      return;
    }
    if (humanInteractionView.status === "choosing") {
      const choice = humanInteractionView.actions.find(
        (action) =>
          action.enabled &&
          action.id === "resolveEffectTarget" &&
          action.source?.instanceId === intent.sourceCardId,
      );
      if (!choice) {
        return;
      }
      // The server may change the legal targets while resolving earlier
      // effects. Only its current single-card choice can use the drop intent.
      programDropRef.current = null;
      const input = choice.inputs.find(
        (candidate) => candidate.kind === "entity-selection" && candidate.id === "targetIds",
      );
      if (
        input?.kind === "entity-selection" &&
        input.max === 1 &&
        input.candidates.some(
          (candidate) => candidate.enabled && candidate.entity.instanceId === intent.targetCardId,
        )
      ) {
        engine.dispatch({
          type: "resolveEffectTarget",
          targetIds: [intent.targetCardId],
          as: PLAYER_SIDE_TO_ID[humanSide],
        });
      }
      return;
    }
    if (humanInteractionView.status === "ready" && !sourceInHand) {
      programDropRef.current = null;
    }
  }, [engine, humanInteractionView, humanSide, humanZones.hand, paymentSelectionActive]);

  const setParkedDrop = useCallback(
    (intent: ParkedDropIntent | null) => {
      setParkedDropState(intent);
      setParkedDropCardId(intent?.cardId ?? null);
    },
    [setParkedDropCardId],
  );

  // While a drop is parked, retry resolution periodically so the play commits
  // as soon as its window reopens, even between renders.
  const hasParkedDrop = parkedDrop !== null;
  useEffect(() => {
    if (!hasParkedDrop) return;
    const timer = setInterval(() => setParkTick((value) => value + 1), 250);
    return () => clearInterval(timer);
  }, [hasParkedDrop]);

  useEffect(() => {
    const intent = parkedDrop;
    if (!intent) return;
    if (!engine || intent.side !== humanSide || activeSource) {
      // Superseded by a fresh drag or a stale seat — release the card.
      setParkedDrop(null);
      return;
    }
    if (paymentSelectionActive || engine.hasPendingRemoteMove) return;
    const sourceInHand = humanZones.hand.some((card) => card.cardId === intent.cardId);
    if (!sourceInHand || Date.now() > intent.expiresAt) {
      setParkedDrop(null);
      return;
    }
    if (humanInteractionView.status !== "ready") return;
    if (
      !interactionViewActionHasCandidate(
        humanInteractionView,
        intent.action.type,
        "cardId",
        intent.cardId,
      )
    ) {
      // The window closed permanently: the play is no longer legal, so let the
      // card fly back instead of dispatching a doomed move.
      setParkedDrop(null);
      return;
    }
    const accepted = costedDispatchRef.current(intent.action);
    if (accepted) {
      selectionRef.current.clearSelection();
      if (intent.sourceCardType === "program" && intent.targetCardId) {
        programDropRef.current = {
          sourceCardId: intent.cardId,
          targetCardId: intent.targetCardId,
          side: intent.side,
          playStateVersion: humanInteractionView.stateVersion,
          sawPaymentSelection: false,
          sawRemotePending: false,
        };
      }
      setParkedDrop(null);
    }
    // Refused again: stay parked; the next render or retry tick re-checks.
  }, [
    parkedDrop,
    parkTick,
    engine,
    humanSide,
    humanZones.hand,
    humanInteractionView,
    paymentSelectionActive,
    activeSource,
    setParkedDrop,
  ]);

  useEffect(() => {
    const handle = (event: CardDropEvent): DropDisposition => {
      const e = engineRef.current;
      if (!e || !event.source.cardId) {
        return { kind: "rejected" };
      }
      const ctx = {
        humanSide: sideRef.current,
        humanZones: zonesRef.current,
        interactionView: interactionViewRef.current,
      };
      const sourceCard = ctx.humanZones.hand.find((c) => c.cardId === event.source.cardId);
      if (
        event.source.zone === "p-hand" &&
        event.target.type === "zone" &&
        event.target.zone === "p-field"
      ) {
        if (sourceCard?.cardType === "gear" && targetsRef.current.gearTargets.size > 0) {
          selectionRef.current.setSelection({
            side: ctx.humanSide,
            moveId: "playCard",
            sourceCardId: event.source.cardId,
            sourceCardType: sourceCard.cardType,
          });
          return { kind: "accepted" };
        }
      }
      const action = mapDropToAction(event, ctx);
      if (!action) {
        // A combat or choice prompt can hide the play candidate between
        // dragover and release. The drop shape is still a plain play, so park
        // it for that window instead of silently refusing.
        const as = PLAYER_SIDE_TO_ID[ctx.humanSide];
        const parkable =
          ctx.interactionView.status !== "ready" &&
          isCostedPlayDropShape(event) &&
          (event.source.zone === "p-legendArea" || sourceCard);
        if (parkable) {
          setParkedDrop({
            action:
              event.source.zone === "p-legendArea"
                ? { type: "goSolo", cardId: event.source.cardId!, as }
                : { type: "playCard", cardId: event.source.cardId!, as },
            cardId: event.source.cardId!,
            sourceCardType: sourceCard?.cardType ?? "legend",
            targetCardId: null,
            side: ctx.humanSide,
            expiresAt: Date.now() + PARKED_DROP_TIMEOUT_MS,
          });
          return { kind: "accepted" };
        }
        return { kind: "rejected" };
      }
      if (action.type === "playCard" || action.type === "callLegend" || action.type === "goSolo") {
        const accepted = costedDispatchRef.current(action);
        if (accepted) {
          if (
            sourceCard?.cardType === "program" &&
            event.source.zone === "p-hand" &&
            event.target.type === "card" &&
            event.target.cardId
          ) {
            programDropRef.current = {
              sourceCardId: event.source.cardId,
              targetCardId: event.target.cardId,
              side: ctx.humanSide,
              playStateVersion: ctx.interactionView.stateVersion,
              sawPaymentSelection: false,
              sawRemotePending: false,
            };
          }
          selectionRef.current.clearSelection();
          return { kind: "accepted" };
        }
        // The command gate or a pending remote move refused a play the view
        // still advertises — park it until that transient window reopens.
        if (
          interactionViewActionHasCandidate(
            ctx.interactionView,
            action.type,
            "cardId",
            event.source.cardId,
          )
        ) {
          setParkedDrop({
            action,
            cardId: event.source.cardId,
            sourceCardType: sourceCard?.cardType ?? null,
            targetCardId: event.target.type === "card" ? (event.target.cardId ?? null) : null,
            side: ctx.humanSide,
            expiresAt: Date.now() + PARKED_DROP_TIMEOUT_MS,
          });
          return { kind: "accepted" };
        }
        return { kind: "rejected" };
      }
      const result = e.dispatch(action);
      if (result.success) selectionRef.current.clearSelection();
      return { kind: result.success ? "accepted" : "rejected" };
    };
    registerCardDropHandler(handle);
    return () => registerCardDropHandler(null);
    // The handler reads everything else through refs, so it stays registered
    // for the component's lifetime.
  }, [registerCardDropHandler, setParkedDrop]);

  return null;
}

export function SelectionReset({ side }: { side: Side }) {
  const interactionView = useEngineInteractionView(side);
  const { selection, clearSelection } = useMoveSelection();
  const attackSelection = useAttackSelection();

  useEffect(() => {
    if (!selection || selection.side !== side) {
      return;
    }
    if (interactionView.status !== "ready") {
      clearSelection();
      return;
    }
    const stillAvailable = interactionActionIsAvailable(interactionView, selection.moveId);
    if (!stillAvailable) {
      clearSelection();
    }
  }, [clearSelection, interactionView, selection, side]);

  useEffect(() => {
    const pending = attackSelection.selection;
    if (!pending || pending.side !== side) {
      return;
    }
    if (interactionView.status !== "ready") {
      attackSelection.clearSelection();
      return;
    }
    const attackerStillAvailable = interactionViewHasAttacker(interactionView, pending.attackerId);
    if (!attackerStillAvailable) {
      attackSelection.clearSelection();
    }
  }, [attackSelection, interactionView, side]);

  return null;
}
