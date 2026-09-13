/**
 * NarutoBoard: owns the interaction state machine (click-to-select,
 * two-step DECLARE_ATTACK draft, pendingChoice targeting) and delegates its
 * responsive layout, mobile activity drawer, safe areas, and focus handling
 * to the shared SimulatorViewportShell at 900px. `?mobile` remains a
 * fixture-only override through that shared shell.
 *
 * All moves go out through `onAction` as engine Actions; the owner page
 * applies them via `applyAction`. Pills are gated by the engine's *Block
 * queries in projection/interactions.ts, so a click never reaches the
 * engine illegally.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  CardDetailSheet,
  MobilePlayerRail,
  SimulatorViewportShell,
  useSimulatorViewportLayout,
} from "@tcg/simulator-ui";

import { cardOf, effectivePower, findCharacter } from "@tcg-engines/naruto-engine";
import type { Action, GameState, PlayerId } from "@tcg-engines/naruto-engine";

import { BugReportDialog } from "../../../runtime/BugReportDialog.tsx";
import type { BugReportContext } from "../../../runtime/bugReportApi.ts";
import { intentToAction, legalAttackTargets, type ActionPill } from "../projection/interactions.ts";
import { cardImageUrl, phaseLabel } from "../projection/labels.ts";
import { projectSimulator, type NarutoParticipantNames } from "../projection/projectSimulator.ts";
import { AttackArrow } from "./AttackArrow.tsx";
import { ChoiceModal } from "./ChoiceModal.tsx";
import { DesktopBoard } from "./DesktopBoard.tsx";
import { EndOverlay } from "./EndOverlay.tsx";
import { MobileBoard } from "./MobileBoard.tsx";
import { MulliganBanner } from "./MulliganBanner.tsx";
import { NarutoActivityPanel } from "./NarutoActivityPanel.tsx";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import classes from "./board.module.css";
import {
  pillsFor,
  dragTargetsFor,
  type AttackDraft,
  type BoardKit,
  type EntityZoneKind,
  type NarutoDrag,
  type NarutoDropTarget,
  type Selection,
} from "./types.ts";

export const NARUTO_MOBILE_BREAKPOINT_PX = 900;

export interface NarutoBoardProps {
  readonly state: GameState;
  readonly viewer: PlayerId;
  readonly onAction: (action: Action) => void;
  readonly participantNames?: NarutoParticipantNames;
  /** Fixtures pass false: render-only, no interactions or overlays. */
  readonly interactive?: boolean;
  /** Force the mobile tree (tests); `?mobile` URL param also works. */
  readonly forceMobile?: boolean;
  readonly onNewGame?: (() => void) | undefined;
  readonly onUndo?: (() => void) | undefined;
  readonly canUndo?: boolean;
  readonly bugReportContext?: BugReportContext;
}

type Inspection = {
  readonly uid: string | null;
  readonly zone: EntityZoneKind | null;
  readonly owner: PlayerId | null;
};

