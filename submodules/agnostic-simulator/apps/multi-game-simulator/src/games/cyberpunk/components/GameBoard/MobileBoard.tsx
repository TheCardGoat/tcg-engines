import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Drawer, Popover } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconFlag3 } from "@tabler/icons-react";
import type { SimulatorConnectionDiagnosticInput } from "@tcg/game-page-contract/connection-diagnostic";
import { CardImage } from "./CardImage";
import { CenterRow, PassTurnControl } from "./CenterRow";
import { DeckZone } from "./DeckZone";
import { EddiesZone } from "./EddiesZone";
import { FieldZone } from "./FieldZone";
import { FixerZone } from "./FixerZone";
import { LegendsZone } from "./LegendsZone";
import { MobileHandZone } from "./MobileHandZone";
import { TrashZone } from "./TrashZone";
import { useGameClock } from "./useGameClock";
import { useGameState } from "./gameStateContext";
import { AiControlPanel } from "../AiControlPanel";
import { ChatPanel } from "../ChatPanel";
import { ConnectionDiagnosticPopover } from "../ConnectionDiagnostics";
import { MoveLogPanel } from "../MoveLogPanel";
import { PromptBanner } from "../Prompt/PromptBanner";
import { UserConfigButton } from "../UserConfig/UserConfigDialog";
import { CombatArrowOverlay } from "./CombatArrowOverlay";
import { OpponentDisconnectOverlay } from "./OpponentDisconnectOverlay";
import {
  otherSide,
  PLAYER_SIDE_TO_ID,
  formatPlayerIdentityMeta,
  isVisibleSubscriptionTier,
  useBoardMode,
  useEngine,
  useEngineInteractionView,
  useEngineOptional,
  useSideZones,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
  type Side,
  type ZoneCardView,
  type MoveLogEntry,
} from "../../engine";
import {
  interactionViewActionHasCandidate,
  interactionViewCanAttackRival,
} from "../../engine/interactionViewHelpers";
import {
  connectionUiStatus,
  isConnectionDisconnected,
} from "../../engine/live/playerConnectionState";
import { useDragDrop } from "./DragDropContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { useLastSoldCardForSide, type LastSoldCard } from "./useLastSoldCard";
import classes from "./MobileBoard.module.css";

type DrawerKey = "logs" | "chat" | "ai" | null;

interface FieldOverflowState {
  before: boolean;
  after: boolean;
}

const EMPTY_FIELD_OVERFLOW: FieldOverflowState = { before: false, after: false };
const FIELD_SCROLL_EPSILON = 2;

const drawerClassNames = {
  body: classes.drawerBody,
  close: classes.drawerClose,
  content: classes.drawer,
  header: classes.drawerHeader,
  title: classes.drawerTitle,
};

function fieldUnitsOf(cards: ZoneCardView[]) {
  return cards.map((c) => ({
    imageUrl: c.imageUrl,
    name: c.name,
    cardId: c.cardId,
    cardType: c.cardType,
    color: c.color,
    tapped: c.spent,
    playedThisTurn: c.playedThisTurn,
    effectiveRules: c.effectiveRules,
    rulesText: c.rulesText,
    classifications: c.classifications,
    keywords: c.keywords,
    hasSellTag: c.hasSellTag,
    cost: c.cost,
    effectiveCost: c.effectiveCost,
    costEffects: c.costEffects,
    power: c.power,
    effectivePower: c.effectivePower,
    activeEffects: c.activeEffects,
    gear: c.attachedGear.map((g) => ({
      imageUrl: g.imageUrl,
      name: g.name,
      cardId: g.cardId,
      cardType: g.cardType,
      cost: g.cost,
      effectiveCost: g.effectiveCost,
      costEffects: g.costEffects,
      power: g.power,
      effectivePower: g.effectivePower,
      rulesText: g.rulesText,
      classifications: g.classifications,
      keywords: g.keywords,
      effectiveRules: g.effectiveRules,
      activeEffects: g.activeEffects,
      hasSellTag: g.hasSellTag,
    })),
  }));
}

