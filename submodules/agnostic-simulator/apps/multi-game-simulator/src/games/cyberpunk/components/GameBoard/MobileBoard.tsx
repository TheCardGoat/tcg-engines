import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Drawer } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBug,
  IconBulb,
  IconDotsVertical,
  IconFlag3,
  IconHistory,
  IconMessageCircle,
  IconPlayerPause,
  IconPlayerPlay,
  IconRobot,
  IconUserPlus,
} from "@tabler/icons-react";
import type { SimulatorConnectionDiagnosticInput } from "@tcg/game-page-contract/connection-diagnostic";
import { safeStringify } from "@tcg/simulator-runtime/debug";
import type {
  SimulatorDeckReveal,
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorTable,
  SimulatorTargetFilter,
} from "@tcg/simulator-contract";
import {
  EventLogPanel,
  MobileBattlefieldLane,
  MobileHandDock,
  MobilePlayerRail,
  MobilePortraitBoard,
  MobileZoneInventoryPopover,
  TargetFilterModal,
} from "@tcg/simulator-ui";
import { CardImage } from "./CardImage";
import { CenterRow, PassTurnControl } from "./CenterRow";
import { DeckZone } from "./DeckZone";
import { EddiesZone } from "./EddiesZone";
import { FieldZone } from "./FieldZone";
import { LegendsZone } from "./LegendsZone";
import { MobileHandZone, type MobileHandMeasurement } from "./MobileHandZone";
import { useTemporaryRevealedHandCardIds } from "./temporaryHandReveals";
import { TrashZone } from "./TrashZone";
import { useGameClock } from "./useGameClock";
import { useGameState } from "./gameStateContext";
import { AiControlPanel } from "../AiControlPanel";
import { ChatPanel } from "../ChatPanel";
import { ChoiceModal } from "../Prompt/ChoiceModal";
import { PromptBanner } from "../Prompt/PromptBanner";
import { UserConfigButton } from "../UserConfig/UserConfigDialog";
import type { LiveMatchSidebarConfig, LiveMatchSidebarParticipant } from "../BoardRuntimeContext";
import { CombatArrowOverlay } from "./CombatArrowOverlay";
import { OpponentDisconnectOverlay } from "./OpponentDisconnectOverlay";
import { useOpponentPresence } from "../../engine/live/useOpponentPresence";
import {
  otherSide,
  PLAYER_SIDE_TO_ID,
  formatPlayerIdentityMeta,
  isVisibleSubscriptionTier,
  resolveAiStatus,
  useBoardMode,
  useEngine,
  useEngineInteractionView,
  useEngineOptional,
  useUserConfig,
  useSideZones,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
  type Side,
  type ZoneCardView,
  type MoveLogEntry,
} from "../../engine";
import { projectMoveLogEntries } from "../../engine/moveLogProjection";
import { interactionViewCanAttackRival } from "../../engine/interactionViewHelpers";
import {
  connectionUiStatus,
  isConnectionDisconnected,
} from "../../engine/live/playerConnectionState";
import { useDragDrop } from "./DragDropContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { useLastSoldCardForSide, type LastSoldCard } from "./useLastSoldCard";
import { useDeckRevealForSide } from "./deckReveal";
import { apiUrl } from "../../../../runtime/gameRuntimeApi";
import classes from "./MobileBoard.module.css";

type DrawerKey = "logs" | "chat" | "ai" | "actions" | null;

const MOBILE_EVENT_LOG_ENTRY_CAP = 80;
const HAND_HELPER_ONE_MIN_WIDTH = 104;
const HAND_HELPER_ONE_MAX_WIDTH = 112;
const HAND_HELPER_ONE_WIDTH_RATIO = 0.12;
const HAND_HELPER_MULTI_MIN_WIDTH = 168;
const HAND_HELPER_MULTI_MAX_WIDTH = 184;
const HAND_HELPER_MULTI_WIDTH_RATIO = 0.2;
const HAND_HELPER_GAP = 4;
const ROTATE_GATE_MESSAGE =
  "Landscape keeps the board, hand, clocks, and actions visible on small phones.";

const drawerClassNames = {
  body: classes.drawerBody,
  close: classes.drawerClose,
  content: classes.drawer,
  header: classes.drawerHeader,
  title: classes.drawerTitle,
};

const FIXER_SUMMARY_ORDER = [
  { dieType: "d20", label: "20" },
  { dieType: "d12", label: "12" },
  { dieType: "d10", label: "10" },
  { dieType: "d8", label: "8" },
  { dieType: "d6", label: "6" },
  { dieType: "d4", label: "4" },
] as const;

const MOBILE_REPORT_REASONS = [
  { value: "stalling", label: "Stalling" },
  { value: "abusive_chat", label: "Abusive chat" },
  { value: "exploit", label: "Exploit" },
  { value: "collusion", label: "Collusion" },
  { value: "inappropriate_name", label: "Inappropriate name" },
  { value: "intentional_disconnect", label: "Intentional disconnect" },
  { value: "other", label: "Other" },
] as const;

type MobileSupportDialog = "bug" | "feature" | "feedback";

const MOBILE_SUPPORT_COPY: Record<
  MobileSupportDialog,
  { title: string; description: string; placeholder: string; successTitle: string }
> = {
  bug: {
    title: "Report bug",
    description: "Tell us what went wrong. This includes the match context automatically.",
    placeholder: "What happened?",
    successTitle: "Bug report submitted",
  },
  feature: {
    title: "Request feature",
    description: "Tell us what would make this match experience better.",
    placeholder: "What should we add or improve?",
    successTitle: "Feature request submitted",
  },
  feedback: {
    title: "Share feedback",
    description: "Tell us what would make the simulator more useful.",
    placeholder: "What should we improve?",
    successTitle: "Feedback submitted",
  },
};

