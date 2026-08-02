/**
 * NarutoBoard: owns the interaction state machine (click-to-select,
 * two-step DECLARE_ATTACK draft, pendingChoice targeting) and switches
 * between the desktop and mobile board trees via Mantine useMediaQuery at
 * 900px (Cyberpunk pattern, with a `?mobile` URL override for tests).
 *
 * All moves go out through `onAction` as engine Actions; the owner page
 * applies them via `applyAction`. Pills are gated by the engine's *Block
 * queries in projection/interactions.ts, so a click never reaches the
 * engine illegally.
 */

import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { findCharacter } from "@tcg-engines/naruto-engine";
import type { Action, GameState, PlayerId } from "@tcg-engines/naruto-engine";

import { intentToAction, legalAttackTargets, type ActionPill } from "../projection/interactions.ts";
import { effectivePower } from "@tcg-engines/naruto-engine";
import { cardOf } from "@tcg-engines/naruto-engine";
import { projectSimulator } from "../projection/projectSimulator.ts";
import { AttackArrow } from "./AttackArrow.tsx";
import { ChoiceModal } from "./ChoiceModal.tsx";
import { DesktopBoard } from "./DesktopBoard.tsx";
import { EndOverlay } from "./EndOverlay.tsx";
import { MobileBoard } from "./MobileBoard.tsx";
import { MulliganBanner } from "./MulliganBanner.tsx";
import classes from "./board.module.css";
import type { AttackDraft, BoardKit, EntityZoneKind, Selection } from "./types.ts";

export const NARUTO_MOBILE_BREAKPOINT_PX = 900;

export interface NarutoBoardProps {
  readonly state: GameState;
  readonly viewer: PlayerId;
  readonly onAction: (action: Action) => void;
  /** Fixtures pass false: render-only, no interactions or overlays. */
  readonly interactive?: boolean;
  /** Force the mobile tree (tests); `?mobile` URL param also works. */
  readonly forceMobile?: boolean;
  readonly onNewGame?: (() => void) | undefined;
}