function readFieldOverflow(scroller: HTMLElement): FieldOverflowState {
  const overflow = scroller.scrollHeight - scroller.clientHeight > FIELD_SCROLL_EPSILON;
  if (!overflow) {
    return EMPTY_FIELD_OVERFLOW;
  }
  return {
    before: scroller.scrollTop > FIELD_SCROLL_EPSILON,
    after:
      scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - FIELD_SCROLL_EPSILON,
  };
}

function useFieldOverflow(
  fieldBandRef: RefObject<HTMLDivElement | null>,
  unitCount: number,
): FieldOverflowState {
  const [overflow, setOverflow] = useState<FieldOverflowState>(EMPTY_FIELD_OVERFLOW);

  useEffect(() => {
    const fieldBand = fieldBandRef.current;
    const scroller = fieldBand?.querySelector<HTMLElement>('[data-testid="field-cards"]');
    if (!scroller) {
      setOverflow(EMPTY_FIELD_OVERFLOW);
      return;
    }

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const next = readFieldOverflow(scroller);
      setOverflow((current) =>
        current.before === next.before && current.after === next.after ? current : next,
      );
    };
    const scheduleUpdate = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      frame = window.requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    observer?.observe(scroller);
    for (const child of Array.from(scroller.children)) {
      if (child instanceof HTMLElement) {
        observer?.observe(child);
      }
    }

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
    };
  }, [fieldBandRef, unitCount]);

  return overflow;
}

function scrollField(fieldBandRef: RefObject<HTMLDivElement | null>, direction: 1 | -1) {
  const scroller = fieldBandRef.current?.querySelector<HTMLElement>('[data-testid="field-cards"]');
  if (!scroller) {
    return;
  }
  scroller.scrollBy({
    top: direction * Math.max(72, Math.floor(scroller.clientHeight * 0.72)),
    behavior: "smooth",
  });
}

