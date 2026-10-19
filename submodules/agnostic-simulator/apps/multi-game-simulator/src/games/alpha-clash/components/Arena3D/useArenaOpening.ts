import { useLayoutEffect, useRef, useState } from "react";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import type { OpeningBeat } from "@tcg/simulator-presentation/opening";
import type { AcSeat, LiveBoardCard, LiveBoardState } from "../board-types";
import { captureOpeningHand, type OpeningHandSnapshot } from "./opening-snapshot";
import { openingIntro, openingReplacement, openingReview, openingSettle } from "./opening-beats";

export interface ArenaOpening {
  keepBoardCamera?: boolean;
  beat: OpeningBeat;
  pending?: boolean;
  advance: (id: string) => void;
  redraw: (
    cardIds: readonly string[],
    handIds: readonly string[],
    hand?: readonly LiveBoardCard[],
  ) => void;
  outgoingHand?: OpeningHandSnapshot;
  retainedIds: ReadonlySet<string>;
  handOrder: readonly string[];
  declare: (take: boolean) => void;
  keep: () => void;
  cancel: () => void;
}
interface Batch {
  snapshot: OpeningHandSnapshot;
  selected: readonly string[];
  handIds: readonly string[];
}
export interface OpeningOptions {
  board: LiveBoardState;
  viewerSeat: AcSeat;
  view: EngineInteractionView;
  submit: (submission: InteractionSubmission) => boolean;
  disabled?: boolean;
  /** Changes after rejection or authoritative resync, even at the same state version. */
  resetKey?: number;
}

