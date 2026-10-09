import { selectionVariables } from "@tcg/simulator-presentation/selection";
import { useFlatBoardLayout } from "./useFlatBoardLayout";
import { MatchUtilitiesContext } from "./MatchUtilitiesContext";
import { useDragDrop } from "../GameBoard/DragDropContext";
import { INITIAL_ANCHORS, anchorCard, anchoredRect, type BoardProjection } from "./viewport";
import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  AnimatedEntityNode,
  CardPresentationPlane,
  useAnimationNode,
  useAnimatedEntityIds,
  useOptionalAnimationRuntime,
} from "@tcg/simulator-ui";
import { RivalDropTarget, SellDropArea } from "./DropAreas";
import dropAreaClasses from "./DropAreas.module.css";
import { Button, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { SimulatorRendererProps } from "@tcg/simulator-contract";
import {
  interactionViewActionHasCandidate,
  otherSide,
  PLAYER_SIDE_TO_ID,
  useEngine,
  useSideZones,
  type Side,
  type SideZoneViews,
} from "../../engine";
import { cyberpunkZoneAnchorId } from "../../engine/projectSimulator";
import { CyberpunkZoneAnchor } from "../../animation/CyberpunkZoneAnchor";
import { PlayerNameplate } from "./PlayerNameplate";
import {
  AttackSelectionProvider,
  CenterRow,
  ClockDisplay,
  CombatArrowOverlay,
  ConfirmDialog,
  DragDropProvider,
  GameStateProvider,
  MoveSelectionProvider,
  PassTurnControl,
  useGameState,
} from "../GameBoard";
import { Card, type CardInteractionAppearance } from "../GameBoard/Card";
import { useTemporaryRevealedHandCardIds } from "../GameBoard/temporaryHandReveals";
import { DeckZone } from "../GameBoard/DeckZone";
import { TrashZone } from "../GameBoard/TrashZone";
import { EddiesZone } from "../GameBoard/EddiesZone";
import { usePaymentSelectionOptional } from "../PaymentSelection/PaymentSelectionContext";
import { CardImage } from "../GameBoard/CardImage";
import { FixerZone } from "../GameBoard/FixerZone";
import { OpponentDisconnectOverlay } from "../GameBoard/OpponentDisconnectOverlay";
import { useDeckRevealForSide } from "../GameBoard/deckReveal";
import { useGameClock } from "../GameBoard/useGameClock";
import { usePeekedLegendsForSide } from "../GameBoard/peekedLegends";
import { rivalTimeoutExpired } from "../GameBoard/rivalTimeout";
import { useZoneDroppable } from "../GameBoard/useZoneDroppable";
import { BoardCorrectionStrip, boardCorrectionMenuAction } from "../GameBoard/BoardCorrectionStrip";
import { BoardContextMenu, type BoardContextMenuAction } from "../GameBoard/BoardContextMenu";
import { CyberpunkCardContextController } from "../CardContext/CyberpunkCardContextController";
import { CyberpunkInteractionPanel } from "../CyberpunkInteractionPanel";
import { useUnitEntryPromptPending } from "../../animation/useUnitEntryPromptPending";
import { cyberpunkEntityHandoffAtMs } from "../../animation/three-card-transfer-plan";
import { useHasHover } from "../../../../lib/media-query";
import { DebugPanelProvider } from "../DebugPanel";
import { useCyberpunkBoardRuntime } from "../BoardRuntimeContext";
import { DropDispatchBridge, SelectionReset } from "../GameBoard/BoardInputController";
import {
  HAND_HOVER_LIFT,
  TABLE_WIDTH,
  boundedPage,
  fieldRowScales,
  firstPages,
  PAGE_SIZE,
  placeSeat,
  rivalTopInset,
  tableSize,
  fixerRect,
  handZoneRect,
  identityRect,
  pilesRect,
  type Pages,
  type PlacedCard,
  type Rect,
  type WorldCard,
} from "./layout";
import classes from "./board.module.css";
import { soldCardReceipts, type SoldCardReceipt } from "./soldCards";
import promptHousing from "./PromptHousing.module.css";
import { PromptSkinContext } from "../Prompt/PromptSkin";
import { ImageOff, Unplug } from "lucide-react";
import { ReturnToV1 } from "./version";
import { BoardAlert, BoardAlertStack } from "./BoardAlert";
import boardAlertStyles from "./BoardAlert.module.css";
import { RotateGuidance } from "./RotateGuidance";
import { actionRect, clockRect } from "./layout";
import actionNormalUrl from "./assets/action-normal-v2.webp";
import actionHoverUrl from "./assets/action-hover-v2.webp";
import actionDisabledUrl from "./assets/action-disabled-v2.webp";
import actionConfirmUrl from "./assets/action-confirm-v2.webp";
import {
  boardSurfaceTextureUrl,
  resolveBoardSurface,
  useBoardSurfaceId,
  type BoardSurface,
} from "./boardSurface";
const Scene = lazy(() => import("./Scene"));

export default function CyberpunkBoardV2(props: SimulatorRendererProps) {
  const surface = resolveBoardSurface(useBoardSurfaceId());
  return (
    <PromptSkinContext.Provider value="v2">
      <DebugPanelProvider>
        {[actionNormalUrl, actionHoverUrl, actionDisabledUrl, actionConfirmUrl].map((url) => (
          <link key={url} rel="preload" as="image" href={url} />
        ))}
        {surface.src && (
          <link
            key={surface.src}
            rel="preload"
            as="image"
            href={surface.src}
            crossOrigin="anonymous"
          />
        )}
        <GameStateProvider>
          <AttackSelectionProvider>
            <MoveSelectionProvider>
              <DragDropProvider presentation="scene">
                <CyberpunkCardContextController fixture={props.fixture}>
                  <DropDispatchBridge />
                  <Board {...props} surface={surface} />
                </CyberpunkCardContextController>
              </DragDropProvider>
            </MoveSelectionProvider>
          </AttackSelectionProvider>
        </GameStateProvider>
      </DebugPanelProvider>
    </PromptSkinContext.Provider>
  );
}
function at([x, y, width, height]: Rect): CSSProperties {
  const table = tableSize();
  return {
    left: `${(x / table.width) * 100}%`,
    top: `${(y / table.height) * 100}%`,
    width: `${(width / table.width) * 100}%`,
    height: `${(height / table.height) * 100}%`,
  };
}
function FieldDrop({ rival, compact }: { rival: boolean; compact: boolean }) {
  const engine = useEngine();
  const { activeSource } = useDragDrop();
  const zone = `${rival ? "opp" : "p"}-field`;
  const drop = useZoneDroppable(zone);
  // A field drag marks an attack. The zone itself is never the target —
  // challenges land on rival units — so the surface stays quiet and a hint
  // names the real targets instead of lighting the whole half up.
  const attackIntent = drop.dropReady === "attack";
  const ready = attackIntent
    ? undefined
    : drop.dropReady === "play"
      ? activeSource?.cardId &&
        interactionViewActionHasCandidate(
          engine.interactionViews[engine.humanSide],
          "playCard",
          "cardId",
          activeSource.cardId,
        )
        ? "play"
        : undefined
      : drop.dropReady;
  const animationRef = useAnimationNode(
    {
      kind: "zone",
      id: zone,
      ownerId: String(PLAYER_SIDE_TO_ID[rival ? otherSide(engine.humanSide) : engine.humanSide]),
    },
    { zoneId: zone, density: "normal", presence: "present" },
  );
  const bindRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop.setNodeRef(node);
      animationRef(node);
    },
    [drop.setNodeRef, animationRef],
  );
  return (
    <div
      ref={bindRef}
      className={`${classes.fieldDrop} ${dropAreaClasses.field}`}
      data-over={attackIntent ? false : drop.isOver}
      data-attack-hint={attackIntent || undefined}
      data-sim-zone-id={zone}
      data-zone-id={zone}
      data-drop-ready={ready}
      style={at(
        // Compact drop bands follow the pulled-in field rows (layout.ts).
        rival
          ? compact
            ? [290, 95, 1020, 315]
            : [290, 60, 1020, 330]
          : compact
            ? [0, 412, 1600, 330]
            : [0, 375, 1600, 400],
      )}
    >
      <span>
        {attackIntent
          ? "CHALLENGE A UNIT"
          : ready === "play"
            ? "DROP TO PLAY"
            : drop.dropReady === "goSolo"
              ? "DROP TO GO SOLO"
              : rival
                ? "RIVAL FIELD"
                : "YOUR FIELD"}
      </span>
    </div>
  );
}
function Board({
  fixture,
  onSubmitInteraction,
  surface,
}: SimulatorRendererProps & { surface: BoardSurface }) {
  const surfaceSrc = boardSurfaceTextureUrl(surface);
  const surfaceStyle = surface.src
    ? ({ ["--v2-surface-image" as string]: `url("${surface.src}")` } as CSSProperties)
    : undefined;
  const matchUtilities = useContext(MatchUtilitiesContext);
  const engine = useEngine();
  const animation = useOptionalAnimationRuntime();
  const { humanSide, prioritySide, activeSide, hasPendingRemoteMove } = engine;
  const {
    canUndo,
    canUndoToTurnStart,
    dispatch,
    pendingRemoteActionId,
    boardCorrectionEnabled,
    boardCorrectionProposalPending,
    boardCorrectionNeedsConsent,
    canRequestBoardCorrection,
    requestBoardCorrection,
    exitBoardCorrection,
  } = engine;
  const rivalSide = otherSide(humanSide);
  const local = useSideZones(humanSide),
    rival = useSideZones(rivalSide);
  const rivalRevealedHandCardIds = useTemporaryRevealedHandCardIds(
    rivalSide,
    rival.hand.map((card) => card.cardId),
  );
  const runtime = useCyberpunkBoardRuntime();
  const clock = useGameClock();
  const { phase, gameEnded, advancePhase } = useGameState();
  const isActive = activeSide === humanSide;
  const canConcede = !runtime.liveMatchSidebar || Boolean(runtime.liveMatchSidebar.localPlayerId);
  const localDeckReveal = useDeckRevealForSide(humanSide);
  const rivalDeckReveal = useDeckRevealForSide(rivalSide);
  const turnNumber = engine.matchState.G.turnMetadata.turnNumber;
  const localPeekedLegends = usePeekedLegendsForSide(engine.moveLogs, humanSide, turnNumber);
  const rivalPeekedLegends = usePeekedLegendsForSide(engine.moveLogs, rivalSide, turnNumber);
  const isRivalTimeoutExpired = rivalTimeoutExpired({
    humanSide,
    rivalSide,
    playerConnections: runtime.playerConnections,
    onClaimRivalDrop: runtime.onClaimRivalDrop,
    gameEnded: engine.matchState.G.gameEnded,
    rivalSeconds: clock[rivalSide].seconds,
  });
  const ref = useRef<HTMLDivElement>(null);
  const flatLayout = useFlatBoardLayout(ref);
  const compact = flatLayout.compact;
  // Touch boards get the dense prompt presentation: collapsed card text,
  // bottom-sheet choices, and 44px controls sized for thumbs. The media-query
  // hook runs unconditionally — `compact` flips once the real viewport is
  // measured, and a short-circuited hook would change the hook count.
  const hasHover = useHasHover();
  const touchSurface = compact && !hasHover;
  const mobileInteractionSurface = touchSurface ? "mobile" : "desktop";
  // Phones render the table under half scale, so the fixed-pixel utility
  // plates shrink with it (hit targets included) instead of dwarfing the
  // instruments. The rival column inset tracks the same zoom.
  const utilitiesZoom = Math.max(0.72, Math.min(1, flatLayout.scale * 1.6));
  const utilitiesInset = rivalTopInset(flatLayout.scale, utilitiesZoom);
  const reduced = Boolean(useMediaQuery("(prefers-reduced-motion: reduce)"));
  const [localPages, setLocalPages] = useState<Pages>(firstPages);
  const [rivalPages, setRivalPages] = useState<Pages>(firstPages);
  const { motion } = useDragDrop();
  const [cardAppearances, setCardAppearances] = useState<
    Readonly<Record<string, CardInteractionAppearance>>
  >({});
  const reportCardAppearance = useCallback((id: string, appearance: CardInteractionAppearance) => {
    setCardAppearances((current) =>
      current[id] === appearance ? current : { ...current, [id]: appearance },
    );
  }, []);
  const [hovered, setHovered] = useState<string | null>(null);
  const [textures, setTextures] = useState<ReadonlySet<string>>(new Set());
  const [projection, setProjection] = useState<BoardProjection>();
  // Legend zone anchors ride the real CSS-positioned racks so flights to or
  // from an unmounted legend slot land where legend cards actually sit.
  const rivalLegendAnchor = useAnimationNode(
    { kind: "zone", id: "opp-legendArea", ownerId: String(PLAYER_SIDE_TO_ID[rivalSide]) },
    { zoneId: "opp-legendArea", presence: "present" },
  );
  const localLegendAnchor = useAnimationNode(
    { kind: "zone", id: "p-legendArea", ownerId: String(PLAYER_SIDE_TO_ID[humanSide]) },
    { zoneId: "p-legendArea", presence: "present" },
  );
  const updateProjection = useCallback((next: BoardProjection) => {
    setProjection((current) =>
      current?.transform === next.transform && current.hudScale === next.hudScale ? current : next,
    );
  }, []);
  const [artworkFailed, setArtworkFailed] = useState(false);
  const artworkError = useCallback(() => setArtworkFailed(true), []);
  const [lostContext, setLostContext] = useState(false);
  const [trashSide, setTrashSide] = useState<Side | null>(null);
  const [resources, setResources] = useState<Side | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [confirmingConcede, setConfirmingConcede] = useState(false);
  // Portal target for the resolving-program display: a screen-aligned plane
  // above the projected field so the card floats flat with elevation.
  const [resolvingCardHost, setResolvingCardHost] = useState<HTMLDivElement | null>(null);
  const textureReady = useCallback(
    (url: string) => setTextures((old) => (old.has(url) ? old : new Set([...old, url]))),
    [],
  );
  const contextLost = useCallback(() => setLostContext(true), []);
  const handleContextMenu = useCallback((ev: ReactMouseEvent<HTMLDivElement>) => {
    // Skip if right-clicking on an interactive child that handles its own menu
    // (cards, buttons, links, open dialogs). Only fire on empty board space.
    const target = ev.target as HTMLElement;
    if (
      target.closest(
        "button, a, [data-sim-entity-id], [role='menu'], [role='menuitem'], [role='dialog']",
      )
    ) {
      return;
    }
    ev.preventDefault();
    setContextMenu({ x: ev.clientX, y: ev.clientY });
  }, []);
  const contextMenuActions = useMemo<BoardContextMenuAction[]>(() => {
    return [
      boardCorrectionMenuAction({
        boardCorrectionEnabled,
        boardCorrectionProposalPending,
        boardCorrectionNeedsConsent,
        canRequestBoardCorrection,
        requestBoardCorrection,
        exitBoardCorrection,
      }),
      {
        id: "pass-phase",
        label: isActive ? `Pass ${phase} phase` : "Pass phase",
        disabled: !isActive || gameEnded,
        run: () => advancePhase(),
      },
      {
        id: "undo",
        label: "Undo last move",
        disabled: !canUndo,
        run: () => dispatch({ type: "undo" }),
      },
      {
        id: "undo-turn-start",
        label: "Undo to turn start",
        disabled: !canUndoToTurnStart,
        run: () => dispatch({ type: "undoToTurnStart" }),
      },
      ...(canConcede
        ? [
            {
              id: "concede",
              label: pendingRemoteActionId === "concede" ? "Conceding…" : "Concede…",
              disabled: gameEnded || pendingRemoteActionId === "concede",
              run: () => setConfirmingConcede(true),
            },
          ]
        : []),
      {
        id: "shortcuts",
        label: "Show keyboard shortcuts",
        run: () => {
          // Lightweight placeholder until a proper modal lands.
          alert(
            "Keyboard shortcuts:\n\n" +
              "Right-click empty board — open this menu\n" +
              "Space — advance the phase button\n" +
              "Esc — close menus / cancel selection\n" +
              "Click card — open card actions",
          );
        },
      },
    ];
  }, [
    isActive,
    phase,
    gameEnded,
    advancePhase,
    canUndo,
    canUndoToTurnStart,
    canConcede,
    pendingRemoteActionId,
    dispatch,
    boardCorrectionEnabled,
    boardCorrectionProposalPending,
    boardCorrectionNeedsConsent,
    canRequestBoardCorrection,
    requestBoardCorrection,
    exitBoardCorrection,
  ]);
  const anchors = projection?.anchors ?? INITIAL_ANCHORS;
  // One scale per seat: a row only reacts to its own gear fan, never to the
  // other seat's stacks.
  const [rivalFieldScale, localFieldScale] = fieldRowScales([rival.field, local.field], compact);
  const cards = [
    ...placeSeat(
      rival,
      rivalSide,
      true,
      rivalPages,
      rivalRevealedHandCardIds,
      rivalPeekedLegends,
      compact,
      rivalFieldScale,
    ),
    ...placeSeat(
      local,
      humanSide,
      false,
      localPages,
      undefined,
      localPeekedLegends,
      compact,
      localFieldScale,
    ),
  ].map((card) => anchorCard(card, card.lane === "field" ? anchors : flatLayout.anchors));
  const worldCards = cards.filter((card): card is WorldCard => card.lane === "field");
  // Each player has a side rail clear of both field rows. Project
  // their gap into screen space so the focus follows the same camera on resize.
  const resolutionFocusStyle = useMemo(() => {
    let top = "50%";
    const rivalRow = worldCards.filter((card) => card.rival);
    const localRow = worldCards.filter((card) => !card.rival);
    if (
      projection &&
      rivalRow.length &&
      localRow.length &&
      typeof DOMMatrixReadOnly !== "undefined"
    ) {
      const gapY =
        (Math.max(...rivalRow.map((card) => card.rect[1] + card.rect[3])) +
          Math.min(...localRow.map((card) => card.rect[1]))) /
        2;
      const point = new DOMMatrixReadOnly(projection.transform).transformPoint({
        x: TABLE_WIDTH / 2,
        y: gapY,
      });
      // The shared stage lifts by 18px; keep its final center on the projected gap.
      top = `${point.y / point.w + 18}px`;
    }
    return {
      "--resolution-card-left-rail": `${140 * flatLayout.scale}px`,
      "--resolution-card-right-rail": `calc(100% - ${140 * flatLayout.scale}px)`,
      "--resolution-card-top": top,
      "--resolution-card-width": `${Math.min(210, 200 * flatLayout.scale)}px`,
    } as CSSProperties;
  }, [worldCards, projection, flatLayout.scale]);
  const handCards = cards.filter((card) => card.lane === "hand");
  const legendCards = cards.filter((card) => card.lane === "legendArea");
  const unitEntryPending = useUnitEntryPromptPending(animation);
  const movingIds = useAnimatedEntityIds(animation, cyberpunkEntityHandoffAtMs);
  const trash = trashSide === humanSide ? local : rival;
  const resourceZones = resources === humanSide ? local : rival;
  const version = fixture.table.status.stateVersion;
  return (
    <div
      className={classes.root}
      style={{ ...selectionVariables, ...surfaceStyle }}
      data-testid="cyberpunk-board-v2"
      data-ui-version="v2"
      data-compact={compact ? "true" : undefined}
      onContextMenu={handleContextMenu}
    >
      <SelectionReset side={humanSide} />
      <SellDropArea />
      <svg className={classes.powerFrameFilter} aria-hidden="true" focusable="false">
        <defs>
          <filter id="cyberpunk-v2-power-frame" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncA type="linear" slope="1.65" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div className={classes.utilitiesSlot}>
        {/* The zoom wrapper sits inside the slot so the slot's safe-area
            offsets stay unscaled while the plates themselves shrink. */}
        <div className={classes.utilitiesStack} style={{ zoom: utilitiesZoom }}>
          {matchUtilities}
          <span className={classes.connection} role="status">
            {hasPendingRemoteMove ? "Sending action…" : ""}
          </span>
        </div>
      </div>
      <BoardAlertStack>
        {artworkFailed && (
          <BoardAlert
            id="artwork"
            key="artwork"
            severity="warning"
            role="status"
            icon={<ImageOff size={16} />}
            message="Some 3D artwork could not load. Card controls stay available."
            action={<ReturnToV1 className={boardAlertStyles.action} />}
          />
        )}
        {lostContext && (
          <BoardAlert
            id="context"
            key="context"
            severity="error"
            role="alert"
            icon={<Unplug size={16} />}
            message="The 3D board lost its connection."
            action={<ReturnToV1 className={boardAlertStyles.action} />}
          />
        )}
      </BoardAlertStack>
      <RotateGuidance />
      <div className={classes.scroll}>
        <div
          className={classes.table}
          ref={ref}
          data-sim-board
          data-testid="board-wrap"
          data-human-side={humanSide}
        >
          <div className={classes.scene} aria-hidden="true">
            <Suspense fallback={null}>
              {!lostContext && (
                <Scene
                  motion={motion}
                  cards={worldCards}
                  movingIds={movingIds}
                  cardAppearances={cardAppearances}
                  hovered={hovered}
                  reduced={reduced}
                  onReady={textureReady}
                  onContextLost={contextLost}
                  onArtworkError={artworkError}
                  onProjection={updateProjection}
                  surfaceSrc={surfaceSrc}
                />
              )}
            </Suspense>
          </div>
          <div
            className={classes.projected + (projection ? "" : ` ${classes.projectedFallback}`)}
            data-testid="v2-field-layer"
            style={
              {
                transform: projection?.transform,
                "--hud-scale": projection?.hudScale ?? 1,
                "--edge-x": `${anchors.x}px`,
                "--edge-top": `${anchors.top}px`,
                "--edge-bottom": `${anchors.bottom}px`,
                "--field-shift": `${anchors.field}px`,
              } as CSSProperties
            }
          >
            <FieldDrop rival compact={compact} />
            <FieldDrop rival={false} compact={compact} />
            {worldCards.map((p) => (
              <CardHit
                key={p.card.cardId}
                placed={p}
                ready={
                  !lostContext &&
                  // The cached artwork may belong to another copy. A mesh
                  // excluded during playback cannot replace this DOM image.
                  !movingIds.has(p.card.cardId) &&
                  textures.has(p.url) &&
                  (p.lane !== "field" ||
                    p.card.attachedGear.every((gear) => textures.has(gear.imageUrl)))
                }
                hovered={hovered === p.card.cardId}
                onInteractionAppearanceChange={reportCardAppearance}
                onHover={setHovered}
              />
            ))}
          </div>
          <div
            className={classes.flatOverlay}
            data-testid="v2-overlay-layer"
            style={flatLayout.style}
          >
            {handCards.map((p) => (
              <CardHit
                key={p.card.cardId}
                placed={p}
                ready={false}
                hovered={hovered === p.card.cardId}
                onInteractionAppearanceChange={reportCardAppearance}
                onHover={setHovered}
              />
            ))}
            <CyberpunkZoneAnchor
              zoneId="opp-hand"
              ownerId={String(PLAYER_SIDE_TO_ID[rivalSide])}
              style={{
                ...at(handZoneRect(true)),
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <CyberpunkZoneAnchor
              zoneId="p-hand"
              ownerId={String(PLAYER_SIDE_TO_ID[humanSide])}
              style={{
                ...at(handZoneRect(false)),
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <CyberpunkZoneAnchor
              zoneId="opp-fixer"
              ownerId={String(PLAYER_SIDE_TO_ID[rivalSide])}
              style={{
                ...at(fixerRect(true, compact, utilitiesInset)),
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <CyberpunkZoneAnchor
              zoneId="p-fixer"
              ownerId={String(PLAYER_SIDE_TO_ID[humanSide])}
              style={{
                ...at(fixerRect(false)),
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <CyberpunkZoneAnchor
              zoneId="opp-removedFromGame"
              ownerId={String(PLAYER_SIDE_TO_ID[rivalSide])}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 72,
                height: 100,
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <CyberpunkZoneAnchor
              zoneId="p-removedFromGame"
              ownerId={String(PLAYER_SIDE_TO_ID[humanSide])}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 72,
                height: 100,
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <div
              className={`${classes.identity} ${classes.rivalIdentity}`}
              style={at(identityRect(true, compact, utilitiesInset))}
              data-active={prioritySide === rivalSide}
            >
              <RivalDropTarget>
                <PlayerNameplate
                  identity={runtime.playerIdentities?.[rivalSide]}
                  connection={runtime.playerConnections?.[rivalSide]}
                  playerId={String(PLAYER_SIDE_TO_ID[rivalSide])}
                  rival={true}
                  turn={activeSide === rivalSide}
                  priority={prioritySide === rivalSide}
                />
              </RivalDropTarget>
            </div>
            <div
              className={`${classes.identity} ${classes.localIdentity}`}
              style={at(identityRect(false, compact))}
              data-active={prioritySide === humanSide}
            >
              <PlayerNameplate
                identity={runtime.playerIdentities?.[humanSide]}
                connection={runtime.playerConnections?.[humanSide]}
                playerId={String(PLAYER_SIDE_TO_ID[humanSide])}
                rival={false}
                turn={activeSide === humanSide}
                priority={prioritySide === humanSide}
              />
            </div>
            <div
              className={classes.rivalFixer}
              style={at(
                anchoredRect(fixerRect(true, compact, utilitiesInset), 1, -1, flatLayout.anchors),
              )}
            >
              <FixerZone side={rivalSide} dice={rival.fixerArea} />
            </div>
            <div
              className={classes.localFixer}
              style={at(anchoredRect(fixerRect(false, compact), -1, 1, flatLayout.anchors))}
            >
              <FixerZone side={humanSide} dice={local.fixerArea} />
            </div>
            <div className={classes.gigs}>
              <CenterRow
                gigsOnly
                spaciousGigs
                effectDetails
                resolvingCardHost={resolvingCardHost}
              />
            </div>
            <SeatStatus
              rival
              side={rivalSide}
              zones={rival}
              sales={soldCardReceipts(
                engine.moveLogs,
                new Set(rival.eddieCards.map((card) => card.cardId)),
                rivalSide,
                turnNumber,
              )}
              movingIds={movingIds}
              onResources={() => setResources(rivalSide)}
            />
            <SeatStatus
              rival={false}
              side={humanSide}
              zones={local}
              sales={soldCardReceipts(
                engine.moveLogs,
                new Set(local.eddieCards.map((card) => card.cardId)),
                humanSide,
                turnNumber,
              )}
              movingIds={movingIds}
              onResources={() => setResources(humanSide)}
            />
            {[
              { side: rivalSide, zones: rival, isRival: true },
              { side: humanSide, zones: local, isRival: false },
            ].map(({ side, zones, isRival }) => (
              <div
                key={side}
                className={isRival ? classes.rivalPiles : classes.localPiles}
                style={at(
                  anchoredRect(
                    pilesRect(isRival, compact, utilitiesInset),
                    isRival ? 1 : -1,
                    isRival ? -1 : 1,
                    flatLayout.anchors,
                  ),
                )}
              >
                <DeckZone
                  side={side}
                  opponent={isRival}
                  count={zones.deckCount}
                  reveal={isRival ? rivalDeckReveal : localDeckReveal}
                />
                <TrashZone
                  side={side}
                  opponent={isRival}
                  count={zones.trashCount}
                  topCard={zones.trashTop ?? undefined}
                  cards={zones.trash}
                  movingIds={movingIds}
                  onOpen={() => setTrashSide(side)}
                />
              </div>
            ))}
            <div
              className={classes.clock}
              style={at(anchoredRect(clockRect(compact), -1, 0, flatLayout.anchors))}
            >
              <ClockDisplay compact combatSteps overtimeBand />
            </div>
            <div className={classes.localPages}>
              <PagesControl zones={local} pages={localPages} setPages={setLocalPages} />
            </div>
            <div className={classes.rivalPages}>
              <PagesControl zones={rival} pages={rivalPages} setPages={setRivalPages} />
            </div>
            <div className={classes.flatLegends}>
              <div
                ref={rivalLegendAnchor}
                className={`${classes.legendRack} ${classes.rivalLegendRack}`}
                data-v2-legend-rack="rival"
              >
                {legendCards
                  .filter((p) => p.rival)
                  .map((p) => (
                    <CardHit
                      key={p.card.cardId}
                      placed={p}
                      ready={false}
                      hovered={hovered === p.card.cardId}
                      onHover={setHovered}
                    />
                  ))}
              </div>
              <div
                ref={localLegendAnchor}
                className={`${classes.legendRack} ${classes.localLegendRack}`}
                data-v2-legend-rack="local"
              >
                {legendCards
                  .filter((p) => !p.rival)
                  .map((p) => (
                    <CardHit
                      key={p.card.cardId}
                      placed={p}
                      ready={false}
                      hovered={hovered === p.card.cardId}
                      onHover={setHovered}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div
            className={`${classes.flatOverlay} ${classes.actionLayer}`}
            style={flatLayout.style}
            data-testid="v2-action-layer"
          >
            <div
              className={classes.pass}
              style={at(anchoredRect(actionRect(compact), 1, 1, flatLayout.anchors))}
            >
              {!unitEntryPending && <PassTurnControl docked actionsOnly />}
            </div>
          </div>
          {/* A screen-aligned plane above the projected field: the resolving
              program floats flat over the table with a sense of elevation
              instead of lying on the field's perspective plane. */}
          <CardPresentationPlane
            portal
            ref={setResolvingCardHost}
            data-testid="v2-resolving-plane"
            style={resolutionFocusStyle}
          />
          <div className={`${classes.prompts} ${promptHousing.surface}`}>
            {!unitEntryPending && (
              <CyberpunkInteractionPanel
                fixture={fixture}
                onSubmitInteraction={onSubmitInteraction}
                surface={mobileInteractionSurface}
              />
            )}
          </div>
          <CombatArrowOverlay
            dataStream
            containerRef={ref}
            directAttackTarget="gigs"
            layoutTransform={projection?.transform}
          />
          <div className={classes.actionPulse} key={version} aria-hidden="true" />
          <OpponentDisconnectOverlay
            variant="opponent"
            connection={runtime.playerConnections?.[rivalSide]}
            onClaimDrop={runtime.onClaimRivalDrop}
            claimAvailable={Boolean(runtime.onClaimRivalDrop)}
            timeoutExpired={isRivalTimeoutExpired}
            dropEligibility={runtime.dropEligibility}
          />
        </div>
      </div>
      <div className={classes.corrections}>
        <BoardCorrectionStrip />
      </div>
      {contextMenu ? (
        <BoardContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          actions={contextMenuActions}
          onClose={() => setContextMenu(null)}
        />
      ) : null}
      {canConcede ? (
        <ConfirmDialog
          opened={confirmingConcede && !gameEnded}
          title="Concede match?"
          body="This concedes the match and cannot be undone."
          cancelLabel="Keep playing"
          confirmLabel="Concede"
          onCancel={() => setConfirmingConcede(false)}
          onConfirm={() => {
            setConfirmingConcede(false);
            dispatch({ type: "concede", as: PLAYER_SIDE_TO_ID[humanSide] });
          }}
        />
      ) : null}
      <Modal
        opened={trashSide !== null}
        onClose={() => setTrashSide(null)}
        title={trashSide === humanSide ? "Your Trash" : "Rival Trash"}
        classNames={{ content: classes.modal, header: classes.modalHeader }}
        size="lg"
      >
        <div className={classes.trashCards}>
          {trash.trash.length === 0 ? (
            <p>Trash is empty.</p>
          ) : (
            trash.trash.map((card, index) => (
              <div key={card.cardId}>
                <Card
                  {...card}
                  side={trashSide ?? humanSide}
                  zone={trashSide === humanSide ? "p-trash" : "opp-trash"}
                  index={index}
                  tapped={card.spent}
                  gear={card.attachedGear}
                />
              </div>
            ))
          )}
        </div>
      </Modal>
      <Modal
        opened={resources !== null}
        onClose={() => setResources(null)}
        title={resources === humanSide ? "Your Eddies" : "Rival Eddies"}
        classNames={{ content: classes.modal, header: classes.modalHeader }}
        size="lg"
      >
        <EddiesZone
          side={resources ?? humanSide}
          opponent={resources !== humanSide}
          cards={resourceZones.eddieCards.map((card) => ({
            cardId: card.cardId,
            definitionId: card.definitionId,
            spent: card.spent,
            revealed: card.revealed,
            imageUrl: card.imageUrl,
            name: card.name,
          }))}
          count={resourceZones.eddies}
          cardCount={resourceTotals(resourceZones).cards}
          spentCardCount={resourceZones.spentEddies}
          availableCount={resourceTotals(resourceZones).ready}
          totalCount={resourceTotals(resourceZones).total}
          soldThisTurn={resourceZones.soldThisTurn}
        />
      </Modal>
    </div>
  );
}
export function CardHit({
  placed: p,
  ready,
  hovered,
  onInteractionAppearanceChange,
  onHover,
}: {
  placed: PlacedCard;
  ready: boolean;
  hovered: boolean;
  onInteractionAppearanceChange?: (id: string, appearance: CardInteractionAppearance) => void;
  onHover: (id: string | null) => void;
}) {
  const { motion } = useDragDrop();
  // createDragMotion's methods are closures that never touch `this` (and the
  // drag context's own consumers pass them unbound) — .bind() here handed
  // useSyncExternalStore a fresh subscribe identity on every CardHit render,
  // unsubscribing and resubscribing per card during drag frames.
  const drag = useSyncExternalStore(
    motion?.subscribe ?? subscribeNoDrag,
    motion?.getSnapshot ?? noDrag,
  );
  const ownsVisual = drag?.source.cardId === p.card.cardId;
  const handLift =
    hovered && p.lane === "hand" && !p.rival ? (-HAND_HOVER_LIFT / p.rect[3]) * 100 : 0;
  return (
    <AnimatedEntityNode
      entityId={p.card.cardId}
      zoneRef={{ kind: "zone", id: p.zone }}
      density="normal"
      // Rack slots never reflow; Motion's layout projection inside the scaled
      // flat overlay mis-measures there and leaves cards tilted/oversized.
      disableLayoutAnimation={p.lane === "legendArea"}
      className={`${classes.cardHit} ${p.lane === "legendArea" ? classes.legendHit : ""}`}
      data-mesh-ready={ready}
      data-zone-lane={p.lane}
      data-sim-animation-rotation-deg={p.lane === "hand" ? p.angle : undefined}
      data-spent={p.card.spent ? "true" : undefined}
      data-rival={p.rival}
      // Overlapped field rows show each Unit's right strip, so edge badges
      // (ability rail) move out of the covered left corner.
      data-rail-side={p.overlapped ? "right" : undefined}
      data-testid={p.lane === "hand" ? "hand-card" : undefined}
      style={{
        ...(p.lane === "legendArea" ? {} : at(p.rect)),
        opacity: ownsVisual ? 0 : undefined,
        transform: `translateY(${handLift}%) rotate(${p.angle}deg)`,
        // Field rows overlap leftmost-on-top (matching the mesh depth), so a
        // Unit's exposed strip is its right edge and the power badge stays
        // clickable. Hovering lifts any lane above its neighbours.
        zIndex: hovered
          ? 35
          : p.lane === "hand"
            ? 20 + p.stackIndex
            : p.lane === "field"
              ? 30 - Math.min(p.stackIndex, 25)
              : 10,
      }}
      onPointerEnter={() => onHover(p.card.cardId)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(p.card.cardId)}
      onBlur={() => onHover(null)}
    >
      <Card
        {...p.card}
        name={p.hidden ? "Hidden card" : p.card.name}
        imageUrl={p.hidden ? undefined : p.card.imageUrl}
        faceDown={p.card.faceDown || p.hidden}
        peeked={p.peeked}
        side={p.side}
        zone={p.zone}
        index={p.zoneIndex}
        cardId={p.card.cardId}
        tapped={p.card.spent}
        rotateWhenTapped={p.lane !== "field"}
        gear={p.hidden ? [] : p.card.attachedGear}
        acceptsDrop={p.lane !== "hand"}
        onInteractionAppearanceChange={onInteractionAppearanceChange}
      />
    </AnimatedEntityNode>
  );
}
function resourceTotals(zones: SideZoneViews) {
  const cards = Math.max(zones.eddieCardCount, zones.eddies + zones.spentEddies);
  return {
    cards,
    ready: zones.eddies + zones.legendArea.filter((card) => !card.spent).length,
    total: cards + zones.legendArea.length,
  };
}
export function SeatStatus({
  rival,
  side,
  zones,
  sales,
  movingIds,
  onResources,
}: {
  rival: boolean;
  side: Side;
  zones: SideZoneViews;
  sales: ReadonlyArray<SoldCardReceipt>;
  movingIds: ReadonlySet<string>;
  onResources: () => void;
}) {
  const { ready, total } = resourceTotals(zones);
  const sellAllowance = zones.soldThisTurn ? "used" : "unused";
  const { activeSource } = useDragDrop();
  // While a hand card hovers ready to sell, light the Sell slot like V1's cue.
  const sellDragActive = !rival && activeSource?.zone === "p-hand";
  const paymentSelection = usePaymentSelectionOptional();
  // While a cost awaits payment the strip's ready Eddies are live sources:
  // clicking one right on the rail taps it toward the cost, exactly like the
  // clickable Eddie cards in the Eddies modal and the ready Legends on the
  // board. The €$ button keeps opening the modal as the expanded fallback.
  const paymentActive = !rival && (paymentSelection?.paymentSelectionActive ?? false);
  const paymentEligible = (cardId: string) =>
    paymentActive && (paymentSelection?.eligiblePaymentSourceIds.has(cardId) ?? false);
  const paymentPicked = (cardId: string) =>
    paymentActive && (paymentSelection?.selectedPaymentSourceIds.has(cardId) ?? false);
  const eddiePaymentCue =
    paymentActive && zones.eddieCards.some((card) => paymentEligible(card.cardId));
  const resourceZoneId = cyberpunkZoneAnchorId("eddieArea", rival ? "opponent" : "player");
  const resourceAnimationRef = useAnimationNode(
    { kind: "zone", id: resourceZoneId, ownerId: String(PLAYER_SIDE_TO_ID[side]) },
    { zoneId: resourceZoneId, density: "mini", presence: "present" },
  );
  // One card row, latest nearest the counters: this turn's sale receipts
  // first, then the face-down Eddie miniatures, both newest-first. The rival
  // rail is row-reversed in CSS, so the same DOM order reads mirrored.
  // Eddie cards with a receipt already render as their revealed face, so they
  // are not duplicated as a second, face-down copy.
  const saleIds = new Set(sales.map((sale) => sale.cardId));
  const eddieMiniCount = Math.max(0, zones.eddieCardCount - zones.eddieCards.length);
  return (
    <div
      className={`${classes.status} ${rival ? classes.rivalStatus : classes.localStatus}`}
      data-sell-drag={sellDragActive || undefined}
    >
      {/* Street Cred leads so it hugs the board border on both rails: .status
          is a plain flex row and the rival rail's justify-content: flex-end
          pins the same DOM order against its border, so one order reads
          mirrored without a row-reverse on the rail itself. */}
      <span title="Street Cred">★ {zones.gigCount === 0 ? "—" : zones.streetCred}</span>
      <button
        ref={resourceAnimationRef}
        data-sim-zone-id={resourceZoneId}
        type="button"
        onClick={onResources}
        data-payment-cue={eddiePaymentCue || undefined}
        aria-label={`${rival ? "Rival" : "Your"} resources: ${ready} of ${total}.${
          eddiePaymentCue ? " Click a ready Eddie below to pay, or open Eddies." : " Open Eddies."
        }`}
      >
        <span>€$</span> {ready}
        <small>/{total}</small>
      </button>
      {sellAllowance === "unused" && (
        <span
          className={classes.sellSlot}
          role="img"
          aria-label={`${rival ? "Rival" : "Your"} normal Sell action unused`}
          title="Normal Sell action open — the next sold card lands here"
        />
      )}
      <div
        className={classes.saleRail}
        aria-label={`${rival ? "Rival" : "Your"} Eddies and sold cards`}
        data-testid={rival ? "rival-sale-rail" : "local-sale-rail"}
      >
        {[...sales].reverse().map((sale) => {
          const eligible = paymentEligible(sale.cardId);
          const picked = paymentPicked(sale.cardId);
          return (
            <button
              key={sale.cardId}
              type="button"
              className={classes.saleCard}
              aria-label={
                eligible
                  ? `${picked ? "Remove" : "Select"} ${sale.cardName} for payment`
                  : `Sold ${sale.cardName}. Preview card.`
              }
              aria-pressed={eligible ? picked : undefined}
              title={sale.cardName}
              data-sold-card-id={sale.cardId}
              data-payment-source={eligible || undefined}
              data-payment-selected={picked || undefined}
              data-sale-moving={movingIds.has(sale.cardId) ? "true" : undefined}
              onClick={
                eligible ? () => paymentSelection?.togglePaymentSource(sale.cardId) : undefined
              }
            >
              <CardImage imageUrl={sale.imageUrl} alt={sale.cardName} inspectOnTap={!eligible} />
            </button>
          );
        })}
        {[...zones.eddieCards]
          .reverse()
          .filter((card) => !saleIds.has(card.cardId))
          .map((card) => {
            const eligible = paymentEligible(card.cardId);
            const picked = paymentPicked(card.cardId);
            const mini = <CardImage faceDown side={side} alt="Eddie" />;
            return eligible ? (
              <button
                key={card.cardId}
                type="button"
                className={classes.eddieMini}
                aria-label={`${picked ? "Remove" : "Select"} Eddie for payment`}
                aria-pressed={picked}
                data-payment-source="true"
                data-payment-selected={picked || undefined}
                data-sale-moving={movingIds.has(card.cardId) ? "true" : undefined}
                onClick={() => paymentSelection?.togglePaymentSource(card.cardId)}
              >
                {mini}
              </button>
            ) : (
              <span
                key={card.cardId}
                className={classes.eddieMini}
                data-sale-moving={movingIds.has(card.cardId) ? "true" : undefined}
              >
                {mini}
              </span>
            );
          })}
        {Array.from({ length: eddieMiniCount }, (_, index) => (
          <span key={`eddie-hidden-${index}`} className={classes.eddieMini}>
            <CardImage faceDown side={side} alt="Eddie" />
          </span>
        ))}
      </div>
    </div>
  );
}
function PagesControl({
  zones,
  pages,
  setPages,
}: {
  zones: SideZoneViews;
  pages: Pages;
  setPages: (value: Pages) => void;
}) {
  // Hands and fields never page — the fan spreads or overlap-tightens instead.
  // Only the legend rack turns pages.
  const count = Math.ceil(zones.legendArea.length / PAGE_SIZE.legendArea);
  if (count <= 1) return null;
  const page = boundedPage(pages.legendArea, zones.legendArea.length, PAGE_SIZE.legendArea);
  return (
    <div className={classes.pageControl}>
      <Button
        size="compact-xs"
        disabled={page === 0}
        onClick={() => setPages({ ...pages, legendArea: page - 1 })}
        aria-label="Previous legendArea page"
      >
        ‹
      </Button>
      <span>
        legendArea {page + 1}/{count}
      </span>
      <Button
        size="compact-xs"
        disabled={page + 1 === count}
        onClick={() => setPages({ ...pages, legendArea: page + 1 })}
        aria-label="Next legendArea page"
      >
        ›
      </Button>
    </div>
  );
}

const noDrag = () => null;
const subscribeNoDrag = () => () => {};