export function NarutoBoard({
  state,
  viewer,
  onAction,
  participantNames = {},
  interactive = true,
  forceMobile = false,
  onNewGame,
  onUndo,
  canUndo = false,
  bugReportContext,
}: NarutoBoardProps) {
  const projection = useMemo(
    () => projectSimulator(state, viewer, participantNames),
    [participantNames, state, viewer],
  );
  const [selection, setSelection] = useState<Selection>(null);
  const [attackDraft, setAttackDraft] = useState<AttackDraft | null>(null);
  const [dragging, setDragging] = useState<NarutoDrag | null>(null);
  const [inspected, setInspected] = useState<Inspection>({ uid: null, zone: null, owner: null });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => setClientReady(true), []);
  const urlForceMobile =
    clientReady &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("mobile");
  const layoutOverride = forceMobile || urlForceMobile ? "mobile" : undefined;

  // Reset transient interaction state whenever the authoritative state changes.
  useEffect(() => {
    setSelection(null);
    setAttackDraft(null);
    setDragging(null);
    setDetailsOpen(false);
  }, [state]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
  );

  const dragForHand = useCallback(
    (handUid: string): NarutoDrag | null => {
      if (!interactive) return null;
      const targets = dragTargetsFor(projection.pills[handUid] ?? []);
      return targets.length > 0 ? { handUid, targets } : null;
    },
    [interactive, projection.pills],
  );

  const onDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const id = String(active.id);
      if (!id.startsWith("naruto-hand:")) return;
      setDragging(dragForHand(id.slice("naruto-hand:".length)));
    },
    [dragForHand],
  );

  const selectedEntity = useMemo(
    () =>
      selection
        ? (projection.entities.find((entity) => entity.id === selection.uid) ?? null)
        : null,
    [projection.entities, selection],
  );

  const onOpenDetails = useCallback(() => {
    if (selectedEntity) setDetailsOpen(true);
  }, [selectedEntity]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && projection.choice === null) {
        setSelection(null);
        setAttackDraft(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projection.choice]);

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

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      const sourceId = String(active.id);
      const targetId = over ? String(over.id) : null;
      const drag = sourceId.startsWith("naruto-hand:")
        ? dragForHand(sourceId.slice("naruto-hand:".length))
        : null;
      setDragging(null);
      if (!drag || !targetId) return;
      const target: NarutoDropTarget | null = targetId.startsWith(`naruto-drop:battler:${viewer}:`)
        ? "battler"
        : targetId.startsWith(`naruto-drop:support:${viewer}:`)
          ? "support"
          : targetId === `naruto-drop:play-support:${viewer}`
            ? "play-support"
            : null;
      if (target === null || !drag.targets.includes(target)) return;
      const pill = (projection.pills[drag.handUid] ?? []).find(
        (candidate) =>
          candidate.enabled &&
          (target === "battler"
            ? candidate.intent.kind === "summon"
            : target === "support"
              ? candidate.intent.kind === "set-support"
              : candidate.intent.kind === "activate-support-hand"),
      );
      if (pill) dispatchIntent(pill);
    },
    [dispatchIntent, dragForHand, projection.pills, viewer],
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

      // Otherwise: select own actionable entities; inspect cards with no default action.
      if (zone === "trash") {
        setInspected({ uid, zone, owner });
        setSelection(null);
        return;
      }
      const selectable =
        owner === viewer &&
        (zone === "hand" ||
          zone === "character" ||
          zone === "support" ||
          zone === "leader" ||
          zone === "summon");
      const detailsSelection =
        zone === "hand" ||
        zone === "character" ||
        zone === "support" ||
        zone === "leader" ||
        zone === "summon";
      const hasEnabledAction = (projection.pills[uid] ?? []).some((pill) => pill.enabled);
      if (!selectable || !hasEnabledAction) {
        if (detailsSelection) {
          setSelection({ kind: zone, uid } as Selection);
          setDetailsOpen(true);
        } else {
          setSelection(null);
        }
        return;
      }
      setSelection((current) =>
        current && current.uid === uid ? null : ({ kind: zone, uid } as Selection),
      );
    },
    [attackDraft, interactive, onAction, projection.choice, projection.pills, viewer],
  );

  const onInspect = useCallback(
    (uid: string | null, zone: EntityZoneKind | null, owner: PlayerId | null) =>
      setInspected({ uid, zone, owner }),
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
      dragging,
      onEntityClick,
      onPill: dispatchIntent,
      onOpenDetails,
      onInspect: attackDraft ? onHoverDraftTarget : onInspect,
      onCancelChoice,
    }),
    [
      projection,
      interactive,
      selection,
      attackDraft,
      dragging,
      onEntityClick,
      dispatchIntent,
      onOpenDetails,
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

  const primaryMobilePill =
    projection.seamPills.find((pill) => pill.id === "pass-counter") ??
    projection.seamPills.find((pill) => pill.id === "end-turn");
  const canUseUndo = interactive && canUndo && Boolean(onUndo);
  const selectedMobilePills = selection ? pillsFor(kit, selection.uid) : [];
  const activityPanel = (
    <NarutoActivityPanel
      kit={kit}
      state={state}
      inspected={inspected}
      onNewGame={onNewGame}
      onReportBug={bugReportContext ? () => setBugReportOpen(true) : undefined}
    />
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragCancel={() => setDragging(null)}
      onDragEnd={onDragEnd}
    >
      <SimulatorViewportShell
        className={classes.shell}
        data-game="naruto"
        data-testid="naruto-shell"
        data-turn={projection.turn}
        mobileBreakpoint={NARUTO_MOBILE_BREAKPOINT_PX}
        layoutOverride={layoutOverride}
        sidebar={activityPanel}
        sidebarLabel="Naruto match activity"
        mobilePanel={activityPanel}
        mobilePanelLabel="Naruto match activity"
        mobileTopRail={({ openSidebar }) => (
          <MobilePlayerRail
            className={classes.mobileTopRail}
            side="opponent"
            left={
              <button
                type="button"
                className={classes.mobileRailButton}
                data-testid="naruto-mobile-activity"
                onClick={openSidebar}
                aria-label="Open Naruto match activity"
              >
                Activity
              </button>
            }
            center={
              <span className={classes.mobileRailStatus}>
                <strong data-testid="naruto-mobile-phase">
                  Turn {projection.turn} · {phaseLabel(projection.phase, projection.step)}
                </strong>
              </span>
            }
            right={
              <span
                className={classes.mobileRailPlayer}
                aria-label={`${projection.top.name}, ${projection.top.leader.life} life`}
              >
                <small>Opponent</small>
                <strong>
                  {projection.top.name} · {projection.top.leader.life}
                </strong>
              </span>
            }
          />
        )}
        mobileBottomRail={() => (
          <MobilePlayerRail
            className={`${classes.mobileBottomRail} ${selection ? classes.mobileBottomRailActions : ""}`}
            side="player"
            data-mode={selection ? "actions" : "default"}
            left={
              selection ? null : (
                <span
                  className={classes.mobileRailPlayer}
                  aria-label={`${projection.bottom.name}, ${projection.bottom.leader.life} life`}
                >
                  <small>You</small>
                  <strong>
                    {projection.bottom.name} · {projection.bottom.leader.life}
                  </strong>
                </span>
              )
            }
            center={null}
            right={
              selection ? (
                <div data-testid="naruto-mobile-action-dock">
                  <nav
                    className={classes.mobileBottomActionRail}
                    aria-label="Selected card actions"
                    data-testid="naruto-mobile-card-actions"
                  >
                    <button
                      type="button"
                      className={`${classes.mobileSelectedAction} ${classes.mobileSelectedActionBack}`}
                      data-testid="naruto-mobile-card-actions-back"
                      onClick={() => setSelection(null)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className={classes.mobileSelectedAction}
                      data-testid="naruto-mobile-card-details"
                      onClick={kit.onOpenDetails}
                    >
                      Details
                    </button>
                    {selectedMobilePills.map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        className={classes.mobileSelectedAction}
                        data-testid={`naruto-mobile-pill-${pill.id}`}
                        disabled={!pill.enabled}
                        title={pill.reason ?? undefined}
                        onClick={() => kit.onPill(pill)}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </nav>
                </div>
              ) : (
                <span className={classes.mobileRailActions} data-has-undo={Boolean(onUndo)}>
                  {onUndo ? (
                    <button
                      type="button"
                      className={classes.mobileRailUndo}
                      data-testid="naruto-undo-mobile"
                      disabled={!canUseUndo}
                      onClick={onUndo}
                      aria-label={canUseUndo ? "Undo last action" : "No action to undo"}
                    >
                      Undo
                    </button>
                  ) : null}
                  {primaryMobilePill ? (
                    <button
                      type="button"
                      className={classes.endTurnButton}
                      data-testid={`naruto-${primaryMobilePill.id}-mobile`}
                      disabled={!interactive || !primaryMobilePill.enabled}
                      title={primaryMobilePill.reason ?? undefined}
                      onClick={() => kit.onPill(primaryMobilePill)}
                    >
                      {primaryMobilePill.id === "pass-counter"
                        ? "Pass priority"
                        : primaryMobilePill.label}
                    </button>
                  ) : null}
                </span>
              )
            }
          />
        )}
        tabletop={<NarutoTabletop kit={kit} interactive={interactive} attackDraft={attackDraft} />}
      >
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
            winnerName={
              projection.winner === projection.bottom.player
                ? projection.bottom.name
                : projection.top.name
            }
            isViewer={projection.winner === viewer}
            onNewGame={onNewGame}
          />
        ) : null}
        {selectedEntity ? (
          <CardDetailSheet
            entity={selectedEntity}
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
          />
        ) : null}
      </SimulatorViewportShell>
      <DragOverlay dropAnimation={null}>
        {dragging ? <NarutoDragPreview projection={projection} dragging={dragging} /> : null}
      </DragOverlay>
      {bugReportContext ? (
        <BugReportDialog
          open={bugReportOpen}
          onOpenChange={setBugReportOpen}
          context={bugReportContext}
          source="naruto-simulator"
          gameName="Naruto"
        />
      ) : null}
    </DndContext>
  );
}

