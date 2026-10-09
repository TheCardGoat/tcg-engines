import { availableInteractionCardIds } from "@tcg/simulator-presentation/selection";
import {
  PointerDragDropSurface,
  PointerDraggable,
  PointerDroppable,
  createDragMotion,
} from "@tcg/simulator-ui";
import { pointerWithin, rectIntersection } from "@dnd-kit/core";
import { SharedInteractionPrompt } from "../../../../components/SharedInteractionPrompt";
import { TargetModal } from "@tcg/simulator-presentation/target-modal";
import { CardInspectionControls, useCardInspection } from "@tcg/simulator-presentation/inspection";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Drawer, Button } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import {
  useInteractionDraft,
  useInteractionSurface,
  resolveInteractionText,
} from "@tcg/simulator-ui";
import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";
import { RotateCw, Layers } from "lucide-react";
import { cardArtwork } from "./card-artwork";
import type { ArenaProps } from "../board-types";
import type { LiveBoardCard } from "../board-types";
import type { SceneTextureStatus } from "@tcg/simulator-presentation/three";
import { arenaLayout, arenaHandPageSize } from "./layout";
import { ArenaScene, type CardAnchor, type ZoneAnchor } from "./Scene";
import { arenaZones, zoneId, type ArenaZone } from "./zones";
import { ZoneOverlay } from "./ZoneOverlay";
import { arenaAssets, resourcePlaceSound } from "./assets";
import styles from "./arena3d.module.css";
import type { ArenaOpening } from "./useArenaOpening";
import {
  initSimulatorSoundService,
  playSimulatorSound,
  preloadSimulatorSoundAsset,
} from "@tcg/simulator-presentation/audio/sound-service";

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function AlphaClashArena3D(
  props: ArenaProps & {
    view: EngineInteractionView;
    disabled?: boolean;
    openingScene?: ArenaOpening;
  },
) {
  const {
    board,
    viewerSeat,
    controls,
    utilities,
    view,
    disabled,
    selectableInstanceIds,
    selectedInstanceIds,
    onCardClick,
    openingScene,
  } = props;
  const portrait = useMediaQuery("(orientation: portrait) and (max-width: 900px)", false);
  const compact = useMediaQuery("(max-height: 550px)", false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const reducedMotion = prefersReducedMotion || reduceMotion;
  const { width, height } = useViewportSize();
  const clashWidth = Math.min(1120, 1460 * Math.min(1, width / Math.max(1, height) / 1.6) - 190);
  const draft = useInteractionDraft();
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const inspection = useCardInspection<LiveBoardCard>();
  const inspect = inspection.card;
  const setInspect = inspection.inspect;
  useEffect(() => {
    if (inspect) setHovered(null);
  }, [inspect?.instanceId]);
  const [drawer, setDrawer] = useState(false);
  const [library, setLibrary] = useState(false);
  const [libraryZone, setLibraryZone] = useState<ArenaZone | null>(null);
  const [zoneAnchors, setZoneAnchors] = useState<ZoneAnchor[]>([]);
  const [handPage, setHandPage] = useState(0);
  const [turnTop, setTurnTop] = useState<number>();
  const [anchors, setAnchors] = useState<CardAnchor[]>([]);
  const [failed, setFailed] = useState(false);
  const [assetStatus, setAssetStatus] = useState<SceneTextureStatus>({ loading: 0, failed: [] });
  const [retryKey, setRetryKey] = useState(0);
  const hand = board.cards.filter((c) => c.controller === viewerSeat && c.zone === "hand");
  const opening = board.phaseName === "setup";
  const beat = openingScene?.beat;
  const openingBusy = Boolean(beat && beat.id !== "hand");
  const [mulliganSelection, setMulliganSelection] = useState<ReadonlySet<string>>(new Set());
  useEffect(() => setMulliganSelection(new Set()), [viewerSeat, beat?.id]);
  const [sound, setSound] = useState(true);
  useEffect(() => {
    if (sound && beat?.cue && !document.hidden) playSimulatorSound(beat.cue);
  }, [beat, sound]);
  const maxPage = Math.max(0, Math.ceil(hand.length / arenaHandPageSize(board)) - 1);
  useEffect(() => setHandPage((p) => Math.min(p, maxPage)), [maxPage]);
  const cards = useMemo(() => {
    const placed = arenaLayout(
      board,
      viewerSeat,
      compact,
      Math.min(handPage, maxPage),
      Math.max(700, clashWidth),
    );
    if (
      !openingScene?.handOrder.some((id) => placed.some((p) => p.hand && p.card.instanceId === id))
    )
      return placed;
    const handCards = placed.filter((p) => p.hand);
    const replacements = handCards.filter((p) => !openingScene.retainedIds.has(p.card.instanceId));
    const ordered = openingScene.handOrder
      .map((id) =>
        openingScene.retainedIds.has(id)
          ? handCards.find((p) => p.card.instanceId === id)
          : replacements.shift(),
      )
      .filter((p): p is (typeof placed)[number] => !!p);
    return [...placed.filter((p) => !p.hand), ...ordered];
  }, [board, viewerSeat, compact, handPage, maxPage, clashWidth, openingScene?.handOrder]);
  const zones = useMemo(
    () => arenaZones(board, viewerSeat, compact, Math.max(700, clashWidth)),
    [board, viewerSeat, compact, clashWidth],
  );
  const promptSurface = useInteractionSurface(view, {
    disabled: disabled || openingBusy,
    visibleEntityIds: new Set(cards.map((placed) => placed.card.instanceId)),
  });
  const promptCards = new Map(
    board.cards
      .filter((card) => card.definitionId && !card.faceDown)
      .map((card) => [
        card.instanceId,
        {
          id: card.instanceId,
          label: card.name ?? "Card",
          imageUrl: cardArtwork(card),
          group: `${card.controller === viewerSeat ? "You" : "Opponent"} · ${card.zone}`,
        },
      ]),
  );
  const hoveredCard = board.cards.find((c) => c.instanceId === hovered);
  const cardZone = hoveredCard ? zoneId(hoveredCard.controller, hoveredCard.zone) : null;
  const visibleLibraryCards = board.cards.filter(
    (c) =>
      c.zone !== "deck" &&
      (!libraryZone || (c.controller === libraryZone.seat && c.zone === libraryZone.zone)),
  );
  const enabled = !disabled && !view.projectionFailure && view.status !== "game-over";
  const next = opening
    ? view.actions.find((a) => a.enabled && a.id === "startGame")
    : (view.actions.find((a) => a.enabled && a.intent === "resource-card") ??
      view.actions.find((a) => a.enabled && a.intent === "pass"));
  const mulligan = opening
    ? view.actions.find((a) => a.enabled && a.intent === "mulligan")
    : undefined;
  const attack = view.actions.find((a) => a.enabled && a.intent === "attack");
  const status = opening
    ? "OPENING HAND"
    : board.phaseName === "complete"
      ? "MATCH COMPLETE"
      : view.status === "waiting"
        ? "WAITING"
        : board.activePlayer === viewerSeat
          ? "YOUR TURN"
          : "YOUR RESPONSE";
  const activate = (action: InteractionAction) => {
    if (!enabled || !action.enabled) return;
    if (openingScene && action.id === "mulligan") {
      openingScene.redraw(
        [...mulliganSelection],
        hand.map((card) => card.instanceId),
      );
      return;
    }
    if (openingScene && action.id === "startGame") {
      openingScene.keep();
      return;
    }
    draft.begin(action.id);
  };
  const availableCards =
    enabled && !inspect && !drawer && !library && !openingBusy && !draft.active
      ? availableInteractionCardIds(view)
      : new Set<string>();
  const resourceAction = view.actions.find((a) => a.enabled && a.id === "deployResource");
  const resourceInput = resourceAction?.inputs.find((i) => i.kind === "entity-selection");
  const resourceIds =
    resourceInput?.kind === "entity-selection"
      ? resourceInput.candidates
          .filter((c) => c.enabled && c.entity.instanceId)
          .map((c) => c.entity.instanceId!)
      : [];
  const skipResource = view.actions.find((a) => a.enabled && a.id === "passResource");
  const resourceStep = !!skipResource;
  const resourceDrag = resourceStep && enabled && !inspect && !drawer && !library && !draft.active;
  const [dragMotion] = useState(() => createDragMotion<string>());
  useEffect(() => {
    const session = dragMotion.getSnapshot();
    if (session?.phase === "pending") {
      if (!hand.some((card) => card.instanceId === session.source) || !resourceStep)
        dragMotion.finish();
      else if (draft.submissionRejected) dragMotion.returnToSource(reducedMotion ? 0 : 180);
    }
  }, [view.stateVersion, resourceStep, draft.submissionRejected, dragMotion, reducedMotion, hand]);
  useEffect(() => () => dragMotion.finish(), [dragMotion]);
  useEffect(() => {
    if (resourceStep && sound) preloadSimulatorSoundAsset(resourcePlaceSound);
  }, [resourceStep, sound]);
  const previousResourceStep = useRef({ active: resourceStep, handSize: hand.length });
  useEffect(() => {
    const previous = previousResourceStep.current;
    if (
      previous.active &&
      !resourceStep &&
      hand.length === previous.handSize &&
      board.phaseName.toLowerCase() === "primary" &&
      sound
    )
      playSimulatorSound("phase.change", () => !document.hidden);
    previousResourceStep.current = { active: resourceStep, handSize: hand.length };
  }, [resourceStep, hand.length, board.phaseName, sound]);
  const [dropNotice, setDropNotice] = useState<string | null>(null);
  useEffect(() => setDropNotice(null), [view.stateVersion]);
  useEffect(() => {
    if (resourceStep && draft.actionId === resourceAction?.id && draft.submissionRejected) {
      setDropNotice("Resource rejected. Choose another card or skip.");
      draft.cancel();
    }
  }, [resourceStep, resourceAction?.id, draft.actionId, draft.submissionRejected, draft.cancel]);
  const canSelectMulligan = !!openingScene && beat?.id === "hand" && !!mulligan && enabled;
  const chooseCard = (card: LiveBoardCard) => {
    if (canSelectMulligan && card.zone === "hand" && card.controller === viewerSeat) {
      setMulliganSelection((previous) => {
        const next = new Set(previous);
        if (next.has(card.instanceId)) next.delete(card.instanceId);
        else next.add(card.instanceId);
        return next;
      });
      return;
    }
    if (selectableInstanceIds?.has(card.instanceId) && onCardClick) {
      onCardClick(card.instanceId);
      return;
    }
    if (card.definitionId && (!card.faceDown || card.controller === viewerSeat))
      setInspect({ ...card, faceDown: false });
  };
  const inspectActions = inspect
    ? view.actions.filter((a) => a.source?.instanceId === inspect.instanceId && a.enabled)
    : [];
  const handleSceneFailure = () => {
    openingScene?.cancel();
    setFailed(true);
  };
  const fallback = (
    <div className={styles.fallback} role="alert">
      <p>The 3D board is unavailable. Your match is still active.</p>
      <Button
        onClick={() => {
          setFailed(false);
          setRetryKey((key) => key + 1);
        }}
      >
        Retry 3D board
      </Button>
    </div>
  );
  if (failed) return fallback;
  return (
    <PointerDragDropSurface
      id="alpha-clash-board"
      motion={dragMotion}
      presentation="external"
      cancelKey={resourceDrag ? view.stateVersion : "locked"}
      decodeSource={(id) => id}
      renderOverlay={() => null}
      collisionDetection={(args) =>
        args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args)
      }
      onDragEnd={(id, destination) => {
        if (
          resourceDrag &&
          destination === "resource" &&
          id &&
          resourceIds.includes(id) &&
          resourceAction &&
          resourceInput
        ) {
          draft.begin(resourceAction.id, { [resourceInput.id]: [id] });
          return { kind: "accepted" };
        }
        if (
          resourceDrag &&
          destination === "skip-resource" &&
          id === "resource-step-marker" &&
          skipResource
        ) {
          draft.begin(skipResource.id);
          dragMotion.finish();
          return { kind: "accepted" };
        }
        setDropNotice("No action taken. Use a highlighted card and your Resource Zone, or skip.");
        return { kind: "rejected" };
      }}
    >
      <section
        className={styles.root}
        style={{ "--ac-action": `url("${arenaAssets.button}")` } as CSSProperties}
        onPointerDownCapture={() => {
          if (resourceDrag && sound) void initSimulatorSoundService().catch(() => setSound(false));
        }}
        onKeyDownCapture={() => {
          if (resourceDrag && sound) void initSimulatorSoundService().catch(() => setSound(false));
        }}
        data-testid="alpha-clash-arena-3d"
        data-inspecting={!!inspect || undefined}
        data-opening-beat={beat?.id ?? "play"}
      >
        <div className={styles.screenReader} aria-label="Player status">
          {(["player-one", "player-two"] as const).map((seat) => (
            <p key={seat}>
              {seat === viewerSeat ? "You" : "Opponent"}: {board.players[seat].health} of{" "}
              {board.players[seat].maxHealth} health. Deck {board.players[seat].deckSize}. Hand{" "}
              {board.players[seat].handSize}.
            </p>
          ))}
        </div>
        {portrait ? (
          <div className={styles.rotate} role="status">
            <RotateCw size={50} />
            <h1>Turn to landscape</h1>
            <p>The full board needs a wider view.</p>
            <small>Your match continues while you rotate.</small>
          </div>
        ) : (
          <>
            <div className={styles.scene}>
              <SceneBoundary key={retryKey} fallback={fallback}>
                <ArenaScene
                  dragMotion={dragMotion}
                  availableInteractionIds={canSelectMulligan ? undefined : availableCards}
                  openingScene={openingScene}
                  openingSound={sound}
                  zones={zones}
                  highlightedZone={cardZone ?? highlightedZone}
                  inspectedCard={inspect}
                  onZoneAnchors={setZoneAnchors}
                  board={board}
                  viewer={viewerSeat}
                  cards={cards}
                  compact={compact}
                  hovered={hovered}
                  selected={canSelectMulligan ? mulliganSelection : selectedInstanceIds}
                  selectable={selectableInstanceIds}
                  reducedMotion={reducedMotion}
                  onAssets={setAssetStatus}
                  retryKey={retryKey}
                  onAnchors={setAnchors}
                  onTurnPosition={setTurnTop}
                  onFailure={handleSceneFailure}
                />
              </SceneBoundary>
            </div>
            {(assetStatus.loading > 0 || assetStatus.failed.length > 0) && (
              <div className={styles.assetStatus} role="status">
                {assetStatus.loading > 0
                  ? `Loading artwork · ${assetStatus.loading}`
                  : `${assetStatus.failed.length} images unavailable`}{" "}
                {assetStatus.failed.length > 0 && (
                  <button onClick={() => setRetryKey((k) => k + 1)}>Retry artwork</button>
                )}
              </div>
            )}
            {!beat && (
              <ZoneOverlay
                zones={zones}
                anchors={zoneAnchors}
                viewer={viewerSeat}
                onHighlight={setHighlightedZone}
                onOpen={(zone) => {
                  setLibraryZone(zone);
                  setLibrary(true);
                }}
              />
            )}
            {resourceDrag &&
              zoneAnchors
                .filter((anchor) => anchor.id === zoneId(viewerSeat, "resource"))
                .map((anchor) => (
                  <PointerDroppable
                    key={anchor.id}
                    id="resource"
                    className={styles.resourceDrop}
                    style={{
                      left: anchor.left,
                      top: anchor.top,
                      width: anchor.width,
                      height: Math.max(44, anchor.height),
                    }}
                  >
                    <span>Deploy resource</span>
                  </PointerDroppable>
                ))}
            <div className={styles.cardTargets} aria-label="Board cards">
              {!openingBusy &&
                anchors.map((anchor) => {
                  const card = cards.find((p) => p.card.instanceId === anchor.id)?.card;
                  if (!card) return null;
                  const interactionAvailable =
                    card.zone === "hand" &&
                    card.controller === viewerSeat &&
                    availableCards.has(card.instanceId);
                  const mulliganCard =
                    canSelectMulligan && card.zone === "hand" && card.controller === viewerSeat;
                  const selectable =
                    mulliganCard || selectableInstanceIds?.has(card.instanceId) === true;
                  const selected = (mulliganCard ? mulliganSelection : selectedInstanceIds).has(
                    card.instanceId,
                  );
                  if (resourceDrag && card.zone === "hand" && card.controller === viewerSeat)
                    return (
                      <div
                        key={anchor.id}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          setInspect(card);
                        }}
                      >
                        <PointerDraggable
                          id={card.instanceId}
                          transformBehavior="overlay-only"
                          aria-label={`Drag ${card.name ?? "card"} to Resource Zone`}
                          className={styles.cardTarget}
                          style={{
                            left: anchor.left,
                            top: anchor.top,
                            width: anchor.width,
                            height: anchor.height,
                          }}
                        >
                          <span className={styles.screenReader}>
                            {interactionAvailable ? "Interaction available. " : ""}Drag to your
                            Resource Zone. Right-click to inspect.
                          </span>
                        </PointerDraggable>
                      </div>
                    );
                  return (
                    <button
                      key={anchor.id}
                      type="button"
                      style={{
                        left: anchor.left,
                        top: anchor.top,
                        width: anchor.width,
                        height: anchor.height,
                      }}
                      className={`${styles.cardTarget} ${mulliganCard ? "tcg-card-choice" : ""}`}
                      data-testid={`ac-card:${card.instanceId}`}
                      aria-label={`${selectable ? "Select" : "Inspect"} ${card.faceDown ? "face-down card" : (card.name ?? "card")}${interactionAvailable ? ", interaction available" : ""}`}
                      aria-pressed={selectable ? selected : undefined}
                      data-mulligan-selected={(mulliganCard && selected) || undefined}
                      title={mulliganCard ? "Click to select. Right-click to inspect." : undefined}
                      onMouseEnter={() => setHovered(card.instanceId)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(card.instanceId)}
                      onBlur={() => setHovered(null)}
                      onClick={() => chooseCard(card)}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        if (card.definitionId && (!card.faceDown || card.controller === viewerSeat))
                          setInspect({ ...card, faceDown: false });
                      }}
                    />
                  );
                })}
            </div>
            <header className={styles.header}>
              <div className={styles.brand}>
                ALPHA <b>CLASH</b>
                <small>ARENA</small>
              </div>
              <div className={styles.tools}>
                {utilities}
                <button
                  type="button"
                  disabled={openingBusy}
                  onClick={() => {
                    setLibraryZone(null);
                    setLibrary(true);
                  }}
                >
                  Cards & piles
                </button>
                <button type="button" onClick={() => setDrawer(true)}>
                  Match
                </button>
              </div>
            </header>
            <div
              className={`${styles.turn} ${beat ? styles.openingTurn : ""}`}
              style={{ top: beat ? undefined : turnTop }}
              role="status"
            >
              <strong>{beat?.title ?? status}</strong>
              <span>
                {opening ? (
                  viewerSeat === "player-one" ? (
                    (props.participantNames?.p1 ?? "You")
                  ) : (
                    (props.participantNames?.p2 ?? "You")
                  )
                ) : (
                  <>
                    Turn {board.turnNumber} · {board.phaseName}
                    {board.clash ? ` · ${board.clash.step}` : ""}
                  </>
                )}
              </span>
              {beat && (
                <small>
                  {beat.id === "hand"
                    ? mulligan
                      ? "Select cards to replace. Right-click to inspect."
                      : "Mulligan used. Your opening hand is ready."
                    : beat.detail}
                </small>
              )}
            </div>
            {(!beat || beat.localCount > 0) && (
              <div className={styles.handInfo}>
                <span
                  className={styles.handCount}
                  title={`${hand.length} ${hand.length === 1 ? "card" : "cards"} in hand`}
                  aria-label={`${hand.length} ${hand.length === 1 ? "card" : "cards"} in hand`}
                >
                  <Layers size={15} aria-hidden="true" /> {hand.length}
                </span>
                {maxPage > 0 && (
                  <div>
                    <button
                      aria-label="Previous hand cards"
                      disabled={handPage === 0}
                      onClick={() => setHandPage((p) => p - 1)}
                    >
                      ‹
                    </button>
                    <span>
                      {handPage + 1}/{maxPage + 1}
                    </span>
                    <button
                      aria-label="Next hand cards"
                      disabled={handPage === maxPage}
                      onClick={() => setHandPage((p) => p + 1)}
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className={styles.actions}>
              {resourceStep && (
                <>
                  <p className={styles.setupHint} role="status">
                    {dropNotice ?? "Drag a hand card to your Resource Zone, or skip."}
                  </p>
                  <div className={styles.secondaryActions}>
                    <PointerDraggable
                      id="resource-step-marker"
                      disabled={!resourceDrag}
                      className={styles.assetButton}
                    >
                      Resource step ↗
                    </PointerDraggable>
                    <PointerDroppable
                      id="skip-resource"
                      onClick={() => resourceDrag && skipResource && draft.begin(skipResource.id)}
                      className={styles.assetButton}
                    >
                      Skip resource
                    </PointerDroppable>
                  </div>
                </>
              )}
              {opening && !beat && (
                <p className={styles.setupHint}>
                  {mulligan
                    ? "Choose cards to replace once, or start the game."
                    : "Mulligan used. Your opening hand is ready."}
                </p>
              )}
              <div className={styles.secondaryActions}>
                {mulligan && !openingBusy && (
                  <button
                    className={`${styles.assetButton} ${styles.replaceButton}`}
                    disabled={!enabled || (!!openingScene && !mulliganSelection.size)}
                    aria-label={
                      openingScene
                        ? `Replace ${mulliganSelection.size} selected ${mulliganSelection.size === 1 ? "card" : "cards"}`
                        : "Choose cards to replace"
                    }
                    title="Replace selected cards once."
                    onClick={() => activate(mulligan)}
                  >
                    {openingScene ? `Replace ${mulliganSelection.size}` : "Choose cards"}
                  </button>
                )}
                {attack && (
                  <button
                    className={styles.assetButton}
                    disabled={!enabled}
                    onClick={() => activate(attack)}
                  >
                    Clash
                  </button>
                )}
                <button className={styles.assetButton} onClick={() => setDrawer(true)}>
                  More
                </button>
              </div>
              {!resourceStep && (
                <button
                  className={`${styles.assetButton} ${styles.primary}`}
                  data-action-attention-target
                  disabled={
                    beat?.id === "ready"
                      ? assetStatus.loading > 0
                      : !enabled || (!next && !draft.active)
                  }
                  onClick={() => {
                    if (beat?.id === "ready") {
                      if (sound) void initSimulatorSoundService().catch(() => setSound(false));
                      openingScene?.begin();
                      return;
                    }
                    if (draft.active && promptSurface.input) promptSurface.restore();
                    else if (draft.active) setDrawer(true);
                    else if (next) activate(next);
                  }}
                >
                  {beat?.id === "ready"
                    ? "Begin opening"
                    : openingBusy
                      ? "Preparing…"
                      : openingScene && next?.id === "startGame"
                        ? "Keep & begin"
                        : draft.active
                          ? "Complete choice"
                          : next
                            ? next.intent === "resource-card"
                              ? "Deploy resource"
                              : resolveInteractionText(next.text)
                            : "Waiting"}
                </button>
              )}
            </div>
            {draft.active && !drawer && !promptSurface.input && (
              <button className={styles.pending} onClick={() => setDrawer(true)}>
                Selection in progress · Open prompt
              </button>
            )}
          </>
        )}
        <Drawer
          opened={drawer && !portrait}
          onClose={() => setDrawer(false)}
          title="Match actions & log"
          position="right"
          size="sm"
          withOverlay={false}
          trapFocus={false}
          lockScroll={false}
          closeOnClickOutside={false}
          closeButtonProps={{ "aria-label": "Close match actions" }}
          styles={{
            content: { background: "#101b24", color: "#edf0e7" },
            header: { background: "#101b24", color: "#edf0e7" },
          }}
        >
          {openingScene && (
            <div className={styles.openingSettings}>
              <label>
                <input
                  type="checkbox"
                  checked={sound}
                  onChange={(event) => setSound(event.currentTarget.checked)}
                />{" "}
                Sound
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  disabled={prefersReducedMotion}
                  onChange={(event) => setReduceMotion(event.currentTarget.checked)}
                />{" "}
                Reduced motion
              </label>
            </div>
          )}
          {controls}
        </Drawer>
        {!inspect && !library && !drawer && (
          <SharedInteractionPrompt
            surface={promptSurface}
            view={view}
            viewerId={viewerSeat}
            cards={promptCards}
            source={
              promptSurface.action?.source
                ? promptCards.get(promptSurface.action.source.instanceId)
                : undefined
            }
            onInspect={(card) => {
              const visible = board.cards.find(
                (entry) => entry.instanceId === card.id && entry.definitionId && !entry.faceDown,
              );
              if (visible) {
                promptSurface.minimize();
                setInspect(visible);
              }
            }}
          />
        )}
        {inspect && (
          <CardInspectionControls
            label={inspect.name ?? "Card inspection"}
            onClose={inspection.dismiss}
          >
            {inspectActions.map((action) => (
              <button
                key={action.id}
                className={styles.assetButton}
                disabled={!enabled}
                onClick={() => {
                  setInspect(null);
                  activate(action);
                }}
              >
                {resolveInteractionText(action.text)}
              </button>
            ))}
          </CardInspectionControls>
        )}
        <TargetModal
          opened={library && !portrait}
          onClose={() => setLibrary(false)}
          title={
            libraryZone
              ? `${libraryZone.seat === viewerSeat ? "Your" : "Opponent’s"} ${libraryZone.name.toLowerCase()}`
              : "Cards & targets"
          }
          mode={draft.active && selectableInstanceIds !== null ? "select" : "inspect"}
          cards={visibleLibraryCards.map((card) => ({
            id: card.instanceId,
            label: card.faceDown || !card.definitionId ? "Face-down card" : (card.name ?? "Card"),
            imageUrl: cardArtwork(card) ?? arenaAssets.back,
            detail: `${card.controller === viewerSeat ? "You" : "Opponent"} · ${card.zone}`,
            card,
          }))}
          filter={
            draft.active && selectableInstanceIds !== null
              ? (target) => selectableInstanceIds.has(target.id)
              : undefined
          }
          selectedIds={selectedInstanceIds}
          emptyMessage={
            libraryZone?.zone === "deck"
              ? "Deck order and card identities are hidden."
              : draft.active
                ? "No legal targets in this zone."
                : "This zone is empty."
          }
          description={
            draft.active ? "Choose from the legal targets for your current action." : undefined
          }
          onCard={(target) => {
            chooseCard(target.card);
            if (!draft.active) setLibrary(false);
          }}
        />
      </section>
    </PointerDragDropSurface>
  );
}