function fieldUnitsOf(cards: ZoneCardView[]) {
  return cards.map((c) => ({
    imageUrl: c.imageUrl,
    name: c.name,
    cardId: c.cardId,
    cardType: c.cardType,
    color: c.color,
    tapped: c.spent,
    hasLag: c.hasLag,
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

type FieldOverflowState = {
  before: boolean;
  after: boolean;
};

const EMPTY_FIELD_OVERFLOW: FieldOverflowState = { before: false, after: false };
const FIELD_SCROLL_EPSILON = 2;

function readFieldOverflow(scroller: HTMLElement): FieldOverflowState {
  const overflow = scroller.scrollWidth - scroller.clientWidth > FIELD_SCROLL_EPSILON;
  if (!overflow) {
    return EMPTY_FIELD_OVERFLOW;
  }
  return {
    before: scroller.scrollLeft > FIELD_SCROLL_EPSILON,
    after: scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - FIELD_SCROLL_EPSILON,
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

function useElementWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setWidth(0);
      return;
    }

    let frame: number | null = null;
    const update = () => {
      frame = null;
      setWidth(element.getBoundingClientRect().width);
    };
    const scheduleUpdate = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", scheduleUpdate);

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    observer?.observe(element);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
    };
  }, [ref]);

  return width;
}

function handHelperReserveWidth(sectionWidth: number, legendCount: number): number {
  const multiLegend = legendCount > 1;
  const minWidth = multiLegend ? HAND_HELPER_MULTI_MIN_WIDTH : HAND_HELPER_ONE_MIN_WIDTH;
  const maxWidth = multiLegend ? HAND_HELPER_MULTI_MAX_WIDTH : HAND_HELPER_ONE_MAX_WIDTH;
  const widthRatio = multiLegend ? HAND_HELPER_MULTI_WIDTH_RATIO : HAND_HELPER_ONE_WIDTH_RATIO;

  if (sectionWidth <= 0) {
    return maxWidth;
  }
  return Math.min(maxWidth, Math.max(minWidth, sectionWidth * widthRatio));
}

function canDockHandHelper(
  measurement: MobileHandMeasurement | null,
  sectionWidth: number,
  legendCount: number,
): boolean {
  if (!measurement || sectionWidth <= 0 || legendCount <= 0) {
    return false;
  }
  const helperReserve = handHelperReserveWidth(sectionWidth, legendCount);
  return measurement.contentWidth + helperReserve + HAND_HELPER_GAP <= sectionWidth;
}

function sameHandMeasurement(a: MobileHandMeasurement | null, b: MobileHandMeasurement): boolean {
  return (
    !!a &&
    Math.abs(a.availableWidth - b.availableWidth) <= 1 &&
    Math.abs(a.contentWidth - b.contentWidth) <= 1
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

function fixerSummarySlots(zones: ReturnType<typeof useSideZones>) {
  const active = new Set(zones.fixerArea.map((die) => die.dieType));
  return FIXER_SUMMARY_ORDER.map((slot) => ({
    ...slot,
    active: active.has(slot.dieType),
  }));
}

interface CyberpunkZoneInventoryProps {
  zones: ReturnType<typeof useSideZones>;
  eddies: ReturnType<typeof eddieCounts>;
  side: Side;
  lastSoldCard: LastSoldCard | null;
  deckReveal?: SimulatorDeckReveal;
  sellArrivalKey?: number;
  opponent?: boolean;
  placement?: "top" | "bottom";
  align?: "start" | "end";
  label?: ReactNode;
  scrollTarget?: ZoneInventorySection | null;
  onOpenTrash?: () => void;
}

type ZoneInventorySection = "deck" | "trash" | "fixer" | "eddies";

function CyberpunkZoneInventory({
  zones,
  eddies,
  side,
  lastSoldCard,
  deckReveal,
  sellArrivalKey,
  opponent = false,
  placement = "bottom",
  align,
  label,
  scrollTarget,
  onOpenTrash,
}: CyberpunkZoneInventoryProps) {
  const fixer = fixerSummary(zones);
  const fixerSlots = fixerSummarySlots(zones);
  const lastSoldDetail = lastSoldCard ? `Last: ${lastSoldCard.cardName}` : undefined;
  const sellDrop = useZoneDroppable(opponent ? null : "p-eddies");
  const { activeSource } = useDragDrop();
  const sellDropReady =
    !opponent && activeSource?.zone === "p-hand" && Boolean(activeSource.cardId);

  return (
    <div
      ref={sellDrop.setNodeRef}
      className={classes.zoneInventoryHost}
      data-drop-ready={sellDropReady ? "sellCard" : undefined}
      data-drop-over={sellDrop.isOver ? "true" : "false"}
      data-drop-zone={!opponent ? "p-eddies" : undefined}
      aria-label={
        opponent
          ? "Rival zone inventory"
          : sellDropReady
            ? "Player zone inventory. Drop here to sell this card for 1 Eddie."
            : "Player zone inventory"
      }
    >
      <MobileZoneInventoryPopover
        label={label}
        placement={
          placement === "top" ? "top-end" : align === "end" ? "bottom-end" : "bottom-start"
        }
        panelLabel={opponent ? "Rival zone inventory" : "Player zone inventory"}
        scrollTarget={scrollTarget}
      >
        <div className={classes.zoneInventoryPanel}>
          <section className={classes.zoneInventoryItem} data-zone-inventory-section="deck">
            <header>
              <span>Deck</span>
              <strong>{zones.deckCount}</strong>
            </header>
            <div className={classes.popoverZone}>
              <DeckZone
                count={zones.deckCount}
                opponent={opponent}
                side={side}
                reveal={deckReveal}
              />
            </div>
          </section>
          <section className={classes.zoneInventoryItem} data-zone-inventory-section="trash">
            <header>
              <span>Trash</span>
              <strong>{zones.trashCount}</strong>
            </header>
            <div className={classes.popoverZone}>
              <TrashZone
                topCard={zones.trashTop ?? undefined}
                cards={zones.trash}
                opponent={opponent}
                side={side}
                count={zones.trashCount}
                onOpen={onOpenTrash}
              />
            </div>
          </section>
          <section
            className={classes.zoneInventoryItem}
            data-zone-inventory-section="fixer"
            data-testid="fixer-zone"
          >
            <header>
              <span>Fixer</span>
              <strong>{fixer.value}</strong>
            </header>
            <p>{fixer.detail}</p>
            <div className={classes.popoverFixerGrid} aria-label={`Fixer dice: ${fixer.detail}`}>
              {fixerSlots.map((slot) => (
                <span
                  key={slot.dieType}
                  className={classes.popoverFixerDie}
                  data-active={slot.active ? "true" : "false"}
                >
                  {slot.label}
                </span>
              ))}
            </div>
          </section>
          <section className={classes.zoneInventoryItem} data-zone-inventory-section="eddies">
            <header>
              <span>Eddies</span>
              <strong>
                {eddies.availableCount}/{eddies.totalCount}
              </strong>
            </header>
            {lastSoldDetail ? <p>{lastSoldDetail}</p> : null}
            <div className={`${classes.popoverZone} ${classes.popoverZoneEddies}`}>
              <EddiesZone {...eddies} opponent={opponent} side={side} />
            </div>
            {sellArrivalKey ? (
              <span key={sellArrivalKey} className={classes.fieldHelperRewardPulse}>
                +1
              </span>
            ) : null}
          </section>
        </div>
      </MobileZoneInventoryPopover>
      {sellDropReady ? (
        <div className={classes.fieldHelperSellCue} aria-hidden="true">
          <span>Drop to sell</span>
          <strong>+1 Eddie</strong>
        </div>
      ) : null}
    </div>
  );
}

function CyberpunkZoneSummaryBar({
  zones,
  eddies,
  side,
  lastSoldCard,
  deckReveal,
  sellArrivalKey,
  opponent = false,
  onOpenTrash,
}: CyberpunkZoneInventoryProps) {
  const fixer = fixerSummary(zones);
  const availableFixerSlots = fixerSummarySlots(zones).filter((slot) => slot.active);
  const scrollTarget: ZoneInventorySection = "deck";
  const toneClass = opponent ? classes.zoneSummaryRival : classes.zoneSummaryPlayer;
  const summaryLabel = (
    <span className={classes.zoneSummaryLabel}>
      <span className={classes.zoneSummaryChip}>
        <span>Hand</span>
        <strong>{zones.hand.length}</strong>
      </span>
      <span className={classes.zoneSummaryChip}>
        <span>Deck</span>
        <strong>{zones.deckCount}</strong>
      </span>
      <span className={classes.zoneSummaryChip}>
        <span>Trash</span>
        <strong>{zones.trashCount}</strong>
      </span>
      <span className={`${classes.zoneSummaryChip} ${classes.zoneSummaryFixerChip}`}>
        <span className={classes.zoneSummaryMain}>
          <span>Fixer</span>
          <strong>{fixer.value}</strong>
        </span>
        <span className={classes.zoneSummaryFixerDice} aria-hidden="true">
          {availableFixerSlots.map((slot) => (
            <span
              key={slot.dieType}
              className={classes.zoneSummaryFixerDie}
              data-die-type={slot.dieType}
              data-testid="zone-summary-fixer-die"
            >
              {slot.label}
            </span>
          ))}
        </span>
      </span>
      <span className={classes.zoneSummaryChip}>
        <span>Eddies</span>
        <strong>
          {eddies.availableCount}/{eddies.totalCount}
        </strong>
      </span>
    </span>
  );

  return (
    <div
      className={`${classes.zoneSummaryBar} ${toneClass}`}
      data-side={opponent ? "rival" : "player"}
      data-testid={opponent ? "rival-zone-summary-bar" : "player-zone-summary-bar"}
      aria-label={
        opponent
          ? `Rival zones. Hand ${zones.hand.length}. Deck ${zones.deckCount}. Trash ${zones.trashCount}. Fixer ${fixer.value}: ${fixer.detail}. Eddies ${eddies.availableCount} of ${eddies.totalCount}.`
          : `Your zones. Hand ${zones.hand.length}. Deck ${zones.deckCount}. Trash ${zones.trashCount}. Fixer ${fixer.value}: ${fixer.detail}. Eddies ${eddies.availableCount} of ${eddies.totalCount}.`
      }
    >
      <CyberpunkZoneInventory
        zones={zones}
        eddies={eddies}
        side={side}
        lastSoldCard={lastSoldCard}
        deckReveal={deckReveal}
        sellArrivalKey={sellArrivalKey}
        opponent={opponent}
        placement={opponent ? "bottom" : "top"}
        align={opponent ? "end" : "start"}
        label={summaryLabel}
        scrollTarget={scrollTarget}
        onOpenTrash={onOpenTrash}
      />
    </div>
  );
}

function CyberpunkMobileLedgerContent({
  rivalLegends,
  rivalLegendCount,
  friendlyLegends,
  friendlyLegendCount,
  density,
  rivalLayout,
  friendlyLayout,
}: {
  rivalLegends: ReactNode;
  rivalLegendCount?: number;
  friendlyLegends: ReactNode;
  friendlyLegendCount?: number;
  density: MobileLedgerDensity;
  rivalLayout: MobileLedgerSideLayout;
  friendlyLayout: MobileLedgerSideLayout;
}) {
  return (
    <CenterRow
      mobileLedger={{
        rivalLegends,
        rivalLegendCount,
        rivalLayout,
        friendlyLegends,
        friendlyLegendCount,
        friendlyLayout,
        density,
      }}
    />
  );
}

type MobileLedgerDensity = "scoreOnly" | "singleRow" | "twoLegend" | "stacked";
type MobileLedgerSideLayout = "scoreOnly" | "singleRow" | "twoLegend" | "stacked";

function mobileLedgerDensity(maxLegendCount: number): MobileLedgerDensity {
  if (maxLegendCount <= 0) {
    return "scoreOnly";
  }
  if (maxLegendCount === 1) {
    return "singleRow";
  }
  if (maxLegendCount === 2) {
    return "twoLegend";
  }
  return "stacked";
}

function mobileLedgerSideLayout(legendCount: number): MobileLedgerSideLayout {
  if (legendCount <= 0) {
    return "scoreOnly";
  }
  if (legendCount === 1) {
    return "singleRow";
  }
  if (legendCount === 2) {
    return "twoLegend";
  }
  return "stacked";
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

function MobileClockChip({ side, label }: { side: Side; label: string }) {
  const { prioritySide, turnNumber, phase, gameEnded, overtimeActive } = useGameState();
  const clock = useGameClock(prioritySide, { paused: gameEnded });
  const { humanSide } = useEngine();
  const time = clock[side];
  const tone = side === humanSide ? "friendly" : "rival";

  return (
    <div
      className={`${classes.mobileClockChip} ${clock.active.urgent ? classes.mobileClockRailUrgent : ""} ${
        clock.active.critical ? classes.mobileClockRailCritical : ""
      }`}
      data-overtime={overtimeActive ? "true" : "false"}
      aria-label={`${label} clock ${time.time}. Turn ${turnNumber}, ${phase}${
        overtimeActive ? ", overtime" : ""
      }${prioritySide === side ? ", active priority" : ""}.`}
    >
      {overtimeActive ? <span className={classes.overtimeChip}>OT</span> : null}
      <ClockPill
        ariaLabel={`${label} clock`}
        time={time.time}
        active={prioritySide === side}
        tone={tone}
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

function RotateToPlayGate({
  humanIdentity,
  rivalIdentity,
  humanConnection,
  rivalConnection,
}: {
  humanIdentity?: PlayerIdentityBySide[Side];
  rivalIdentity?: PlayerIdentityBySide[Side];
  humanConnection?: PlayerConnectionBySide[Side];
  rivalConnection?: PlayerConnectionBySide[Side];
}) {
  const { humanSide } = useEngine();
  const rivalSide = otherSide(humanSide);
  const { prioritySide, turnNumber, phase, gameEnded } = useGameState();
  const clock = useGameClock(prioritySide, { paused: gameEnded });
  const humanStatus = connectionUiStatus(humanConnection);
  const rivalStatus = connectionUiStatus(rivalConnection);

  return (
    <section className={classes.rotateGate}>
      <div className={classes.rotateGateFrame}>
        <header className={classes.rotateGateHeader}>
          <div className={classes.rotateGateStatus}>
            <span
              className={classes.connectionDot}
              data-status={humanStatus === "connected" ? undefined : humanStatus}
              aria-hidden="true"
            />
            <span>{humanStatus === "connected" ? "Connected" : humanStatus}</span>
          </div>
          <div className={classes.rotateGateUtilities} aria-label="Landscape utility actions">
            <UserConfigButton />
            <a
              className={classes.rotateGateIconButton}
              href="/report-player"
              aria-label="Report player"
              title="Report player"
            >
              <IconFlag3 size={16} stroke={2.2} aria-hidden="true" />
            </a>
          </div>
        </header>

        <div className={classes.rotateGateHero}>
          <div className={classes.rotatePhone} aria-hidden="true">
            <span className={classes.rotatePhoneScreen} />
          </div>
          <div className={classes.rotateGateCopy}>
            <p className={classes.rotateGateKicker}>Cyberpunk TCG</p>
            <h1>Rotate to play</h1>
            <p>{ROTATE_GATE_MESSAGE}</p>
          </div>
        </div>

        <div className={classes.rotateMatchPanel} aria-label="Current match status">
          <div className={classes.rotatePlayerRow} data-side="rival">
            <span
              className={classes.connectionDot}
              data-status={rivalStatus === "connected" ? undefined : rivalStatus}
              aria-hidden="true"
            />
            <div>
              <strong>{rivalIdentity?.displayName ?? "Rival"}</strong>
              <span>{prioritySide === rivalSide ? "Priority" : "Waiting"}</span>
            </div>
            <b>{clock[rivalSide].time}</b>
          </div>
          <div className={classes.rotateMatchCore}>
            <span>Turn {turnNumber}</span>
            <strong>{phase}</strong>
          </div>
          <div className={classes.rotatePlayerRow} data-side="player">
            <span
              className={classes.connectionDot}
              data-status={humanStatus === "connected" ? undefined : humanStatus}
              aria-hidden="true"
            />
            <div>
              <strong>{humanIdentity?.displayName ?? "You"}</strong>
              <span>{prioritySide === humanSide ? "Priority" : "Waiting"}</span>
            </div>
            <b>{clock[humanSide].time}</b>
          </div>
        </div>
      </div>
    </section>
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

function MobileAiRailControl({ onOpen }: { onOpen: () => void }) {
  const engine = useEngine();
  const defaultAiSide: Side = otherSide(engine.humanSide);
  const isTakeover = engine.aiTakeover !== null;
  const nextAiSide =
    (["player", "opponent"] as const).find((side) => {
      if (!engine.aiStrategies[side]) {
        return false;
      }
      const view = engine.interactionViews[side];
      return (
        view.status === "choosing" ||
        (view.status === "ready" && view.actions.some((action) => action.enabled))
      );
    }) ?? null;
  const controlledSide = engine.aiTakeover?.side ?? nextAiSide ?? defaultAiSide;
  const aiInteractionView = useEngineInteractionView(controlledSide);
  const aiStrategy = engine.aiTakeover?.strategy ?? engine.aiStrategies[controlledSide];
  const status = resolveAiStatus({
    gameEnded: engine.matchState.G.gameEnded,
    lastError: engine.lastAiError,
    mode: engine.aiMode,
    humanSide: engine.humanSide,
    aiSide: controlledSide,
    hasStrategy: aiStrategy !== null && !isTakeover,
    aiInteractionView,
  });
  const canToggle = aiStrategy !== null && !engine.matchState.G.gameEnded;
  const badge =
    engine.aiMode === "auto"
      ? "AUTO"
      : status === "error"
        ? "ERROR"
        : status === "you-control"
          ? "YOU"
          : "PAUSED";
  const label =
    status === "thinking"
      ? "Bot running"
      : status === "paused"
        ? "Bot paused"
        : status === "waiting"
          ? engine.aiMode === "auto"
            ? "Bot waiting"
            : "Ready to resume"
          : status === "you-control"
            ? "You drive"
            : status === "done"
              ? "Match ended"
              : "Check bot";
  const ActionIcon = engine.aiMode === "auto" ? IconPlayerPause : IconPlayerPlay;

  return (
    <div className={classes.smartAiControl} data-status={status} data-mode={engine.aiMode}>
      <button
        type="button"
        className={classes.smartAiOpen}
        aria-label="Open AI controls"
        title="Open AI controls"
        onClick={onOpen}
      >
        <IconRobot size={15} stroke={2.2} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={classes.smartAiPrimary}
        aria-label={
          canToggle
            ? engine.aiMode === "auto"
              ? `Pause bot automation. ${label}.`
              : `Resume bot automation. ${label}.`
            : `AI status. ${label}.`
        }
        title={canToggle ? label : "Open AI controls"}
        onClick={() => {
          if (!canToggle) {
            onOpen();
            return;
          }
          engine.setAiMode(engine.aiMode === "auto" ? "step" : "auto");
        }}
      >
        <ActionIcon size={14} stroke={2.2} aria-hidden="true" />
        <span className={classes.smartAiText}>
          <strong>{label}</strong>
          <span>{badge}</span>
        </span>
      </button>
    </div>
  );
}

interface MobileHumanMatchModel {
  self: LiveMatchSidebarParticipant;
  opponent: LiveMatchSidebarParticipant;
  opponentSide: Side;
  opponentConnection?: PlayerConnectionBySide[Side];
}

function MobilePlayerActions({
  config,
  model,
  focus,
  opponentTimeoutExpired,
  onConcede,
  onClaimRivalDrop,
  onClose,
}: {
  config: LiveMatchSidebarConfig;
  model: MobileHumanMatchModel;
  focus: "self" | "opponent";
  opponentTimeoutExpired: boolean;
  onConcede: () => void;
  onClaimRivalDrop?: () => void;
  onClose: () => void;
}) {
  const { matchState } = useEngine();
  const opponentPresence = useOpponentPresence(model.opponentConnection);
  const [friendState, setFriendState] = useState<"idle" | "loading" | "done">("idle");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] =
    useState<(typeof MOBILE_REPORT_REASONS)[number]["value"]>("stalling");
  const [reportDetails, setReportDetails] = useState("");
  const [reportState, setReportState] = useState<"idle" | "loading" | "done">("idle");
  const [supportDialog, setSupportDialog] = useState<MobileSupportDialog | null>(null);
  const [supportText, setSupportText] = useState("");
  const [supportState, setSupportState] = useState<"idle" | "loading">("idle");
  const canAddFriend = Boolean(model.opponent.userId);
  const opponentDisconnected = isConnectionDisconnected(model.opponentConnection);
  const canDropOpponent = Boolean(
    onClaimRivalDrop && (opponentPresence.canDrop || opponentTimeoutExpired),
  );
  const showDropControl = Boolean(
    onClaimRivalDrop && (opponentDisconnected || opponentTimeoutExpired),
  );
  const dropStatusText = opponentTimeoutExpired
    ? "Clock expired. Server validates timeout before the game ends."
    : opponentPresence.canDrop
      ? "Opponent disconnected long enough to drop."
      : opponentDisconnected
        ? `Drop available in ${opponentPresence.secondsRemaining}s.`
        : null;
  const focusedParticipant = focus === "self" ? model.self : model.opponent;

  async function addOpponentFriend(): Promise<void> {
    if (!model.opponent.userId || friendState === "loading" || friendState === "done") {
      return;
    }
    setFriendState("loading");
    try {
      const response = await fetch(
        apiUrl("platform", `/friends/by-user/${encodeURIComponent(model.opponent.userId)}`),
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            matchId: config.matchId,
            gameId: config.gameId,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(await readMobileResponseMessage(response, "Could not add friend."));
      }
      setFriendState("done");
      notifications.show({
        color: "green",
        title: "Friend added",
        message: `${model.opponent.displayName} is now in your friends list.`,
      });
    } catch (error) {
      setFriendState("idle");
      notifications.show({
        color: "red",
        title: "Friend request failed",
        message: error instanceof Error ? error.message : "Could not add friend.",
      });
    }
  }

  function openSupportDialog(kind: MobileSupportDialog): void {
    setSupportDialog(kind);
    setSupportText("");
    setSupportState("idle");
  }

  async function submitSupport(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!supportDialog || supportState === "loading" || supportText.trim().length === 0) {
      return;
    }

    const text = supportText.trim();
    setSupportState("loading");
    try {
      const isBug = supportDialog === "bug";
      const response = await fetch(
        apiUrl("platform", isBug ? "/feedback/bug-reports" : "/feedback"),
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: isBug
            ? JSON.stringify({
                description: text,
                source: "cyberpunk-live-match-sidebar",
                context: {
                  gameId: config.gameId,
                  gameSlug: "cyberpunk",
                  matchId: config.matchId,
                  stateVersion: matchState.ctx.stateID,
                  turn: matchState.G.turnMetadata.turnNumber,
                  platform: "mobile",
                },
              })
            : JSON.stringify({
                message: supportDialog === "feature" ? `Feature request: ${text}` : text,
                source: "cyberpunk-live-match-sidebar",
              }),
        },
      );
      if (!response.ok) {
        throw new Error(
          await readMobileResponseMessage(response, "Could not send this right now."),
        );
      }
      notifications.show({
        color: "green",
        title: MOBILE_SUPPORT_COPY[supportDialog].successTitle,
        message: "Thanks. The team will review it.",
      });
      setSupportDialog(null);
      setSupportText("");
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Support request failed",
        message: error instanceof Error ? error.message : "Could not send this right now.",
      });
    } finally {
      setSupportState("idle");
    }
  }

  async function submitReport(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (reportState === "loading") {
      return;
    }
    setReportState("loading");
    try {
      const response = await fetch(apiUrl("platform", "/moderation/player-reports"), {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reportedGameProfileId: model.opponent.id,
          matchId: config.matchId,
          gameId: config.gameId,
          reason: reportReason,
          details: reportDetails.trim() || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error(await readMobileResponseMessage(response, "Could not submit report."));
      }
      setReportState("done");
      setReportOpen(false);
      notifications.show({
        color: "green",
        title: "Report submitted",
        message: "Thanks. Moderators will review this match.",
      });
    } catch (error) {
      setReportState("idle");
      notifications.show({
        color: "red",
        title: "Report failed",
        message: error instanceof Error ? error.message : "Could not submit report.",
      });
    }
  }

  return (
    <div className={classes.mobileActionsPanel} data-testid="mobile-player-actions">
      <section className={classes.mobileActionsHero}>
        <span>{focus === "self" ? "You" : "Opponent"}</span>
        <strong>{focusedParticipant.displayName}</strong>
        <small>
          Seat {focusedParticipant.seat}
          {focusedParticipant.deckName ? ` · ${focusedParticipant.deckName}` : ""}
        </small>
      </section>

      <div className={classes.mobileActionGrid} role="menu" aria-label="Player actions">
        {focus === "self" ? (
          <>
            <div className={classes.mobileActionControl} role="menuitem">
              <UserConfigButton />
            </div>
            <button type="button" role="menuitem" data-danger="true" onClick={onConcede}>
              <IconFlag3 size={16} stroke={2.2} aria-hidden="true" />
              <span>Concede game</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              role="menuitem"
              onClick={() => void addOpponentFriend()}
              disabled={!canAddFriend || friendState === "loading" || friendState === "done"}
            >
              <IconUserPlus size={16} stroke={2.2} aria-hidden="true" />
              <span>
                {friendState === "done"
                  ? "Friend added"
                  : friendState === "loading"
                    ? "Adding..."
                    : "Add friend"}
              </span>
            </button>
            <button
              type="button"
              role="menuitem"
              data-danger="true"
              onClick={() => {
                setReportOpen((open) => !open);
                setSupportDialog(null);
              }}
            >
              <IconFlag3 size={16} stroke={2.2} aria-hidden="true" />
              <span>Report player</span>
            </button>
          </>
        )}
        <button type="button" role="menuitem" onClick={() => openSupportDialog("bug")}>
          <IconBug size={16} stroke={2.2} aria-hidden="true" />
          <span>Report bug</span>
        </button>
        <button type="button" role="menuitem" onClick={() => openSupportDialog("feature")}>
          <IconBulb size={16} stroke={2.2} aria-hidden="true" />
          <span>Request feature</span>
        </button>
        <button type="button" role="menuitem" onClick={() => openSupportDialog("feedback")}>
          <IconMessageCircle size={16} stroke={2.2} aria-hidden="true" />
          <span>Share feedback</span>
        </button>
        {focus === "opponent" ? (
          showDropControl ? (
            <button
              type="button"
              role="menuitem"
              data-danger="true"
              onClick={onClaimRivalDrop}
              disabled={!canDropOpponent}
              title={dropStatusText ?? undefined}
            >
              <IconPlayerPlay size={16} stroke={2.2} aria-hidden="true" />
              <span>Drop opponent</span>
            </button>
          ) : null
        ) : null}
        {config.returnUrl ? (
          <a role="menuitem" href={config.returnUrl} onClick={onClose}>
            <IconPlayerPause size={16} stroke={2.2} aria-hidden="true" />
            <span>Matchmaking</span>
          </a>
        ) : null}
      </div>
      {focus === "opponent" && dropStatusText ? (
        <p className={classes.mobileDropStatus}>{dropStatusText}</p>
      ) : null}

      {focus === "opponent" && reportOpen ? (
        <form className={classes.mobileActionForm} onSubmit={submitReport}>
          <header>
            <strong>Report {model.opponent.displayName}</strong>
            <span>{reportState === "done" ? "Submitted" : "Moderators review match context."}</span>
          </header>
          <label>
            <span>Reason</span>
            <select
              value={reportReason}
              onChange={(event) =>
                setReportReason(event.currentTarget.value as typeof reportReason)
              }
            >
              {MOBILE_REPORT_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Details</span>
            <textarea
              value={reportDetails}
              onChange={(event) => setReportDetails(event.currentTarget.value)}
              maxLength={2000}
              rows={4}
              placeholder="What happened?"
            />
          </label>
          <div className={classes.mobileActionFormButtons}>
            <button type="button" onClick={() => setReportOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={reportState === "loading"}>
              {reportState === "loading" ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>
      ) : null}

      {supportDialog ? (
        <form className={classes.mobileActionForm} onSubmit={submitSupport}>
          <header>
            <strong>{MOBILE_SUPPORT_COPY[supportDialog].title}</strong>
            <span>{MOBILE_SUPPORT_COPY[supportDialog].description}</span>
          </header>
          <label>
            <span>{supportDialog === "bug" ? "Description" : "Message"}</span>
            <textarea
              value={supportText}
              onChange={(event) => setSupportText(event.currentTarget.value)}
              maxLength={supportDialog === "bug" ? 5000 : 2000}
              rows={5}
              placeholder={MOBILE_SUPPORT_COPY[supportDialog].placeholder}
            />
          </label>
          <div className={classes.mobileActionFormButtons}>
            <button type="button" onClick={() => setSupportDialog(null)}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={supportState === "loading" || supportText.trim().length === 0}
            >
              {supportState === "loading" ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function resolveMobileHumanMatch(
  config: LiveMatchSidebarConfig | undefined,
  connections: PlayerConnectionBySide | undefined,
): MobileHumanMatchModel | null {
  if (!config || config.participants.length < 2) {
    return null;
  }
  const local = config.localPlayerId
    ? config.participants.find(
        (participant) =>
          participant.id === config.localPlayerId || participant.userId === config.localPlayerId,
      )
    : null;
  if (!local || !isMobileRealHumanParticipant(local)) {
    return null;
  }
  const opponent = config.participants.find(
    (participant) => participant.id !== local.id && isMobileRealHumanParticipant(participant),
  );
  if (!opponent) {
    return null;
  }
  const opponentSide = mobileSideForSeat(opponent.seat);
  return {
    self: local,
    opponent,
    opponentSide,
    opponentConnection: connections?.[opponentSide],
  };
}

function isMobileRealHumanParticipant(participant: LiveMatchSidebarParticipant): boolean {
  return Boolean(
    participant.userId &&
    !participant.userId.startsWith("bot_") &&
    !participant.userId.startsWith("guest_"),
  );
}

function mobileSideForSeat(seat: 1 | 2): Side {
  return seat === 1 ? "player" : "opponent";
}

async function readMobileResponseMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as {
      message?: string;
      error?: { message?: string } | string;
    };
    if (typeof payload.error === "object" && payload.error?.message) {
      return payload.error.message;
    }
    if (payload.message) {
      return payload.message;
    }
    if (typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    // Keep the caller's fallback when the response body is not JSON.
  }
  return fallback;
}

function MobileRailIdentity({
  identity,
  meta,
  fallback,
}: {
  identity?: PlayerIdentityBySide[Side];
  meta: string;
  fallback: string;
}) {
  return (
    <>
      <span className={classes.connectionDot} aria-hidden="true" />
      <div className={classes.opponentIdentityText}>
        <strong
          data-subscriber={
            isVisibleSubscriptionTier(identity?.subscriptionTier) ? "true" : undefined
          }
        >
          {identity?.displayName ?? fallback}
        </strong>
        {meta ? <span>{meta}</span> : null}
      </div>
    </>
  );
}

export function MobileBoard({
  playerIdentities,
  playerConnections,
  onClaimRivalDrop,
  liveMatchSidebar,
}: {
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  liveMatchSidebar?: LiveMatchSidebarConfig;
}) {
  const { dispatch, humanSide, moveLogs, matchState } = useEngine();
  const { fieldCardSize } = useUserConfig();
  const { activeSide, prioritySide, phase, gameEnded, winnerSide, winReason } = useGameState();
  const rivalSide = otherSide(humanSide);
  const [drawer, setDrawer] = useState<DrawerKey>(null);
  const [actionFocus, setActionFocus] = useState<"self" | "opponent">("opponent");
  const [confirmingConcede, setConfirmingConcede] = useState(false);
  const [trashViewerSide, setTrashViewerSide] = useState<Side | null>(null);
  const [promptPlacement, setPromptPlacement] = useState<"player" | "rival">("player");
  const close = () => setDrawer(null);
  const human = useSideZones(humanSide);
  const rival = useSideZones(rivalSide);
  const rivalRevealedHandCardIds = useTemporaryRevealedHandCardIds(
    rivalSide,
    rival.hand.map((card) => card.cardId),
  );
  const humanIdentity = playerIdentities?.[humanSide];
  const rivalIdentity = playerIdentities?.[rivalSide];
  const humanIdentityMeta = formatPlayerIdentityMeta(humanIdentity);
  const rivalIdentityMeta = formatPlayerIdentityMeta(rivalIdentity);
  const rivalClaimAvailable = isConnectionDisconnected(playerConnections?.[rivalSide]);
  const humanConnectionStatus = connectionUiStatus(playerConnections?.[humanSide]);
  const rivalConnectionStatus = connectionUiStatus(playerConnections?.[rivalSide]);
  const clock = useGameClock(prioritySide, { paused: gameEnded });
  const rivalTimeoutExpired = Boolean(
    onClaimRivalDrop &&
    !gameEnded &&
    humanConnectionStatus === "connected" &&
    rivalConnectionStatus === "connected" &&
    clock[rivalSide].seconds <= 0,
  );
  const humanLastSold = useLastSoldCardForSide(moveLogs, humanSide);
  const rivalLastSold = useLastSoldCardForSide(moveLogs, rivalSide);
  const humanDeckReveal = useDeckRevealForSide(humanSide);
  const rivalDeckReveal = useDeckRevealForSide(rivalSide);
  const humanEddies = eddieCounts(human, humanLastSold?.cardId);
  const rivalEddies = eddieCounts(rival, rivalLastSold?.cardId);
  const humanLastSoldView = human.eddieCards.find((card) => card.cardId === humanLastSold?.cardId);
  const rivalLastSoldView = rival.eddieCards.find((card) => card.cardId === rivalLastSold?.cardId);
  const promptMode = useBoardMode(humanSide);
  const promptActive = promptMode !== "view";
  const mobileHumanMatch = useMemo(
    () => resolveMobileHumanMatch(liveMatchSidebar, playerConnections),
    [liveMatchSidebar, playerConnections],
  );
  const togglePromptPlacement = () => {
    setPromptPlacement((current) => (current === "player" ? "rival" : "player"));
  };
  const turnNumber = matchState.G.turnMetadata.turnNumber;
  const trashViewerZones = trashViewerSide === rivalSide ? rival : human;
  const trashViewerOpponent = trashViewerSide === rivalSide;
  const trashViewerOwnerId = String(
    PLAYER_SIDE_TO_ID[trashViewerSide === rivalSide ? rivalSide : humanSide],
  );
  const trashViewerZoneId = trashViewerOpponent ? "opp-trash" : "p-trash";
  const trashViewerFilter = useMemo<SimulatorTargetFilter>(
    () => ({
      kind: "entity",
      entityKind: "card",
      ownerId: trashViewerOwnerId,
      zoneId: trashViewerZoneId,
      includeHidden: true,
    }),
    [trashViewerOwnerId, trashViewerZoneId],
  );
  const trashViewerTable = useMemo<SimulatorTable>(
    () => buildTrashViewerTable(trashViewerOwnerId, trashViewerZoneId, trashViewerZones.trash),
    [trashViewerOwnerId, trashViewerZoneId, trashViewerZones.trash],
  );
  const trashViewerEntities = useMemo<SimulatorEntity[]>(
    () =>
      trashViewerZones.trash.map((card) =>
        trashCardToSimulatorEntity(card, trashViewerOwnerId, trashViewerZoneId),
      ),
    [trashViewerOwnerId, trashViewerZoneId, trashViewerZones.trash],
  );
  const trashViewerCardsById = useMemo(
    () => new Map(trashViewerZones.trash.map((card) => [card.cardId, card])),
    [trashViewerZones.trash],
  );
  const humanPeekedLegends = usePeekedLegendsForSide(moveLogs, humanSide, turnNumber);
  const rivalPeekedLegends = usePeekedLegendsForSide(moveLogs, rivalSide, turnNumber);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const topSectionRef = useRef<HTMLDivElement | null>(null);
  const bottomSectionRef = useRef<HTMLDivElement | null>(null);
  const rivalFieldBandRef = useRef<HTMLDivElement | null>(null);
  const humanFieldBandRef = useRef<HTMLDivElement | null>(null);
  const rivalFieldOverflow = useFieldOverflow(rivalFieldBandRef, rival.field.length);
  const humanFieldOverflow = useFieldOverflow(humanFieldBandRef, human.field.length);
  const topSectionWidth = useElementWidth(topSectionRef);
  const bottomSectionWidth = useElementWidth(bottomSectionRef);
  const [rivalHandMeasurement, setRivalHandMeasurement] = useState<MobileHandMeasurement | null>(
    null,
  );
  const [humanHandMeasurement, setHumanHandMeasurement] = useState<MobileHandMeasurement | null>(
    null,
  );
  const measureRivalHand = useCallback((measurement: MobileHandMeasurement) => {
    setRivalHandMeasurement((current) =>
      sameHandMeasurement(current, measurement) ? current : measurement,
    );
  }, []);
  const measureHumanHand = useCallback((measurement: MobileHandMeasurement) => {
    setHumanHandMeasurement((current) =>
      sameHandMeasurement(current, measurement) ? current : measurement,
    );
  }, []);
  const dockRivalHelpers =
    promptMode !== "select-target" &&
    canDockHandHelper(rivalHandMeasurement, topSectionWidth, rival.legendArea.length);
  const dockHumanHelpers =
    promptMode !== "select-target" &&
    canDockHandHelper(humanHandMeasurement, bottomSectionWidth, human.legendArea.length);
  const phoneLandscapeGate =
    useMediaQuery(
      "(orientation: landscape) and (max-height: 520px) and (max-width: 900px)",
      false,
    ) ?? false;
  const eventLogEntries = useMemo(
    () => projectMoveLogEntries(matchState, moveLogs, humanSide).slice(-MOBILE_EVENT_LOG_ENTRY_CAP),
    [humanSide, matchState, moveLogs],
  );
  const eventLogCopyText = useMemo(
    () => formatCyberpunkEventLogReadableCopy(eventLogEntries),
    [eventLogEntries],
  );
  const rawEventLogCopyText = useMemo(
    () => formatCyberpunkEventLogRawCopy(eventLogEntries, moveLogs),
    [eventLogEntries, moveLogs],
  );
  const openPlayerActions = (focus: "self" | "opponent") => {
    setActionFocus(focus);
    setDrawer("actions");
  };
  const requestConcede = () => {
    close();
    setConfirmingConcede(true);
  };

  if (phoneLandscapeGate) {
    return (
      <RotateToPlayGate
        humanIdentity={humanIdentity}
        rivalIdentity={rivalIdentity}
        humanConnection={playerConnections?.[humanSide]}
        rivalConnection={playerConnections?.[rivalSide]}
      />
    );
  }

  const rivalLedgerLegends = legendsOf(rival.legendArea, rivalPeekedLegends);
  const friendlyLedgerLegends = legendsOf(human.legendArea, humanPeekedLegends);
  const ledgerDensity = mobileLedgerDensity(
    Math.max(rivalLedgerLegends.length, friendlyLedgerLegends.length),
  );
  const rivalLedgerLayout = mobileLedgerSideLayout(rivalLedgerLegends.length);
  const friendlyLedgerLayout = mobileLedgerSideLayout(friendlyLedgerLegends.length);
  const rivalFieldUnits = fieldUnitsOf(rival.field);
  const friendlyFieldUnits = fieldUnitsOf(human.field);
  const rivalFieldCount = rivalFieldUnits.length;
  const friendlyFieldCount = friendlyFieldUnits.length;
  const fieldBalance = promptActive
    ? activeSide === humanSide
      ? "player"
      : "opponent"
    : friendlyFieldCount > 0 && rivalFieldCount === 0
      ? "player"
      : rivalFieldCount > 0 && friendlyFieldCount === 0
        ? "opponent"
        : "even";

  return (
    <>
      <MobilePortraitBoard
        ref={boardRef}
        className={classes.root}
        data-testid="mobile-cyberpunk-board"
        data-prompt-placement={promptActive ? promptPlacement : undefined}
        data-prompt-mode={promptActive ? promptMode : undefined}
        data-side={humanSide}
        data-active-side={activeSide}
        data-phase={phase}
        data-ledger-density={ledgerDensity}
        data-field-balance={fieldBalance}
        data-game-status={gameEnded ? "ended" : "active"}
        data-field-card-size={fieldCardSize}
        data-winner={
          gameEnded
            ? winnerSide
              ? winnerSide === humanSide
                ? "you"
                : "rival"
              : "draw"
            : undefined
        }
        data-end-reason={gameEnded ? (winReason ?? undefined) : undefined}
        promptActive={promptActive}
        overlays={<CombatArrowOverlay containerRef={boardRef} />}
        topRail={
          <MobilePlayerRail
            side="opponent"
            className={classes.mobileTopRail}
            left={
              <div className={classes.gameControls}>
                <button
                  type="button"
                  className={classes.gameControlButton}
                  aria-label="Logs"
                  title="Logs"
                  onClick={() => setDrawer("logs")}
                >
                  <IconHistory size={15} stroke={2.2} aria-hidden="true" />
                  <span className={classes.gameControlLabel}>Logs</span>
                </button>
                <button
                  type="button"
                  className={classes.gameControlButton}
                  aria-label="Chat"
                  title="Chat"
                  onClick={() => setDrawer("chat")}
                >
                  <IconMessageCircle size={15} stroke={2.2} aria-hidden="true" />
                  <span className={classes.gameControlLabel}>Chat</span>
                </button>
                <div className={classes.settingsControl}>
                  <UserConfigButton />
                </div>
                {mobileHumanMatch && liveMatchSidebar ? (
                  <button
                    type="button"
                    className={classes.gameControlButton}
                    aria-label="Player actions"
                    title="Player actions"
                    onClick={() => openPlayerActions("opponent")}
                  >
                    <IconDotsVertical size={15} stroke={2.2} aria-hidden="true" />
                    <span className={classes.gameControlLabel}>Actions</span>
                  </button>
                ) : (
                  <MobileAiRailControl onOpen={() => setDrawer("ai")} />
                )}
              </div>
            }
            center={<MobileClockChip side={rivalSide} label="Rival" />}
            right={
              mobileHumanMatch ? (
                <button
                  type="button"
                  className={`${classes.opponentIdentity} ${classes.playerInfoButton}`}
                  aria-label={`Open actions for ${rivalIdentity?.displayName ?? "opponent"}`}
                  aria-haspopup="dialog"
                  onClick={() => openPlayerActions("opponent")}
                >
                  <MobileRailIdentity
                    identity={rivalIdentity}
                    meta={rivalIdentityMeta}
                    fallback="Rival"
                  />
                </button>
              ) : (
                <div className={classes.opponentIdentity} aria-label="Opponent status">
                  <MobileRailIdentity
                    identity={rivalIdentity}
                    meta={rivalIdentityMeta}
                    fallback="Rival"
                  />
                  <a
                    className={classes.reportPlayerButton}
                    href="/report-player"
                    aria-label="Report player"
                    title="Report player"
                  >
                    <IconFlag3 size={14} stroke={2.1} aria-hidden="true" />
                  </a>
                </div>
              )
            }
          />
        }
        opponentHand={
          <div
            className={`${classes.handBand} ${classes.opp} ${classes.topHandBand}`}
            data-dock-helpers={dockRivalHelpers ? "true" : "false"}
          >
            <MobileHandZone
              faceDown
              onMeasure={measureRivalHand}
              cards={rival.hand.map((c) => ({
                imageUrl: c.imageUrl,
                name: c.name,
                cardId: c.cardId,
                definitionId: c.definitionId,
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
                temporaryRevealed: rivalRevealedHandCardIds.has(c.cardId),
              }))}
              cardCount={rival.hand.length}
              side={rivalSide}
            />
          </div>
        }
        opponentZoneSummary={
          <CyberpunkZoneSummaryBar
            zones={rival}
            eddies={rivalEddies}
            side={rivalSide}
            lastSoldCard={rivalLastSold}
            deckReveal={rivalDeckReveal}
            sellArrivalKey={rivalLastSold?.id}
            onOpenTrash={() => setTrashViewerSide(rivalSide)}
            opponent
          />
        }
        opponentBattlefield={
          <MobileBattlefieldLane
            className={`${classes.fieldBand} ${classes.opponentFieldBand} ${classes.opp}`}
            side="opponent"
            priority={prioritySide === rivalSide}
            scrollTargetSelector='[data-testid="field-cards"]'
            scrollCueLabel="rival field cards"
            scrollCues={rivalFieldOverflow}
          >
            <FieldZone units={rivalFieldUnits} opponent side={rivalSide} scrollAxis="horizontal" />
            <OpponentDisconnectOverlay
              variant="opponent"
              connection={playerConnections?.[rivalSide]}
              onClaimDrop={onClaimRivalDrop}
              claimAvailable={rivalClaimAvailable || rivalTimeoutExpired}
              timeoutExpired={rivalTimeoutExpired}
            />
          </MobileBattlefieldLane>
        }
        ledger={
          <div className={classes.center} data-ledger-density={ledgerDensity}>
            <CyberpunkMobileLedgerContent
              density={ledgerDensity}
              rivalLegendCount={rivalLedgerLegends.length}
              rivalLayout={rivalLedgerLayout}
              rivalLegends={
                <LegendsZone
                  legends={rivalLedgerLegends}
                  opponent
                  side={rivalSide}
                  maskBottomPercent={rivalLedgerLegends.length === 3 ? 30 : undefined}
                />
              }
              friendlyLayout={friendlyLedgerLayout}
              friendlyLegendCount={friendlyLedgerLegends.length}
              friendlyLegends={
                <LegendsZone
                  legends={friendlyLedgerLegends}
                  side={humanSide}
                  maskBottomPercent={friendlyLedgerLegends.length === 3 ? 30 : undefined}
                />
              }
            />
            <MobileDirectAttackDropTarget />
            <MobileSellReveal sale={rivalLastSold} card={rivalLastSoldView} opponent />
            <MobileSellReveal sale={humanLastSold} card={humanLastSoldView} opponent={false} />
          </div>
        }
        playerBattlefield={
          <MobileBattlefieldLane
            className={`${classes.fieldBand} ${classes.playerFieldBand}`}
            side="player"
            priority={prioritySide === humanSide}
            scrollTargetSelector='[data-testid="field-cards"]'
            scrollCueLabel="friendly field cards"
            scrollCues={humanFieldOverflow}
          >
            <FieldZone units={friendlyFieldUnits} side={humanSide} scrollAxis="horizontal" />
            {humanConnectionStatus === "disconnected" ||
            humanConnectionStatus === "reconnecting" ? (
              <OpponentDisconnectOverlay
                variant="self"
                connection={playerConnections?.[humanSide]}
              />
            ) : null}
          </MobileBattlefieldLane>
        }
        playerZoneSummary={
          <CyberpunkZoneSummaryBar
            zones={human}
            eddies={humanEddies}
            side={humanSide}
            lastSoldCard={humanLastSold}
            deckReveal={humanDeckReveal}
            sellArrivalKey={humanLastSold?.id}
            onOpenTrash={() => setTrashViewerSide(humanSide)}
          />
        }
        playerHand={
          <MobileHandDock
            className={`${classes.handBand} ${classes.bottomHandBand}`}
            data-dock-helpers={dockHumanHelpers ? "true" : "false"}
          >
            <MobileHandZone
              onMeasure={measureHumanHand}
              cards={human.hand.map((c) => ({
                imageUrl: c.imageUrl,
                name: c.name,
                cardId: c.cardId,
                definitionId: c.definitionId,
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
            <div className={classes.promptBand}>
              {humanConnectionStatus === "reconnecting" ? <ReconnectCue /> : null}
              <PromptBanner
                side={humanSide}
                compact
                showActionPrompt={true}
                surface="mobile"
                promptPlacement={promptPlacement}
                onTogglePromptPlacement={togglePromptPlacement}
              />
            </div>
            <ChoiceModal side={humanSide} surface="mobile" />
          </MobileHandDock>
        }
        bottomRail={
          <MobilePlayerRail
            side="player"
            className={classes.mobileBottomRail}
            left={
              <div className={classes.mobilePlayerRailLeft}>
                {mobileHumanMatch ? (
                  <button
                    type="button"
                    className={`${classes.opponentIdentity} ${classes.playerIdentity} ${classes.playerInfoButton}`}
                    aria-label={`Open actions for ${humanIdentity?.displayName ?? "you"}`}
                    aria-haspopup="dialog"
                    onClick={() => openPlayerActions("self")}
                  >
                    <MobileRailIdentity
                      identity={humanIdentity}
                      meta={[humanIdentityMeta, `T${turnNumber}`, phase]
                        .filter(Boolean)
                        .join(" · ")}
                      fallback="You"
                    />
                  </button>
                ) : (
                  <div
                    className={`${classes.opponentIdentity} ${classes.playerIdentity}`}
                    aria-label="Player status"
                  >
                    <MobileRailIdentity
                      identity={humanIdentity}
                      meta={[humanIdentityMeta, `T${turnNumber}`, phase]
                        .filter(Boolean)
                        .join(" · ")}
                      fallback="You"
                    />
                  </div>
                )}
              </div>
            }
            center={<MobileClockChip side={humanSide} label="Your" />}
            right={
              <div className={`${classes.gameControls} ${classes.mobilePhaseControls}`}>
                <PassTurnControl compact compactLabelStyle="action" />
              </div>
            }
          />
        }
      />
      <TargetFilterModal
        opened={trashViewerSide !== null}
        title={trashViewerOpponent ? "Rival Trash" : "Your Trash"}
        filter={trashViewerFilter}
        table={trashViewerTable}
        entities={trashViewerEntities}
        emptyLabel="Trash is empty"
        renderEntity={(entity) => {
          const card = trashViewerCardsById.get(entity.id);
          if (!card) return null;

          return (
            <div className={classes.trashViewerCard} data-card-id={card.cardId}>
              <CardImage
                imageUrl={card.imageUrl}
                faceDown={card.faceDown}
                cardType={card.cardType}
                alt={card.faceDown ? "Face-down card" : card.name}
                color={card.color}
                previewDetails={trashCardToPreviewDetails(card)}
              />
            </div>
          );
        }}
        onClose={() => setTrashViewerSide(null)}
      />

      <Drawer
        opened={drawer === "ai"}
        onClose={close}
        position="bottom"
        size="80%"
        title="AI controls"
        classNames={drawerClassNames}
      >
        <AiControlPanel
          compact
          embedded
          hideDecisionLog
          scenarioActionsVariant={mobileHumanMatch ? "hidden" : "details"}
        />
      </Drawer>

      <Drawer
        opened={drawer === "actions"}
        onClose={close}
        position="bottom"
        size="82%"
        title={actionFocus === "self" ? "Your actions" : "Opponent actions"}
        classNames={drawerClassNames}
      >
        {mobileHumanMatch && liveMatchSidebar ? (
          <MobilePlayerActions
            config={liveMatchSidebar}
            model={mobileHumanMatch}
            focus={actionFocus}
            opponentTimeoutExpired={rivalTimeoutExpired}
            onConcede={requestConcede}
            onClaimRivalDrop={onClaimRivalDrop}
            onClose={close}
          />
        ) : null}
      </Drawer>

      <Drawer
        opened={confirmingConcede && !gameEnded}
        onClose={() => setConfirmingConcede(false)}
        position="bottom"
        size="auto"
        title="Concede game?"
        classNames={drawerClassNames}
      >
        <div className={classes.mobileConfirmPanel}>
          <p>This ends the match as a loss and cannot be undone.</p>
          <div className={classes.mobileActionFormButtons}>
            <button type="button" onClick={() => setConfirmingConcede(false)}>
              Keep playing
            </button>
            <button
              type="button"
              data-danger="true"
              onClick={() => {
                setConfirmingConcede(false);
                dispatch({ type: "concede", as: PLAYER_SIDE_TO_ID[humanSide] });
              }}
            >
              Concede game
            </button>
          </div>
        </div>
      </Drawer>

      <Drawer
        opened={drawer === "logs"}
        onClose={close}
        position="bottom"
        size="78%"
        title="Logs"
        classNames={drawerClassNames}
      >
        <EventLogPanel
          embedded
          entries={eventLogEntries}
          copyText={eventLogCopyText}
          rawCopyText={rawEventLogCopyText}
        />
      </Drawer>

      <Drawer
        opened={drawer === "chat"}
        onClose={close}
        position="bottom"
        size="72%"
        title="Chat"
        classNames={drawerClassNames}
      >
        <ChatPanel compact layout="mobile-drawer" />
      </Drawer>
    </>
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
        log.type === "lookAtCards" &&
        log.turnNumber === turnNumber &&
        log.zone === "legendArea" &&
        log.ownerId === ownerId &&
        Array.isArray(log.cardIds)
      ) {
        for (const cardId of log.cardIds) {
          ids.add(cardId);
        }
        continue;
      }
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

function formatCyberpunkEventLogReadableCopy(entries: readonly SimulatorEventLogEntry[]): string {
  return [
    "# Cyberpunk event log",
    entries.length === 0
      ? "No event log entries."
      : entries.map(formatEventLogEntryForClipboard).join("\n"),
  ].join("\n");
}

function formatCyberpunkEventLogRawCopy(
  entries: readonly SimulatorEventLogEntry[],
  moveLogs: readonly MoveLogEntry[],
): string {
  return [
    "# Cyberpunk raw event log",
    "",
    "# Projected entries",
    safeStringify(entries),
    "",
    "# Viewer-safe Cyberpunk move logs",
    safeStringify(moveLogs),
  ].join("\n");
}

type TrashViewerCard = ZoneCardView;

function buildTrashViewerTable(
  ownerId: string,
  zoneId: string,
  cards: readonly TrashViewerCard[],
): SimulatorTable {
  return {
    status: {
      activeSeatId: ownerId,
      phase: "Trash",
      stateVersion: 0,
      turn: 0,
    },
    seats: [
      {
        id: ownerId,
        label: "Owner",
        role: "human",
        perspective: "bottom",
        counters: [],
      },
    ],
    zones: [
      {
        id: zoneId,
        label: "Trash",
        role: "discard",
        ownerId,
        visibility: "public",
        entityIds: cards.map((card) => card.cardId),
        count: cards.length,
        hint: "Cards in trash",
        layoutHint: "grid",
      },
    ],
  };
}

function trashCardToSimulatorEntity(
  card: TrashViewerCard,
  ownerId: string,
  zoneId: string,
): SimulatorEntity {
  const stats = [
    card.effectiveCost !== null
      ? { label: "Cost", value: card.effectiveCost.toString() }
      : card.cost !== null
        ? { label: "Cost", value: card.cost.toString() }
        : null,
    card.effectivePower !== null
      ? { label: "Power", value: card.effectivePower.toString() }
      : card.power !== null
        ? { label: "Power", value: card.power.toString() }
        : null,
  ].filter((stat): stat is { label: string; value: string } => stat !== null);

  return {
    id: card.cardId,
    title: card.name,
    subtitle: card.cardType,
    kind: "card",
    ownerId,
    face: card.faceDown ? "hidden" : "public",
    states: [
      ...(card.spent ? (["rested"] as const) : []),
      ...(card.faceDown ? (["hidden"] as const) : []),
    ],
    stats,
    traits: [...card.classifications, ...card.keywords],
    imageUrl: card.imageUrl,
    frameStyle: { color: card.color },
    dataAttributes: {
      "data-zone-id": zoneId,
      "data-definition-id": card.definitionId,
      "data-card-name": card.name,
      "data-card-type": card.cardType,
      "data-card-color": card.color,
    },
  };
}

function trashCardToPreviewDetails(card: TrashViewerCard) {
  if (card.faceDown) return undefined;

  return {
    name: card.name,
    cardType: card.cardType,
    cost: card.cost,
    effectiveCost: card.effectiveCost,
    power: card.power,
    effectivePower: card.effectivePower,
    classifications: card.classifications,
    keywords: card.keywords,
    rules: [
      ...card.keywords.map(formatPreviewKeyword),
      ...(card.rulesText ? [card.rulesText] : []),
      ...card.effectiveRules
        .filter((rule) => !card.keywords.includes(rule))
        .map((rule) => `Effective: ${formatPreviewKeyword(rule)}.`),
    ],
    costEffects: card.costEffects,
    activeEffects: card.activeEffects,
    hasSellTag: card.hasSellTag,
  };
}

function formatPreviewKeyword(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (first) => first.toUpperCase());
}

function formatEventLogEntryForClipboard(entry: SimulatorEventLogEntry): string {
  const timestamp = entry.timestamp ? ` ${entry.timestamp}` : "";
  const speaker = speakerLabel(entry.seatId);
  const tags = entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
  return `Turn ${entry.turn}${timestamp} ${speaker} ${entry.phase}${tags}: ${entry.message}`;
}

function speakerLabel(seatId: string | undefined): string {
  if (!seatId) return "SYS";
  if (seatId === "player" || seatId === "p1") return "P1";
  if (seatId === "opponent" || seatId === "p2") return "P2";
  return seatId.slice(0, 3).toUpperCase();
}