function NarutoDragPreview({
  projection,
  dragging,
}: {
  readonly projection: ReturnType<typeof projectSimulator>;
  readonly dragging: NarutoDrag;
}) {
  const card = projection.bottom.hand.find((candidate) => candidate.uid === dragging.handUid);
  if (!card || !card.visible) return null;
  return (
    <div className={classes.dragPreview} aria-hidden="true">
      <NarutoCardImage
        className={classes.dragPreviewArt}
        src={cardImageUrl(card.cardId)}
        alt=""
        draggable={false}
        fallbackLabel={card.name}
      />
    </div>
  );
}

function NarutoTabletop({
  kit,
  interactive,
  attackDraft,
}: {
  readonly kit: BoardKit;
  readonly interactive: boolean;
  readonly attackDraft: AttackDraft | null;
}) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const layout = useSimulatorViewportLayout();

  return (
    <div ref={boardRef} className={classes.attackOverlayHost}>
      {layout === "mobile" ? <MobileBoard kit={kit} /> : <DesktopBoard kit={kit} />}
      {interactive ? (
        <AttackArrow boardRef={boardRef} attack={kit.projection.attack} draft={attackDraft} />
      ) : kit.projection.attack ? (
        <AttackArrow boardRef={boardRef} attack={kit.projection.attack} draft={null} />
      ) : null}
    </div>
  );
}