/** One presentation flow. Only confirmed projections advance gameplay presentation. */
export function useArenaOpening({
  board,
  viewerSeat,
  view,
  submit,
  disabled,
  resetKey = 0,
}: OpeningOptions): ArenaOpening | undefined {
  const inSetup = board.phaseName === "setup";
  const localCount = board.players[viewerSeat].handSize;
  const rivalCount =
    board.players[viewerSeat === "player-one" ? "player-two" : "player-one"].handSize;
  const starter = board.activePlayer === viewerSeat ? "You play first" : "Opponent plays first";
  const review = openingReview(localCount, rivalCount);
  // Re-entered setup is reviewed directly. Only a pristine initial observation gets an intro.
  const [queue, setQueue] = useState<readonly OpeningBeat[]>(() =>
    inSetup && board.openingState && Object.keys(board.openingState.declarations).length === 0
      ? openingIntro(localCount, rivalCount, starter)
      : [],
  );
  const [pending, setPending] = useState(false);
  const lock = useRef<{ seat: AcSeat; actionId: string; requestId: string } | null>(null);
  const batches = useRef(new Map<AcSeat, Batch>());
  // One confirmed replacement choice can span the native declaration and
  // redraw actions. Wait for the authoritative redraw action before sending.
  const [queuedRedraw, setQueuedRedraw] = useState<{
    seat: AcSeat;
    selected: readonly string[];
    batch?: Batch;
  } | null>(null);
  const [batch, setBatch] = useState<Batch>();
  const previous = useRef({ seat: viewerSeat, inSetup, resetKey });
  const current = useRef(queue);
  const replace = (steps: readonly OpeningBeat[]) => {
    current.current = steps;
    setQueue(steps);
  };
  const clearLock = () => {
    lock.current = null;
    setPending(false);
  };
  useLayoutEffect(() => {
    const changedSeat = previous.current.seat !== viewerSeat;
    const reset = previous.current.resetKey !== resetKey;
    const leftSetup = previous.current.inSetup && !inSetup;
    previous.current = { seat: viewerSeat, inSetup, resetKey };
    if (reset) {
      setQueuedRedraw(null);
      clearLock();
      batches.current.clear();
      setBatch(undefined);
      replace([]);
    }
    if (changedSeat) {
      setQueuedRedraw(null);
      clearLock();
      setBatch(undefined);
      replace([]);
    }
    const submitted = lock.current;
    if (
      submitted &&
      !view.actions.some((action) => action.id === submitted.actionId && action.enabled)
    )
      clearLock();
    const redraw = queuedRedraw;
    if (
      redraw?.seat === viewerSeat &&
      !disabled &&
      !reset &&
      !changedSeat &&
      !view.projectionFailure &&
      view.actions.some((action) => action.id === "mulligan" && action.enabled)
    ) {
      setQueuedRedraw(null);
      send("mulligan", { cardIds: [...redraw.selected] }, redraw.batch);
    }
    const saved = batches.current.get(viewerSeat);
    if (
      !reset &&
      board.openingHandsReady &&
      saved &&
      (!current.current.length || changedSeat || leftSetup)
    ) {
      batches.current.delete(viewerSeat);
      setBatch(saved);
      replace([
        ...openingReplacement(localCount, rivalCount, saved.selected.length),
        ...(!inSetup ? [openingSettle(localCount, rivalCount, starter)] : []),
      ]);
    } else if (leftSetup && !reset && !current.current.some((step) => step.id === "redraw")) {
      setBatch(undefined);
      replace([openingSettle(localCount, rivalCount, starter)]);
    } else if (
      !inSetup &&
      current.current.some((step) => step.id === "contenders" || step.id === "deal")
    ) {
      setBatch(undefined);
      replace([]);
    }
  }, [
    viewerSeat,
    inSetup,
    resetKey,
    board.openingHandsReady,
    board.openingState,
    view,
    localCount,
    rivalCount,
    starter,
    disabled,
    queuedRedraw,
  ]);

  const send = (
    id: string,
    values: InteractionSubmission["values"] = {},
    selectedBatch?: Batch,
  ) => {
    if (!inSetup || disabled || lock.current || current.current.length) return false;
    const action = view.actions.find((candidate) => candidate.id === id && candidate.enabled);
    if (!action || view.projectionFailure) return false;
    lock.current = { seat: viewerSeat, actionId: id, requestId: action.requestId };
    setPending(true);
    if (selectedBatch) batches.current.set(viewerSeat, selectedBatch);
    const sent = submit({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    });
    if (!sent) {
      clearLock();
      if (selectedBatch) batches.current.delete(viewerSeat);
    }
    return sent;
  };
  const autoStartAttempt = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (!inSetup || disabled) {
      autoStartAttempt.current = null;
      return;
    }
    if (!board.openingHandsReady || current.current.length || lock.current || queuedRedraw) return;
    const action = view.actions.find(
      (candidate) => candidate.id === "startGame" && candidate.enabled,
    );
    if (!action || view.projectionFailure) return;
    const attempt = `${viewerSeat}:${view.stateVersion}:${action.requestId}`;
    if (autoStartAttempt.current === attempt) return;
    autoStartAttempt.current = attempt;
    send("startGame");
  }, [inSetup, disabled, board.openingHandsReady, queue, queuedRedraw, viewerSeat, view]);

  const visibleBatch = batch?.snapshot.seat === viewerSeat ? batch : undefined;
  const beat = previous.current.seat === viewerSeat ? queue[0] : undefined;
  if (!inSetup && !beat) return undefined;
  return {
    beat: beat ?? review,
    pending: pending || Boolean(queuedRedraw),
    outgoingHand: visibleBatch?.snapshot,
    retainedIds: new Set(
      visibleBatch?.handIds.filter((id) => !visibleBatch.selected.includes(id)) ?? [],
    ),
    handOrder: visibleBatch?.handIds ?? [],
    advance: (id) => {
      if (current.current[0]?.id !== id || !current.current[0]?.duration) return;
      if (id === "redraw") setBatch(undefined);
      const remaining = current.current.slice(1);
      replace(
        remaining.length || inSetup || id === "settle"
          ? remaining
          : [openingSettle(localCount, rivalCount, starter)],
      );
    },
    redraw: (selected, handIds, hand = []) => {
      const snapshot = captureOpeningHand(hand, handIds);
      const selectedBatch =
        snapshot && selected.length
          ? { snapshot, selected: [...selected], handIds: [...handIds] }
          : undefined;
      if (view.actions.some((action) => action.id === "declareMulligan:take" && action.enabled)) {
        if (queuedRedraw || lock.current) return;
        setQueuedRedraw({ seat: viewerSeat, selected: [...selected], batch: selectedBatch });
        if (!send("declareMulligan:take")) setQueuedRedraw(null);
        return;
      }
      send("mulligan", { cardIds: [...selected] }, selectedBatch);
    },
    declare: (take) => send(take ? "declareMulligan:take" : "declareMulligan:keep"),
    keep: () => send("startGame"),
    cancel: () => {
      setQueuedRedraw(null);
      setBatch(undefined);
      batches.current.clear();
      replace([]);
    },
  };
}