function FieldScrollCue({
  overflow,
  opponent = false,
  onScroll,
}: {
  overflow: FieldOverflowState;
  opponent?: boolean;
  onScroll: (direction: 1 | -1) => void;
}) {
  if (!overflow.before && !overflow.after) {
    return null;
  }

  return (
    <div className={classes.fieldScrollCues} data-side={opponent ? "rival" : "player"}>
      {overflow.before ? (
        <button
          type="button"
          className={`${classes.fieldScrollCue} ${classes.fieldScrollCueTop}`}
          onClick={() => onScroll(-1)}
          aria-label={`Scroll to earlier ${opponent ? "rival" : "friendly"} field cards`}
        >
          <IconChevronUp size={13} stroke={2.4} aria-hidden="true" />
          <span>More</span>
        </button>
      ) : null}
      {overflow.after ? (
        <button
          type="button"
          className={`${classes.fieldScrollCue} ${classes.fieldScrollCueBottom}`}
          onClick={() => onScroll(1)}
          aria-label={`Scroll to more ${opponent ? "rival" : "friendly"} field cards`}
        >
          <span>More</span>
          <IconChevronDown size={13} stroke={2.4} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function legendsOf(
  cards: ZoneCardView[],
  peekedLegends: { ids: ReadonlySet<string>; indexes: ReadonlySet<number> } = {
    ids: new Set(),
    indexes: new Set(),
  },
) {
  return cards.map((c, index) => ({
    imageUrl: c.imageUrl,
    name: c.name,
    cardId: c.cardId,
    cardType: c.cardType,
    color: c.color,
    faceDown: c.faceDown,
    spent: c.spent,
    effectiveRules: c.effectiveRules,
    rulesText: c.rulesText,
    classifications: c.classifications,
    keywords: c.keywords,
    hasSellTag: c.hasSellTag,
    cost: c.cost,
    effectiveCost: c.effectiveCost,
    costEffects: c.costEffects,
    power: c.power,
    effectivePower: c.effectivePower,
    activeEffects: c.activeEffects,
    gear: c.attachedGear.map((g) => ({
      imageUrl: g.imageUrl,
      name: g.name,
      cardId: g.cardId,
      cardType: g.cardType,
      cost: g.cost,
      effectiveCost: g.effectiveCost,
      costEffects: g.costEffects,
      power: g.power,
      effectivePower: g.effectivePower,
      rulesText: g.rulesText,
      classifications: g.classifications,
      keywords: g.keywords,
      effectiveRules: g.effectiveRules,
      activeEffects: g.activeEffects,
      hasSellTag: g.hasSellTag,
    })),
    peeked: c.faceDown && (peekedLegends.ids.has(c.cardId) || peekedLegends.indexes.has(index)),
  }));
}

function eddieCounts(zones: ReturnType<typeof useSideZones>, revealedCardId?: string) {
  const readyLegendCount = zones.legendArea.filter((card) => !card.spent).length;
  const cardCount = Math.max(zones.eddieCardCount, zones.eddies + zones.spentEddies);
  return {
    count: zones.eddies,
    cards: zones.eddieCards.map((card, i, arr) => ({
      cardId: card.cardId,
      spent: card.spent,
      revealed:
        (!card.spent && zones.soldThisTurn && i === arr.length - 1) ||
        card.cardId === revealedCardId,
      imageUrl: card.imageUrl,
      name: card.name,
    })),
    cardCount,
    spentCardCount: zones.spentEddies,
    availableCount: zones.eddies + readyLegendCount,
    totalCount: cardCount + zones.legendArea.length,
  };
}

function fixerSummary(zones: ReturnType<typeof useSideZones>) {
  const labels = zones.fixerArea.map((die) => die.label.toUpperCase());
  const count = labels.length;
  if (count === 0) {
    return { value: "0", detail: "No dice" };
  }
  return {
    value: count.toString(),
    detail: count > 3 ? `${labels.slice(0, 3).join(" ")} +${count - 3}` : labels.join(" "),
  };
}

interface FieldHelperClusterProps {
  zones: ReturnType<typeof useSideZones>;
  eddies: ReturnType<typeof eddieCounts>;
  side: Side;
  lastSoldCard: LastSoldCard | null;
  sellArrivalKey?: number;
  opponent?: boolean;
}

function FieldHelperCluster({
  zones,
  eddies,
  side,
  lastSoldCard,
  sellArrivalKey,
  opponent = false,
}: FieldHelperClusterProps) {
  const position = opponent ? "left-start" : "right-start";
  const titlePosition = opponent ? "top" : "bottom";
  const fixer = fixerSummary(zones);
  const lastSoldDetail = lastSoldCard ? `Last: ${lastSoldCard.cardName}` : undefined;

  return (
    <div
      className={`${classes.fieldHelpers} ${opponent ? classes.opponentFieldHelpers : classes.playerFieldHelpers}`}
      aria-label={opponent ? "Rival helper zones" : "Player helper zones"}
    >
      <HelperPopover label="Deck" shortLabel="D" value={zones.deckCount} position={position}>
        <div className={classes.popoverZone}>
          <DeckZone count={zones.deckCount} opponent={opponent} side={side} />
        </div>
      </HelperPopover>
      <HelperPopover label="Trash" shortLabel="T" value={zones.trashCount} position={position}>
        <div className={classes.popoverZone}>
          <TrashZone
            topCard={zones.trashTop ?? undefined}
            opponent={opponent}
            side={side}
            count={zones.trashCount}
          />
        </div>
      </HelperPopover>
      <HelperPopover
        label="Fixer"
        shortLabel="F"
        value={fixer.value}
        detail={fixer.detail}
        position={position}
      >
        <FixerZone titlePosition={titlePosition} dice={zones.fixerArea} side={side} />
      </HelperPopover>
      <HelperPopover
        label="Eddies"
        shortLabel="€"
        value={`${eddies.availableCount}/${eddies.totalCount}`}
        detail={lastSoldDetail}
        position={position}
        targetZone={opponent ? "opp-eddies" : "p-eddies"}
        rewardPulseKey={sellArrivalKey}
      >
        <div className={`${classes.popoverZone} ${classes.popoverZoneEddies}`}>
          <EddiesZone {...eddies} opponent={opponent} side={side} />
        </div>
      </HelperPopover>
    </div>
  );
}

function MobileSellReveal({
  sale,
  card,
  opponent,
}: {
  sale: LastSoldCard | null;
  card?: { imageUrl?: string; name?: string } | null;
  opponent: boolean;
}) {
  const [visibleSale, setVisibleSale] = useState<LastSoldCard | null>(null);
  const lastAnimatedSaleIdRef = useRef<number | null>(null);
  const saleId = sale?.id ?? null;
  const saleCardId = sale?.cardId ?? "";
  const saleCardName = sale?.cardName ?? "";
  const saleSide = sale?.side ?? "player";

  useEffect(() => {
    if (saleId === null || saleId === lastAnimatedSaleIdRef.current) {
      return;
    }
    lastAnimatedSaleIdRef.current = saleId;
    setVisibleSale({
      id: saleId,
      cardId: saleCardId,
      cardName: saleCardName,
      side: saleSide,
    });
    const timer = window.setTimeout(() => setVisibleSale(null), 1350);
    return () => window.clearTimeout(timer);
  }, [saleCardId, saleCardName, saleId, saleSide]);

  if (!visibleSale) {
    return null;
  }

  return (
    <div
      key={visibleSale.id}
      className={classes.sellRevealTrack}
      data-side={opponent ? "opponent" : "player"}
      data-testid="mobile-sell-reveal"
      aria-live="polite"
      aria-label={`${opponent ? "Rival" : "You"} sold ${visibleSale.cardName}`}
    >
      <div className={classes.sellRevealCard}>
        <CardImage imageUrl={card?.imageUrl} alt={card?.name ?? visibleSale.cardName} />
      </div>
      <div className={classes.sellRevealLabel}>
        <span>{opponent ? "Rival sold" : "Sold"}</span>
        <strong>{visibleSale.cardName}</strong>
      </div>
    </div>
  );
}

function HelperPopover({
  label,
  shortLabel,
  value,
  detail,
  position,
  accent = false,
  targetZone,
  rewardPulseKey,
  children,
}: {
  label: string;
  shortLabel: string;
  value: number | string;
  detail?: string;
  position: "right-start" | "left-start";
  accent?: boolean;
  targetZone?: string;
  rewardPulseKey?: number;
  children: ReactNode;
}) {
  const drop = useZoneDroppable(targetZone);
  const { activeSource } = useDragDrop();
  const engine = useEngineOptional();
  const interactionView = useEngineInteractionView(engine?.humanSide ?? "player");
  const sellDropReady =
    targetZone === "p-eddies" &&
    activeSource?.zone === "p-hand" &&
    activeSource.cardId &&
    interactionViewActionHasCandidate(interactionView, "sellCard", "cardId", activeSource.cardId);
  const shownLabel = sellDropReady ? "Sell" : shortLabel;
  const shownValue = sellDropReady ? "+1 Eddie" : value;
  const ariaDetail = sellDropReady ? "Drop to sell in Eddies area" : detail;

  return (
    <Popover
      position={position}
      withArrow
      shadow="md"
      withinPortal
      classNames={{ dropdown: classes.helperPopover, arrow: classes.helperPopoverArrow }}
    >
      <Popover.Target>
        <button
          ref={drop.setNodeRef}
          type="button"
          className={`${classes.fieldHelperButton} ${accent ? classes.fieldHelperButtonAccent : ""} ${
            drop.isOver ? classes.fieldHelperButtonDropOver : ""
          } ${sellDropReady ? classes.fieldHelperButtonSellReady : ""}`}
          data-drop-ready={sellDropReady ? "sellCard" : undefined}
          data-drop-zone={targetZone}
          data-helper={label.toLowerCase()}
          aria-label={`${label} ${shownValue}${ariaDetail ? ` ${ariaDetail}` : ""}`}
        >
          <span>{shownLabel}</span>
          <strong>{shownValue}</strong>
          {sellDropReady ? <em>Eddies</em> : detail ? <em>{detail}</em> : null}
          {rewardPulseKey ? (
            <span key={rewardPulseKey} className={classes.fieldHelperRewardPulse}>
              +1
            </span>
          ) : null}
        </button>
      </Popover.Target>
      <Popover.Dropdown>{children}</Popover.Dropdown>
    </Popover>
  );
}

function MobileClockRail() {
  const { prioritySide, turnNumber, phase, gameEnded } = useGameState();
  const clock = useGameClock(prioritySide, { paused: gameEnded });
  const { humanSide } = useEngine();
  const rivalSide = otherSide(humanSide);
  const rivalClock = clock[rivalSide];
  const humanClock = clock[humanSide];

  return (
    <div
      className={`${classes.mobileClockRail} ${clock.active.urgent ? classes.mobileClockRailUrgent : ""} ${
        clock.active.critical ? classes.mobileClockRailCritical : ""
      }`}
      aria-label={`Turn ${turnNumber} ${phase} priority clock. Rival ${rivalClock.time}. You ${humanClock.time}.`}
    >
      <ClockPill
        ariaLabel="Rival clock"
        time={rivalClock.time}
        active={prioritySide === rivalSide}
        tone="rival"
      />
      <div className={classes.clockCore} aria-hidden="true">
        <span>T{turnNumber}</span>
        <strong>{phase}</strong>
      </div>
      <ClockPill
        ariaLabel="Your clock"
        time={humanClock.time}
        active={prioritySide === humanSide}
        tone="friendly"
      />
    </div>
  );
}

function ClockPill({
  ariaLabel,
  time,
  active,
  tone,
}: {
  ariaLabel: string;
  time: string;
  active: boolean;
  tone: "rival" | "friendly";
}) {
  return (
    <div
      className={classes.clockPill}
      data-active={active ? "true" : "false"}
      data-tone={tone}
      aria-label={`${ariaLabel} ${time}${active ? ", active" : ""}`}
    >
      <strong>{time}</strong>
    </div>
  );
}

function MobileDirectAttackDropTarget() {
  const drop = useZoneDroppable("opp-pinfo");
  const { activeSource } = useDragDrop();
  const engine = useEngineOptional();
  const interactionView = useEngineInteractionView(engine?.humanSide ?? "player");
  const active =
    activeSource?.zone === "p-field" &&
    activeSource.cardId &&
    interactionViewCanAttackRival(interactionView, activeSource.cardId);

  return (
    <div
      ref={drop.setNodeRef}
      className={classes.directAttackDropTarget}
      data-active={active ? "true" : "false"}
      data-over={drop.isOver ? "true" : "false"}
      data-drop-zone="opp-pinfo"
      aria-hidden="true"
    >
      <div className={classes.directAttackDropCue}>
        <span>Steal</span>
        <strong>Rival Gigs</strong>
      </div>
    </div>
  );
}

function ReconnectCue() {
  return (
    <div className={classes.reconnectCue} role="status" aria-live="polite">
      <strong>Reconnecting</strong>
      <span>Actions are paused while we rejoin the match server.</span>
    </div>
  );
}

export function MobileBoard({
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
}: {
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
}) {
  const { humanSide, moveLogs, matchState } = useEngine();
  const { activeSide, prioritySide, phase, gameEnded, winnerSide, winReason } = useGameState();
  const rivalSide = otherSide(humanSide);
  const [drawer, setDrawer] = useState<DrawerKey>(null);
  const close = () => setDrawer(null);
  const human = useSideZones(humanSide);
  const rival = useSideZones(rivalSide);
  const humanIdentity = playerIdentities?.[humanSide];
  const rivalIdentity = playerIdentities?.[rivalSide];
  const humanIdentityMeta = formatPlayerIdentityMeta(humanIdentity);
  const rivalIdentityMeta = formatPlayerIdentityMeta(rivalIdentity);
  const rivalClaimAvailable = isConnectionDisconnected(playerConnections?.[rivalSide]);
  const humanConnectionStatus = connectionUiStatus(playerConnections?.[humanSide]);
  const humanLastSold = useLastSoldCardForSide(moveLogs, humanSide);
  const rivalLastSold = useLastSoldCardForSide(moveLogs, rivalSide);
  const humanEddies = eddieCounts(human, humanLastSold?.cardId);
  const rivalEddies = eddieCounts(rival, rivalLastSold?.cardId);
  const humanLastSoldView = human.eddieCards.find((card) => card.cardId === humanLastSold?.cardId);
  const rivalLastSoldView = rival.eddieCards.find((card) => card.cardId === rivalLastSold?.cardId);
  const promptMode = useBoardMode(humanSide);
  const promptActive = promptMode !== "view";
  const turnNumber = matchState.G.turnMetadata.turnNumber;
  const humanPeekedLegends = usePeekedLegendsForSide(moveLogs, humanSide, turnNumber);
  const rivalPeekedLegends = usePeekedLegendsForSide(moveLogs, rivalSide, turnNumber);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const rivalFieldBandRef = useRef<HTMLDivElement | null>(null);
  const humanFieldBandRef = useRef<HTMLDivElement | null>(null);
  const rivalFieldOverflow = useFieldOverflow(rivalFieldBandRef, rival.field.length);
  const humanFieldOverflow = useFieldOverflow(humanFieldBandRef, human.field.length);

  return (
    <div
      ref={boardRef}
      className={classes.root}
      data-prompt-active={promptActive ? "true" : "false"}
      data-prompt-mode={promptActive ? promptMode : undefined}
      data-side={humanSide}
      data-active-side={activeSide}
      data-phase={phase}
      data-game-status={gameEnded ? "ended" : "active"}
      data-winner={
        gameEnded ? (winnerSide ? (winnerSide === humanSide ? "you" : "rival") : "draw") : undefined
      }
      data-end-reason={gameEnded ? (winReason ?? undefined) : undefined}
    >
      <CombatArrowOverlay containerRef={boardRef} />
      <div className={classes.topSection} data-legend-count={rival.legendArea.length}>
        <div className={`${classes.legendsPanel} ${classes.opponentLegendsPanel}`}>
          <LegendsZone
            legends={legendsOf(rival.legendArea, rivalPeekedLegends)}
            opponent
            side={rivalSide}
          />
        </div>

        <div className={classes.topControls}>
          <div className={classes.opponentIdentity} aria-label="Opponent status">
            <ConnectionDiagnosticPopover
              className={classes.connectionDot}
              connection={playerConnections?.[rivalSide]}
              allConnections={playerConnections}
              diagnostic={connectionDiagnostic}
              label={rivalIdentity?.displayName ?? "Rival"}
              side={rivalSide}
              playerId={rivalIdentity?.id}
              onClaimDrop={onClaimRivalDrop}
              claimAvailable={rivalClaimAvailable}
            />
            <div className={classes.opponentIdentityText}>
              <strong
                data-subscriber={
                  isVisibleSubscriptionTier(rivalIdentity?.subscriptionTier) ? "true" : undefined
                }
              >
                {rivalIdentity?.displayName ?? "Rival"}
              </strong>
              {rivalIdentityMeta ? <span>{rivalIdentityMeta}</span> : null}
            </div>
            <a
              className={classes.reportPlayerButton}
              href="/report-player"
              aria-label="Report player"
              title="Report player"
            >
              <IconFlag3 size={14} stroke={2.1} aria-hidden="true" />
            </a>
          </div>
          <div className={classes.gameControls}>
            <button
              type="button"
              className={classes.gameControlButton}
              onClick={() => setDrawer("logs")}
            >
              Logs
            </button>
            <button
              type="button"
              className={classes.gameControlButton}
              onClick={() => setDrawer("chat")}
            >
              Chat
            </button>
            <div className={classes.settingsControl}>
              <UserConfigButton />
            </div>
            <button
              type="button"
              className={classes.gameControlButton}
              onClick={() => setDrawer("ai")}
            >
              AI
            </button>
          </div>
        </div>

        <div className={`${classes.handBand} ${classes.opp} ${classes.topHandBand}`}>
          <MobileHandZone faceDown cardCount={rival.hand.length} side={rivalSide} />
        </div>
      </div>

      {/* Rival field — horizontal scroll if many units */}
      <div
        ref={rivalFieldBandRef}
        className={`${classes.fieldBand} ${classes.opponentFieldBand} ${classes.opp}`}
        data-priority={prioritySide === rivalSide ? "true" : "false"}
      >
        <FieldZone units={fieldUnitsOf(rival.field)} opponent side={rivalSide} />
        <FieldScrollCue
          overflow={rivalFieldOverflow}
          opponent
          onScroll={(direction) => scrollField(rivalFieldBandRef, direction)}
        />
        <FieldHelperCluster
          zones={rival}
          eddies={rivalEddies}
          side={rivalSide}
          lastSoldCard={rivalLastSold}
          sellArrivalKey={rivalLastSold?.id}
          opponent
        />
        <OpponentDisconnectOverlay
          variant="opponent"
          connection={playerConnections?.[rivalSide]}
          onClaimDrop={onClaimRivalDrop}
          claimAvailable={rivalClaimAvailable}
        />
      </div>

      {/* Center action band: only the rival/friendly gigs on mobile —
          clock and pass turn live in the top/bottom strips. */}
      <div className={classes.center}>
        <CenterRow gigsOnly />
        <MobileClockRail />
        <MobileDirectAttackDropTarget />
        <MobileSellReveal sale={rivalLastSold} card={rivalLastSoldView} opponent />
        <MobileSellReveal sale={humanLastSold} card={humanLastSoldView} opponent={false} />
      </div>

      {/* Human field */}
      <div
        ref={humanFieldBandRef}
        className={`${classes.fieldBand} ${classes.playerFieldBand}`}
        data-priority={prioritySide === humanSide ? "true" : "false"}
      >
        <FieldZone units={fieldUnitsOf(human.field)} side={humanSide} />
        <FieldScrollCue
          overflow={humanFieldOverflow}
          onScroll={(direction) => scrollField(humanFieldBandRef, direction)}
        />
        <FieldHelperCluster
          zones={human}
          eddies={humanEddies}
          side={humanSide}
          lastSoldCard={humanLastSold}
          sellArrivalKey={humanLastSold?.id}
        />
        {humanConnectionStatus === "disconnected" || humanConnectionStatus === "reconnecting" ? (
          <OpponentDisconnectOverlay variant="self" connection={playerConnections?.[humanSide]} />
        ) : null}
      </div>

      <div className={classes.bottomSection} data-legend-count={human.legendArea.length}>
        {/* Human legends + eddies stay visible in the bottom command dock. */}
        <div className={`${classes.legendsPanel} ${classes.playerLegendsPanel}`}>
          <LegendsZone legends={legendsOf(human.legendArea, humanPeekedLegends)} side={humanSide} />
        </div>

        {/* Human hand — flat strip above the command rail. */}
        <div className={`${classes.handBand} ${classes.bottomHandBand}`}>
          <MobileHandZone
            cards={human.hand.map((c) => ({
              imageUrl: c.imageUrl,
              name: c.name,
              cardId: c.cardId,
              cardType: c.cardType,
              color: c.color,
              effectiveRules: c.effectiveRules,
              rulesText: c.rulesText,
              classifications: c.classifications,
              keywords: c.keywords,
              hasSellTag: c.hasSellTag,
              cost: c.cost,
              effectiveCost: c.effectiveCost,
              costEffects: c.costEffects,
              power: c.power,
              effectivePower: c.effectivePower,
              activeEffects: c.activeEffects,
            }))}
            side={humanSide}
            availableEddies={human.eddies}
          />
        </div>

        <div className={classes.promptBand}>
          {humanConnectionStatus === "reconnecting" ? <ReconnectCue /> : null}
          <PromptBanner side={humanSide} compact showActionPrompt={true} />
        </div>

        <div className={classes.bottomCommandBar}>
          <div
            className={`${classes.opponentIdentity} ${classes.playerIdentity}`}
            aria-label="Player status"
          >
            <ConnectionDiagnosticPopover
              className={classes.connectionDot}
              connection={playerConnections?.[humanSide]}
              allConnections={playerConnections}
              diagnostic={connectionDiagnostic}
              label={humanIdentity?.displayName ?? "You"}
              side={humanSide}
              playerId={humanIdentity?.id}
              self
            />
            <div className={classes.opponentIdentityText}>
              <strong>{humanIdentity?.displayName ?? "You"}</strong>
              <span>
                {[humanIdentityMeta, `T${turnNumber}`, phase].filter(Boolean).join(" · ")}
              </span>
            </div>
          </div>
          <div className={`${classes.gameControls} ${classes.mobilePhaseControls}`}>
            <PassTurnControl compact compactLabelStyle="action" />
          </div>
        </div>
      </div>

      <Drawer
        opened={drawer === "ai"}
        onClose={close}
        position="bottom"
        size="80%"
        title="AI controls"
        classNames={drawerClassNames}
      >
        <AiControlPanel />
      </Drawer>

      <Drawer
        opened={drawer === "logs"}
        onClose={close}
        position="right"
        size="min(360px, 88vw)"
        title="Logs"
        classNames={drawerClassNames}
      >
        <MoveLogPanel />
      </Drawer>

      <Drawer
        opened={drawer === "chat"}
        onClose={close}
        position="right"
        size="min(360px, 88vw)"
        title="Chat"
        classNames={drawerClassNames}
      >
        <ChatPanel />
      </Drawer>
    </div>
  );
}

function usePeekedLegendsForSide(
  moveLogs: ReadonlyArray<MoveLogEntry>,
  side: Side,
  turnNumber: number,
): { ids: Set<string>; indexes: Set<number> } {
  const ownerId = String(PLAYER_SIDE_TO_ID[side]);
  return useMemo(() => {
    const ids = new Set<string>();
    const indexes = new Set<number>();
    for (const entry of moveLogs) {
      const log = entry.log;
      if (
        log.type !== "action" ||
        log.turnNumber !== turnNumber ||
        log.messageKey !== "trigger.targetResolved" ||
        log.params.sourceCardName !== "Kiroshi Optics" ||
        log.params.targetKind !== "legend" ||
        log.params.targetZone !== "legendArea" ||
        log.params.targetOwnerId !== ownerId ||
        typeof log.params.targetNames !== "string"
      ) {
        continue;
      }
      if (typeof log.params.targetId === "string") {
        ids.add(log.params.targetId);
      }
      if (typeof log.params.targetIndex === "number") {
        indexes.add(log.params.targetIndex);
      }
    }
    return { ids, indexes };
  }, [moveLogs, ownerId, turnNumber]);
}