export function NarutoBoard({
  state,
  viewer,
  onAction,
  interactive = true,
  forceMobile = false,
  onNewGame,
}: NarutoBoardProps) {
  const projection = useMemo(() => projectSimulator(state, viewer), [state, viewer]);
  const [selection, setSelection] = useState<Selection>(null);
  const [attackDraft, setAttackDraft] = useState<AttackDraft | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const narrow = useMediaQuery(`(max-width: ${NARUTO_MOBILE_BREAKPOINT_PX}px)`);
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => setClientReady(true), []);
  const urlForceMobile =
    clientReady &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("mobile");
  const mobile = clientReady && (forceMobile || urlForceMobile || Boolean(narrow));

  // Reset transient interaction state whenever the authoritative state changes.
  useEffect(() => {
    setSelection(null);
    setAttackDraft(null);
  }, [state]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelection(null);
        setAttackDraft(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dispatchIntent = useCallback(
    (pill: ActionPill) => {
      if (!interactive || !pill.enabled) return;
      if (pill.intent.kind === "declare-attack") {
        const { attackerUid, attackerKind } = pill.intent;
        const targets = legalAttackTargets(state, viewer, attackerUid, attackerKind);
        if (targets.length === 0) return;
        let power = 0;
        if (attackerKind === "leader") {
          power = cardOf({ uid: attackerUid, cardId: state.players[viewer].leaderId })?.power ?? 0;
        } else {
          const location = findCharacter(state, attackerUid);
          power = location ? effectivePower(location.character, state.turn) : 0;
        }
        setSelection(null);
        setAttackDraft({
          attackerUid,
          attackerKind,
          power,
          targets,
          hoverUid: targets.length === 1 ? (targets[0]?.uid ?? null) : null,
        });
        return;
      }
      onAction(intentToAction(viewer, pill.intent));
      setSelection(null);
      setAttackDraft(null);
    },
    [interactive, onAction, state, viewer],
  );

  const onEntityClick = useCallback(
    (uid: string, zone: EntityZoneKind, owner: PlayerId) => {
      if (!interactive) return;

      // Attack draft armed: a click on a legal target fires the attack.
      if (attackDraft) {
        const target = attackDraft.targets.find((t) => t.uid === uid);
        if (target) {
          onAction(
            intentToAction(
              viewer,
              {
                kind: "declare-attack",
                attackerUid: attackDraft.attackerUid,
                attackerKind: attackDraft.attackerKind,
              },
              target,
            ),
          );
        }
        setAttackDraft(null);
        return;
      }

      // Board-target pendingChoice: clicking a targetable card resolves it.
      const choice = projection.choice;
      if (choice && choice.player === viewer && choice.boardTargetUids.includes(uid)) {
        onAction(intentToAction(viewer, { kind: "resolve-choice", key: uid }));
        setSelection(null);
        return;
      }

      // Otherwise: select/toggle own actionable entities.
      const selectable =
        owner === viewer &&
        (zone === "hand" || zone === "character" || zone === "support" || zone === "leader");
      if (!selectable) {
        setSelection(null);
        return;
      }
      setSelection((current) =>
        current && current.uid === uid ? null : ({ kind: zone, uid } as Selection),
      );
    },
    [attackDraft, interactive, onAction, projection.choice, viewer],
  );

  const onInspect = useCallback(
    (_uid: string | null, _zone: EntityZoneKind | null, _owner: PlayerId | null) => {
      // NarutoBoard is a no-op sink; DesktopBoard wraps this for its inspector.
    },
    [],
  );

  const onHoverDraftTarget = useCallback(
    (uid: string | null, _zone: EntityZoneKind | null, _owner: PlayerId | null) => {
      setAttackDraft((draft) => {
        if (!draft) return draft;
        const locked = uid && draft.targets.some((t) => t.uid === uid) ? uid : null;
        if (draft.hoverUid === locked) return draft;
        return { ...draft, hoverUid: locked };
      });
    },
    [],
  );

  const onCancelChoice = useCallback(() => {
    if (!interactive) return;
    onAction(intentToAction(viewer, { kind: "resolve-choice", key: null }));
    setSelection(null);
  }, [interactive, onAction, viewer]);

  const kit: BoardKit = useMemo(
    () => ({
      projection,
      interactive,
      selection,
      attackDraft,
      onEntityClick,
      onPill: dispatchIntent,
      onInspect: attackDraft ? onHoverDraftTarget : onInspect,
      onCancelChoice,
    }),
    [
      projection,
      interactive,
      selection,
      attackDraft,
      onEntityClick,
      dispatchIntent,
      onHoverDraftTarget,
      onInspect,
      onCancelChoice,
    ],
  );

  const choice = projection.choice;
  const showChoiceModal =
    interactive && choice !== null && choice.isModal && choice.player === viewer;
  const showMulligan = interactive && projection.awaitingMulligan === viewer;
  const showEnd = projection.winner !== null;

  return (
    <main
      className={classes.shell}
      data-game="naruto"
      data-testid="naruto-shell"
      data-layout={mobile ? "mobile" : "desktop"}
      data-turn={projection.turn}
    >
      <div ref={boardRef} className={classes.boardColumn} style={{ position: "relative", flex: 1 }}>
        {mobile ? <MobileBoard kit={kit} /> : <DesktopBoard kit={kit} state={state} />}
        {interactive ? (
          <AttackArrow boardRef={boardRef} attack={projection.attack} draft={attackDraft} />
        ) : projection.attack ? (
          <AttackArrow boardRef={boardRef} attack={projection.attack} draft={null} />
        ) : null}
      </div>
      {showChoiceModal && choice ? (
        <ChoiceModal
          choice={choice}
          onResolve={(key) => onAction(intentToAction(viewer, { kind: "resolve-choice", key }))}
        />
      ) : null}
      {showMulligan ? <MulliganBanner kit={kit} /> : null}
      {showEnd && projection.winner ? (
        <EndOverlay
          winner={projection.winner}
          winnerName={state.players[projection.winner].name}
          isViewer={projection.winner === viewer}
          onNewGame={onNewGame}
        />
      ) : null}
    </main>
  );
}
