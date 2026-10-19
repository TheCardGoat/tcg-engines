import { useHostedOpening } from "./useHostedOpening";
import { openingPresentationBoard } from "./opening-snapshot";
import { useMotionActivity } from "@tcg/simulator-presentation/activity";
import { usePresentationSettings } from "@tcg/simulator-presentation/settings";
import { useSimulatorSettings } from "../../../../simulator/settings/SimulatorSettingsProvider";
import { DEFAULT_SIMULATOR_SETTINGS } from "../../../../simulator/settings/simulator-settings";
import { CostRouteCastPrompt } from "../CostRouteCastPrompt";
import { EffectPlayPrompt } from "../EffectPlayPrompt";
import { useCostRouteSound } from "../useCostRouteSound";
import { SearchRetrievePrompt } from "../../../../components/SearchRetrievePrompt";
import { arrangeHand, canInspectCard, moveHandCard } from "./inspection-arrangement";
import { BoardAllocation } from "../../../../components/BoardAllocation";
import { PaymentStage } from "./PaymentStage";
import { ResourcePaymentControl } from "./ResourcePaymentControl";
import { RESOURCE_COLORS } from "./resource-colors";
import { getCard, hasCard } from "@tcg/alpha-clash-cards";

const EMPTY_SELECTABLE = new Set<string>();
import { availableInteractionCardIds } from "@tcg/simulator-presentation/selection";
import { ResolutionFocusCard } from "@tcg/simulator-presentation/focus";
import { PointerDragDropSurface, PointerDraggable, createDragMotion } from "@tcg/simulator-ui";
import { pointerWithin, rectIntersection } from "@dnd-kit/core";
import type { TargetCard } from "@tcg/simulator-presentation/target-modal";
import { SharedInteractionPrompt } from "../../../../components/SharedInteractionPrompt";
import { TargetModal } from "@tcg/simulator-presentation/target-modal";
import { CardInspectionControls, useCardInspection } from "@tcg/simulator-presentation/inspection";
import {
  Component,
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Drawer, Button, Popover } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import {
  BoardTargetHandles,
  LandscapeNotice,
  replaceBoardTarget,
  autoAssignCostSlots,
  bestOptionForEntity,
  normalizeCostSlotValue,
  useInteractionDraft,
  useInteractionSurface,
  resolveInteractionText,
} from "@tcg/simulator-ui";
import type {
  CostSlotsPresentation,
  EngineInteractionView,
  InteractionAction,
  OptionSelectionInput,
} from "@tcg/protocol";
import { Layers, Menu, ChevronRight, Settings, CircleDot, CircleDashed } from "lucide-react";
import { cardArtwork } from "./card-artwork";
import type { AcSeat, ArenaProps, ResourceAudioState } from "../board-types";
import type { CounterMove, LiveBoardCard } from "../board-types";
import type { SceneTextureStatus } from "@tcg/simulator-presentation/three";
import { arenaLayout, arenaHandPageSize } from "./layout";
import { CombatAttackPath } from "./CombatAttackPath";
import { ArenaScene, type CardAnchor, type ZoneAnchor } from "./Scene";
import { arenaZones, zoneId, type ArenaZone } from "./zones";
import { ZoneOverlay } from "./ZoneOverlay";
import { ArenaZoneBadges } from "./ArenaZoneBadges";
import { ArenaDropZone } from "./ArenaDropZone";
import { boardDragActions } from "./board-drag-actions";
import { ArenaAttentionLayer } from "./ArenaAttentionLayer";
import { ArenaTurnConsole, type ArenaTurnConsoleAction } from "./ArenaTurnConsole";
import { nativeTurnConsole } from "./native-turn-console";
import { PickExitFlights, type PickExitFlight } from "./TransferFlights";
import { useDeckOrderReturn } from "./useDeckOrderReturn";
import type { PickExitPlan } from "../../../../components/SearchRetrievePrompt";
import { arenaAssets, resourcePlaceSound } from "./assets";
import styles from "./arena3d.module.css";
import type { ArenaOpening } from "./useArenaOpening";
import { counterAppearance, visibleCounters } from "./counter-display";
import {
  initSimulatorSoundService,
  playSimulatorSound,
  preloadSimulatorSoundAsset,
} from "@tcg/simulator-presentation/audio/sound-service";

const PAYMENT_FOCUS_SCALE = 1.18;

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

/** True when any native effect of this card shuffles its controller's deck. */
function cardShufflesDeck(definitionId: string): boolean {
  if (!hasCard(definitionId)) return false;
  const card = getCard(definitionId);
  const hasShuffle = (node: unknown): boolean => {
    if (Array.isArray(node)) return node.some(hasShuffle);
    if (node && typeof node === "object") {
      const record = node as Record<string, unknown>;
      if (record.type === "shuffleDeck") return true;
      return Object.values(record).some(hasShuffle);
    }
    return false;
  };
  return hasShuffle(card?.abilities);
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
    onTransientBusyChange,
    onSceneAnchors,
    openingScene: suppliedOpeningScene,
  } = props;
  const hostedOpening = useHostedOpening(
    board,
    viewerSeat,
    !props.disabled,
    suppliedOpeningScene,
    props.participantNames,
  );
  // Never replay a private hand snapshot from another fixture perspective.
  const openingScene =
    suppliedOpeningScene?.outgoingHand && suppliedOpeningScene.outgoingHand.seat !== viewerSeat
      ? undefined
      : hostedOpening;
  const portrait = useMediaQuery("(orientation: portrait) and (max-width: 900px)", false);
  const compact = useMediaQuery("(max-height: 550px)", false);
  const {
    soundEnabled: presentationSound,
    setSoundEnabled: setPresentationSound,
    reducedMotion,
    systemReducedMotion: prefersReducedMotion,
    setReducedMotion: setReduceMotion,
  } = usePresentationSettings();
  const localResourceAudioState = useRef<ResourceAudioState>({});
  const resourceAudioState = props.resourceAudioState ?? localResourceAudioState.current;
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    resourceAudioState.reducedMotion = reducedMotion;
  }, [reducedMotion, resourceAudioState]);
  const { width, height } = useViewportSize();
  const clashWidth = Math.min(1120, 1460 * Math.min(1, width / Math.max(1, height) / 1.6) - 190);
  const draft = useInteractionDraft();
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const inspection = useCardInspection<LiveBoardCard>();
  const currentInspection = board.cards.find(
    (card) => card.instanceId === inspection.card?.instanceId,
  );
  const inspect = useMemo(
    () =>
      currentInspection && canInspectCard(currentInspection, viewerSeat)
        ? { ...currentInspection, faceDown: false }
        : null,
    [currentInspection, viewerSeat],
  );
  const setInspect = inspection.inspect;
  useEffect(() => {
    if (inspection.card && !inspect) setInspect(null);
  }, [inspection.card, inspect, setInspect]);
  useEffect(() => {
    if (inspect) setHovered(null);
  }, [inspect?.instanceId]);
  const [drawer, setDrawer] = useState(false);
  const [library, setLibrary] = useState(false);
  const [libraryZone, setLibraryZone] = useState<ArenaZone | null>(null);
  const [zoneAnchors, setZoneAnchors] = useState<ZoneAnchor[]>([]);
  const [handPage, setHandPage] = useState(0);
  const [anchors, setAnchors] = useState<CardAnchor[]>([]);
  const [failed, setFailed] = useState(false);
  const [assetStatus, setAssetStatus] = useState<SceneTextureStatus>({ loading: 0, failed: [] });
  // Report projected anchors to the match presentation controller.
  useEffect(() => {
    onSceneAnchors?.({ cards: anchors, zones: zoneAnchors });
  }, [anchors, zoneAnchors, onSceneAnchors]);
  const motionActivity = useMotionActivity();
  const [counterFlights, setCounterFlights] = useState<CounterMove[]>([]);
  // A seat flip re-presents the board in place: close per-seat surfaces and
  // clear transient hover state instead of remounting the canvas. The draft
  // context resets its own draft on the same flip. The presentation flip also
  // retires the deal-damage motion window.
  const inspectionDismiss = inspection.dismiss;
  useEffect(() => {
    setDrawer(false);
    setLibrary(false);
    setLibraryZone(null);
    setHovered(null);
    setHandPage(0);
    inspectionDismiss();
  }, [viewerSeat, inspectionDismiss]);
  const lastCounterSequence = useRef(board.counterMoves?.at(-1)?.sequence ?? 0);
  useLayoutEffect(() => {
    const recent = board.counterMoves ?? [];
    const latest = recent.at(-1)?.sequence ?? 0;
    if (latest < lastCounterSequence.current) {
      lastCounterSequence.current = latest;
      setCounterFlights([]);
      return;
    }
    const unseen = recent.filter((move) => move.sequence > lastCounterSequence.current);
    lastCounterSequence.current = latest;
    if (!unseen.length) return;
    const visibleIds = new Set(
      board.cards.filter((card) => !card.faceDown).map((card) => card.instanceId),
    );
    const playable = unseen.filter(
      (move) => visibleIds.has(move.fromId) && visibleIds.has(move.toId),
    );
    if (playable.length) setCounterFlights((current) => [...current, ...playable]);
  }, [board.counterMoves, board.cards]);
  const [retryKey, setRetryKey] = useState(0);
  const [handOrders, setHandOrders] = useState<Partial<Record<typeof viewerSeat, string[]>>>({});
  const arrangedBoard = useMemo(
    () =>
      arrangeHand(
        openingPresentationBoard(
          board,
          viewerSeat,
          openingScene?.beat.id,
          openingScene?.outgoingHand,
        ),
        viewerSeat,
        handOrders[viewerSeat] ?? [],
      ),
    [board, viewerSeat, handOrders, openingScene?.beat.id, openingScene?.outgoingHand],
  );
  const hand = arrangedBoard.cards.filter((c) => c.controller === viewerSeat && c.zone === "hand");
  const moveInHand = (id: string, direction: -1 | 1) => {
    const order = moveHandCard(hand, id, direction);
    setHandOrders((previous) => ({ ...previous, [viewerSeat]: order }));
    setHandPage(Math.floor(Math.max(0, order.indexOf(id)) / arenaHandPageSize(board)));
    if (sound) playSimulatorSound("card.move", () => !document.hidden);
  };
  const opening = board.phaseName === "setup";
  const beat = openingScene?.beat;
  const openingBusy = Boolean(beat && beat.id !== "hand");
  const [mulliganSelection, setMulliganSelection] = useState<ReadonlySet<string>>(new Set());
  useEffect(() => setMulliganSelection(new Set()), [viewerSeat, beat?.id]);
  const { settings, setSoundVolume } = useSimulatorSettings();
  const sound = settings.soundVolume > 0;
  useEffect(() => {
    if (presentationSound !== sound) setPresentationSound(sound);
  }, [presentationSound, sound, setPresentationSound]);
  useEffect(() => {
    if (settings.soundVolume > 0) resourceAudioState.lastAudibleVolume = settings.soundVolume;
  }, [settings.soundVolume, resourceAudioState]);
  const setSound = (enabled: boolean) => {
    setSoundVolume(
      enabled
        ? (resourceAudioState.lastAudibleVolume ?? DEFAULT_SIMULATOR_SETTINGS.soundVolume)
        : 0,
    );
  };
  const orderingId = view.actions.find((action) =>
    action.inputs.some((input) => input.kind === "ordering"),
  )?.id;
  const previousOrdering = useRef({
    id: orderingId,
    version: view.stateVersion,
    actor: view.actorId,
  });
  useEffect(() => {
    const previous = previousOrdering.current;
    if (sound && previous.id && previous.id !== orderingId && view.stateVersion > previous.version)
      playSimulatorSound("effect.trigger", () => !document.hidden);
    previousOrdering.current = { id: orderingId, version: view.stateVersion, actor: view.actorId };
  }, [orderingId, view.stateVersion, view.actorId, sound]);
  useCostRouteSound(draft, board, view.stateVersion, sound);
  const previousZoneCards = useRef({ seat: viewerSeat, cards: board.cards });
  useEffect(() => {
    const previous = previousZoneCards.current;
    previousZoneCards.current = { seat: viewerSeat, cards: board.cards };
    if (!sound || document.hidden || previous.seat !== viewerSeat) return;
    // Only accepted state changes can emit a destination cue. Selection is not resolution.
    const moved = board.cards.find(
      (card) =>
        (card.zone === "oblivion" || card.zone === "banished") &&
        previous.cards.some((old) => old.instanceId === card.instanceId && old.zone !== card.zone),
    );
    if (moved) playSimulatorSound(moved.zone === "oblivion" ? "card.discard" : "card.move");
    else if (
      board.cards.some(
        (card) =>
          card.zone === "deck" &&
          card.definitionId &&
          previous.cards.some((old) => old.instanceId === card.instanceId && !old.definitionId),
      )
    )
      playSimulatorSound("card.reveal");
  }, [board.cards, viewerSeat, sound]);
  useEffect(() => {
    if (inspect && sound) playSimulatorSound("card.move", () => !document.hidden);
  }, [inspect?.instanceId, sound]);
  useEffect(() => {
    if (sound && beat?.cue && !document.hidden) playSimulatorSound(beat.cue);
  }, [beat, sound]);
  useEffect(() => {
    const previous = resourceAudioState.readyResourceIds;
    const paid =
      previous &&
      board.cards.some(
        (card) => card.zone === "resource" && !card.ready && previous.has(card.instanceId),
      );
    resourceAudioState.readyResourceIds = new Set(
      board.cards
        .filter((card) => card.zone === "resource" && card.ready)
        .map((card) => card.instanceId),
    );
    if (paid && sound) playSimulatorSound("resource.spend", () => !document.hidden);
  }, [board.cards, sound, resourceAudioState]);
  const maxPage = Math.max(0, Math.ceil(hand.length / arenaHandPageSize(board)) - 1);
  useEffect(() => setHandPage((p) => Math.min(p, maxPage)), [maxPage]);
  const showPaymentResources = view.actions.some(
    (action) =>
      action.id === draft.actionId &&
      action.inputs.some(
        (input) =>
          input.kind === "option-selection" &&
          (input.presentation?.kind === "cost-slots" || input.id === "xResourcePayment"),
      ),
  );
  const cards = useMemo(() => {
    const placed = arenaLayout(
      arrangedBoard,
      viewerSeat,
      compact,
      Math.min(handPage, maxPage),
      Math.max(700, clashWidth),
      showPaymentResources,
    );
    if (
      handOrders[viewerSeat]?.length ||
      !openingScene?.handOrder.some((id) => placed.some((p) => p.hand && p.card.instanceId === id))
    )
      return placed;
    const isLocalHand = (p: (typeof placed)[number]) => p.hand && p.card.controller === viewerSeat;
    const handCards = placed.filter(isLocalHand);
    const replacements = handCards.filter((p) => !openingScene.retainedIds.has(p.card.instanceId));
    const ordered = openingScene.handOrder
      .map((id) =>
        openingScene.retainedIds.has(id)
          ? handCards.find((p) => p.card.instanceId === id)
          : replacements.shift(),
      )
      .filter((p): p is (typeof placed)[number] => !!p);
    return [...placed.filter((p) => !isLocalHand(p)), ...ordered];
  }, [
    arrangedBoard,
    showPaymentResources,
    viewerSeat,
    compact,
    handPage,
    maxPage,
    clashWidth,
    openingScene?.handOrder,
    handOrders,
  ]);
  const zones = useMemo(
    () => arenaZones(board, viewerSeat, compact, Math.max(700, clashWidth)),
    [board, viewerSeat, compact, clashWidth],
  );
  const promptSurface = useInteractionSurface(view, {
    disabled: disabled || openingBusy,
    visibleEntityIds: new Set(cards.map((placed) => placed.card.instanceId)),
  });
  const deckOrderReturn = useDeckOrderReturn({
    surface: promptSurface,
    view,
    board,
    viewer: viewerSeat,
    zones: zoneAnchors,
    reducedMotion,
    cards,
  });
  useEffect(() => {
    onTransientBusyChange?.(
      counterFlights.length > 0 || motionActivity.busy || deckOrderReturn.flights.length > 0,
    );
  }, [
    counterFlights.length,
    motionActivity.busy,
    deckOrderReturn.flights.length,
    onTransientBusyChange,
  ]);
  const costRouteActive =
    promptSurface.action?.inputs.some((input) => input.id === "costRoute") === true;
  // Pile cards have no board hit target. Use the existing picker, whose card
  // handler commits the choice before the prompt can unmount.
  const pileTargetInput =
    promptSurface.input?.kind === "entity-selection" &&
    promptSurface.input.cardDestination &&
    promptSurface.input.min === 1 &&
    promptSurface.input.max === 1 &&
    promptSurface.input.required !== false &&
    !promptSurface.input.ordered &&
    promptSurface.input.candidates.some((candidate) => candidate.enabled) &&
    promptSurface.input.candidates
      .filter((candidate) => candidate.enabled)
      .every((candidate) =>
        board.cards.some(
          (card) =>
            card.instanceId === candidate.entity.instanceId &&
            ["oblivion", "deck", "banished"].includes(card.zone),
        ),
      );
  const retrieving =
    promptSurface.action?.inputs.some(
      (input) => input.kind === "entity-selection" && input.role === "destination",
    ) === true || Boolean(pileTargetInput);
  // The resolving card is announced where it lives: when the prompt's source
  // sits in a board zone, the arena highlights it there (center-right
  // clashground stage) instead of repeating the source chip in the prompt.
  const promptSourceId = promptSurface.action?.source?.instanceId ?? null;
  const promptSourceOnBoard =
    promptSourceId != null &&
    board.cards.some((entry) => entry.instanceId === promptSourceId && entry.zone !== "hand");
  const destinationInput =
    retrieving &&
    promptSurface.input?.kind === "entity-selection" &&
    promptSurface.input.role === "destination"
      ? promptSurface.input
      : undefined;
  const destinationIds = new Set(
    destinationInput?.candidates
      .filter((candidate) => candidate.enabled)
      .map((candidate) => candidate.entity.instanceId),
  );
  // While the destination step is pending the chosen card is not yet moved by the
  // engine; ghost it at the target zone so the pick stays visible on the board.
  const placementGhost = (() => {
    if (!destinationInput) return undefined;
    const cardInput = promptSurface.action?.inputs.find(
      (entry) => entry.kind === "option-selection",
    );
    if (cardInput?.kind !== "option-selection") return undefined;
    const value = promptSurface.values[cardInput.id];
    const optionId = Array.isArray(value) ? value[0] : undefined;
    const option = cardInput.options.find((candidate) => candidate.id === optionId);
    const instanceId = option?.entity?.instanceId;
    const card = instanceId
      ? board.cards.find((entry) => entry.instanceId === instanceId)
      : undefined;
    const anchor = zoneAnchors.find(
      (entry) => entry.id === destinationInput.candidates[0]?.entity.instanceId,
    );
    if (!card || !anchor) return undefined;
    return {
      left: anchor.left + anchor.width / 2,
      top: anchor.top + anchor.height / 2,
      imageUrl: cardArtwork(card) ?? arenaAssets.back,
      label: card.name ?? "Card",
    };
  })();
  const [targetSlot, setTargetSlot] = useState<number | null>(null);
  useEffect(() => setTargetSlot(null), [promptSurface.requestId]);
  const targetInput = promptSurface.input;
  const targetHandles =
    !promptSurface.locked &&
    promptSurface.spatial &&
    !(
      targetInput?.kind === "option-selection" && targetInput.presentation?.kind === "cost-slots"
    ) &&
    (targetInput?.kind === "entity-selection" ||
      targetInput?.kind === "ordering" ||
      targetInput?.kind === "option-selection");
  const targetIds = [...promptSurface.selectedIds];
  const retarget = (slot: number, id: string) => {
    if (!targetHandles || !targetInput) return false;
    const next = replaceBoardTarget(targetIds, slot, id, promptSurface.candidateIds);
    if (!next) return false;
    if (targetInput.kind === "option-selection") {
      const values = next.map(
        (cardId) =>
          targetInput.options.find(
            (option) => option.enabled !== false && option.entity?.instanceId === cardId,
          )?.id,
      );
      if (values.some((value) => !value)) return false;
      draft.change(
        targetInput.id,
        values.filter((value): value is string => !!value),
      );
    } else draft.change(targetInput.id, next);
    setTargetSlot(null);
    if (sound) playSimulatorSound("card.move", () => !document.hidden);
    return true;
  };
  const promptCards = new Map<string, TargetCard>(
    board.cards
      .filter((card) => card.definitionId && !card.faceDown)
      .map((card) => [
        card.instanceId,
        {
          id: card.instanceId,
          label: card.name ?? "Card",
          imageUrl: cardArtwork(card),
          // Created tokens have runtime definition IDs, not catalog entries.
          identity: (card.definitionId && hasCard(card.definitionId)
            ? getCard(card.definitionId).colors
            : []
          ).map((color) => ({
            label: color,
            color: RESOURCE_COLORS[color],
          })),
          group: `${card.controller === viewerSeat ? "You" : "Opponent"} · ${card.zone}`,
          stackKey: ["deck", "oblivion"].includes(card.zone)
            ? (card.definitionId ?? undefined)
            : undefined,
        },
      ]),
  );
  const previousSearch = useRef<{
    version: number;
    searching: boolean;
  } | null>(null);
  const [deckShuffle, setDeckShuffle] = useState<{ id: number; anchor: ZoneAnchor } | null>(null);
  // A search prompt is identified by its resolving card: only cards whose native
  // effect shuffles the deck get the shuffle cue (empty searches collapse their
  // option list to a boolean confirm, so the input shape cannot identify them).
  const actionSourceId = promptSurface.action?.source?.instanceId;
  const actionSourceCard = actionSourceId
    ? board.cards.find((card) => card.instanceId === actionSourceId)
    : undefined;
  const searchPromptPending =
    !!actionSourceCard?.definitionId && cardShufflesDeck(actionSourceCard.definitionId);
  useLayoutEffect(() => {
    const prev = previousSearch.current;
    const searching = searchPromptPending && !!promptSurface.action;
    previousSearch.current = { version: view.stateVersion, searching };
    if (!prev || reducedMotion) return;
    // A pending search choice that just resolved always shuffles (native
    // reveal → return → shuffle), even when it found no card.
    if (prev.searching && !searching && prev.version !== view.stateVersion) {
      const deckAnchor = byDeckAnchorRef.current;
      if (deckAnchor) {
        const shuffle = { id: ++pickExitSeq.current, anchor: deckAnchor };
        setDeckShuffle(shuffle);
        window.setTimeout(
          () => setDeckShuffle((current) => (current?.id === shuffle.id ? null : current)),
          1500,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.cards, view.stateVersion, searchPromptPending]);
  const [pickExits, setPickExits] = useState<PickExitFlight[]>([]);
  const byDeckAnchorRef = useRef<ZoneAnchor | null>(null);
  useEffect(() => {
    byDeckAnchorRef.current =
      zoneAnchors.find((anchor) => anchor.id === zoneId(viewerSeat, "deck")) ?? null;
  }, [zoneAnchors, viewerSeat]);
  const pickExitSeq = useRef(0);
  const handlePickExit = (plan: PickExitPlan | undefined) => {
    if (!plan || reducedMotion) return;
    const input = promptSurface.input;
    const action = promptSurface.action;
    if (!input || !action) return;
    const byZone = new Map(zoneAnchors.map((anchor) => [anchor.id, anchor]));
    const byCard = new Map(anchors.map((anchor) => [anchor.id, anchor]));
    const optionIds =
      input.kind === "option-selection"
        ? input.options.filter((option) => option.entity).map((option) => option.entity!.instanceId)
        : input.kind === "entity-selection"
          ? input.candidates
              .filter((candidate) => candidate.enabled)
              .map((candidate) => candidate.entity.instanceId)
          : [];
    const pileCard = optionIds[0]
      ? board.cards.find((card) => card.instanceId === optionIds[0])
      : undefined;
    const pile = pileCard ? byZone.get(zoneId(pileCard.controller, pileCard.zone)) : undefined;
    const destinationInput = action.inputs.find(
      (entry) => entry.kind === "entity-selection" && entry.role === "destination",
    );
    const destinationZoneId =
      destinationInput?.kind === "entity-selection"
        ? destinationInput.candidates?.[0]?.entity.instanceId
        : undefined;
    const destination = destinationZoneId ? byZone.get(destinationZoneId) : undefined;
    const sourceId = action.source?.instanceId;
    const sourceCard = sourceId
      ? board.cards.find((card) => card.instanceId === sourceId)
      : undefined;
    const resolveTarget =
      sourceCard &&
      (byCard.get(sourceCard.instanceId) ??
        byZone.get(zoneId(sourceCard.controller, sourceCard.zone)));
    const flights: PickExitFlight[] = [];
    // Each clone ends at the destination's real footprint, never an arbitrary shrink.
    const landingScale = (from: { width: number }, target: { width: number }) =>
      Math.min(1, Math.max(0.25, target.width / from.width));
    let delay = 0;
    for (const tile of plan.tiles) {
      if (tile.chosen || !pile) continue;
      flights.push({
        id: ++pickExitSeq.current,
        kind: "return",
        from: tile,
        to: pile,
        imageUrl: tile.imageUrl,
        flipToBack: true,
        backImageUrl: arenaAssets.back,
        endScale: landingScale(tile, { width: Math.min(pile.width * 0.8, 104) }),
        label: "",
        delayMs: delay,
        durationMs: 620,
      });
      delay += 45;
    }
    if (plan.pedestal && resolveTarget) {
      flights.push({
        id: ++pickExitSeq.current,
        kind: "resolve",
        from: plan.pedestal,
        to: resolveTarget,
        imageUrl: plan.pedestal.imageUrl,
        endScale: landingScale(plan.pedestal, resolveTarget),
        label: sourceCard?.name ?? "Card",
        delayMs: delay + 60,
        durationMs: 720,
      });
    }
    // When the pick itself completes the interaction, the real transfer flight
    // shows the movement — a preview flight would double it.
    const chosen = plan.suppressChosenFlight ? undefined : plan.tiles.find((tile) => tile.chosen);
    if (chosen && destination) {
      flights.push({
        id: ++pickExitSeq.current,
        kind: "chosen",
        from: chosen,
        to: destination,
        imageUrl: chosen.imageUrl,
        // Land at the placement ghost's size for a seamless handoff.
        endScale: landingScale(chosen, { width: 92 }),
        label: "",
        delayMs: delay + 220,
        durationMs: 820,
      });
    }
    if (!flights.length) return;
    setPickExits((current) => [...current, ...flights].slice(-14));
    const maxId = Math.max(...flights.map((flight) => flight.id));
    window.setTimeout(
      () => setPickExits((current) => current.filter((flight) => flight.id > maxId)),
      Math.max(...flights.map((flight) => flight.delayMs + flight.durationMs)) + 400,
    );
  };
  for (const action of view.actions) {
    for (const input of action.inputs) {
      if (input.kind !== "ordering" || input.entityKind !== "effect") continue;
      for (const candidate of input.candidates) {
        const source = board.cards.find(
          (card) => !card.faceDown && card.definitionId === candidate.entity.definitionId,
        );
        const presentation = source && promptCards.get(source.instanceId);
        if (!presentation) continue;
        const text = candidate.text ? resolveInteractionText(candidate.text) : "";
        promptCards.set(candidate.entity.instanceId, {
          ...presentation,
          id: candidate.entity.instanceId,
          detail: text,
        });
      }
    }
  }
  // Zone piles inspect all authorized faces; the general picker selects legal targets.
  const librarySelecting = !libraryZone && draft.active && selectableInstanceIds !== null;
  const visibleLibraryCards = arrangedBoard.cards.filter(
    (c) =>
      canInspectCard(c, viewerSeat) &&
      (!libraryZone || (c.controller === libraryZone.seat && c.zone === libraryZone.zone)),
  );
  const enabled =
    !disabled && !openingScene?.pending && !view.projectionFailure && view.status !== "game-over";
  const next = opening
    ? view.actions.find(
        (a) =>
          a.enabled &&
          (["declareMulligan:keep", "startGame"].includes(a.id) ||
            (openingScene && a.id === "mulligan")),
      )
    : (view.actions.find((a) => a.enabled && a.intent === "resource-card") ??
      view.actions.find((a) => a.enabled && a.intent === "pass"));
  const mulligan = opening
    ? view.actions.find((a) => a.enabled && a.intent === "mulligan")
    : undefined;
  const declareMulligan = opening
    ? view.actions.find((a) => a.enabled && a.id === "declareMulligan:take")
    : undefined;
  const openingHint = openingScene?.pending
    ? "Waiting for confirmation…"
    : declareMulligan
      ? openingScene
        ? "Select cards to replace, then choose Replace. Right-click or Shift+Enter to inspect."
        : "Select cards to replace, then take a mulligan. Right-click to inspect."
      : mulligan
        ? "Select any number of cards to replace. Right-click to inspect."
        : next?.id === "startGame"
          ? openingScene
            ? "Both hands are ready. Starting the game…"
            : "Both hands are ready. Begin the game."
          : board.openingHandsReady
            ? "Both hands are ready. Waiting for the starting player to begin."
            : "Waiting for the other player's opening choice.";
  const portalAction = view.actions.find((action) => action.id === "activatePortal");
  const portalLabel = `Portal ${board.portalOpen ? "open" : "closed"}. ${portalAction ? resolveInteractionText(portalAction.text) : "Waiting for a legal activation"}`;
  const seatName = (seat: AcSeat) =>
    seat === "player-one"
      ? (props.participantNames?.p1 ?? "You")
      : (props.participantNames?.p2 ?? "Opponent");
  const status = opening
    ? "OPENING HAND"
    : board.phaseName === "complete"
      ? "MATCH COMPLETE"
      : view.status === "waiting"
        ? "WAITING"
        : view.status === "choosing"
          ? "YOUR CHOICE"
          : board.responseWindow
            ? board.responseWindow.openFor === viewerSeat
              ? "YOUR RESPONSE"
              : `${seatName(board.responseWindow.openFor)} RESPONDING`
            : board.clash?.step === "obstruct"
              ? "CHOOSE OBSTRUCTORS"
              : board.clash?.step === "attackerBuff" || board.clash?.step === "defenderBuff"
                ? "YOUR CLASH BUFF"
                : board.clash?.step === "beforeDamage"
                  ? "BEFORE DAMAGE"
                  : board.activePlayer === viewerSeat
                    ? "YOUR TURN"
                    : `${seatName(board.activePlayer)}'S TURN`;
  // Rule 114/409.5: the seat holding priority now and the passes already made
  // toward the top Standby object; surfaced in the turn chip and board glow.
  const prioritySeat: AcSeat =
    board.responseWindow?.openFor ??
    board.decisionSeat ??
    (view.status === "waiting"
      ? viewerSeat === "player-one"
        ? "player-two"
        : "player-one"
      : viewerSeat);
  const activate = (action: InteractionAction) => {
    if (!enabled || !action.enabled) return;
    if (openingScene && action.id.startsWith("declareMulligan:")) {
      if (action.id === "declareMulligan:take" && mulliganSelection.size > 0) {
        openingScene.redraw(
          [...mulliganSelection],
          hand.map((card) => card.instanceId),
          hand,
        );
      } else openingScene.declare(action.id === "declareMulligan:take");
      return;
    }
    if (openingScene && action.id === "mulligan") {
      openingScene.redraw(
        [...mulliganSelection],
        hand.map((card) => card.instanceId),
        hand,
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
  const allocationTargetsAnchored =
    promptSurface.input?.kind === "entity-allocation" &&
    anchors.some((a) => a.id === promptSurface.action?.source?.instanceId);
  // A native declaration (603.3d) targets from a card already in play: feature
  // that card in the shared resolution-focus zone while its prompt is open.
  const declarationAction =
    !compact &&
    promptSurface.action?.id.startsWith("resolveChoice:") === true &&
    promptSurface.input?.kind === "entity-selection" &&
    promptSurface.input.role === "target" &&
    !promptSurface.input.cardDestination
      ? promptSurface.action
      : undefined;
  const declarationSourceId = declarationAction?.source?.instanceId;
  const declarationAnchor = declarationSourceId
    ? anchors.find((entry) => entry.id === declarationSourceId)
    : undefined;
  const declarationFeature =
    declarationSourceId && declarationAnchor ? promptCards.get(declarationSourceId) : undefined;
  const mutedAccents = useMemo(() => {
    const sourceId = promptSurface.action?.source?.instanceId;
    if ((allocationTargetsAnchored || declarationFeature) && sourceId) return new Set([sourceId]);
    return undefined;
  }, [allocationTargetsAnchored, declarationFeature, promptSurface.action?.source?.instanceId]);
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
  const dragActions = boardDragActions(board, view.actions);
  const turnPresentation = nativeTurnConsole(board, view, viewerSeat);
  const draftUsesOwnControls =
    costRouteActive ||
    (promptSurface.input?.kind === "entity-selection" &&
      promptSurface.input.min === 1 &&
      promptSurface.input.max === 1 &&
      promptSurface.input.required !== false &&
      !promptSurface.input.ordered) ||
    (promptSurface.input?.kind === "option-selection" &&
      promptSurface.input.presentation?.kind === "cost-slots") ||
    retrieving ||
    (draft.active &&
      (promptSurface.input?.kind === "entity-allocation" ||
        promptSurface.input?.kind === "number" ||
        promptSurface.input?.kind === "boolean" ||
        (promptSurface.input?.kind === "option-selection" &&
          promptSurface.input.max === 1 &&
          promptSurface.input.options.length <= 6)));
  const attackDraft = promptSurface.action?.id === "initiateClash";
  const attackSelection = promptSurface.values.attackerId;
  const selectedAttackerId = Array.isArray(attackSelection) ? attackSelection[0] : undefined;
  const obstructionDraft = promptSurface.action?.id === "declareObstructors";
  const combatDraft = attackDraft || obstructionDraft;
  const obstructionCount = promptSurface.selectedIds.size;
  const obstructionInput =
    obstructionDraft && promptSurface.input?.kind === "entity-selection"
      ? promptSurface.input
      : undefined;
  const turnActions: readonly ArenaTurnConsoleAction[] = attackDraft
    ? [
        {
          id: "cancelAttack",
          kind: "advance",
          label: "Cancel attack",
          description: "Return to choosing an action without declaring an attack.",
        },
      ]
    : obstructionInput
      ? [
          {
            id: "confirmDraft",
            kind: obstructionCount ? "confirm" : "pass",
            label: obstructionCount
              ? `Obstruct with ${obstructionCount}`
              : obstructionInput.min > 0
                ? "Choose obstructors"
                : "No obstruction",
            description: obstructionCount
              ? "Commit the selected obstructors."
              : "Continue without obstructing.",
            disabledReason:
              !enabled || !promptSurface.canConfirm
                ? "Select the required obstructors."
                : undefined,
          },
          ...(obstructionCount
            ? [
                {
                  id: "clearObstructors",
                  kind: "advance" as const,
                  label: "Clear",
                  description: "Clear your selection without advancing combat.",
                  disabledReason: !enabled ? "Controls are not available." : undefined,
                },
              ]
            : []),
        ]
      : draft.active
        ? draftUsesOwnControls
          ? []
          : [
              {
                id: "confirmDraft",
                kind: "confirm",
                label: promptSurface.canConfirm
                  ? promptSurface.action?.id === "initiateClash"
                    ? "Confirm attack"
                    : promptSurface.action?.id === "declareObstructors"
                      ? "Confirm obstruction"
                      : "Confirm choice"
                  : "Choose cards",
                description: promptSurface.canConfirm
                  ? "Submit the current choice."
                  : "Complete the highlighted choice on the board.",
                disabledReason: !enabled ? "Controls are not available." : undefined,
              },
            ]
        : (turnPresentation?.actions ?? []).map((action) => ({
            ...action,
            disabledReason: !enabled ? "Controls are not available." : action.disabledReason,
          }));
  const activateTurnAction = (id: string) => {
    if (!enabled) return;
    if (id === "cancelAttack") {
      draft.cancel();
      return;
    }
    if (id === "clearObstructors") {
      draft.clear();
      return;
    }
    if (id === "confirmDraft") {
      if (promptSurface.input) {
        if (promptSurface.canConfirm) promptSurface.confirm();
        else promptSurface.restore();
      } else setDrawer(true);
      return;
    }
    const action = view.actions.find((item) => item.id === id);
    if (action && !draft.active) activate(action);
  };
  const handDrag = enabled && !openingBusy && !inspect && !drawer && !library && !draft.active;
  const [dragMotion] = useState(() => createDragMotion<string>());
  // Frames subscribe to dragMotion without rerendering; the board only needs
  // the coarse phase, so one external-store subscription drives the drop zones.
  const subscribeDrag = useCallback(
    (listener: () => void) => dragMotion.subscribe(listener),
    [dragMotion],
  );
  const dragSession = useSyncExternalStore(
    subscribeDrag,
    dragMotion.getSnapshot,
    dragMotion.getSnapshot,
  );
  // Keep the lifted hand pose and its DOM hitbox stable while a drag owns the
  // card. Leaving that hitbox must not move dnd-kit's source rectangle or reset
  // the fan angle under the pointer. Release it after return/payment handoff.
  const sceneHovered = dragSession?.source ?? hovered;
  const handDragging = dragSession?.phase === "dragging";
  // While a hand card is under the pointer, light only the zones that card can
  // enter: the resource step takes any card, otherwise its play destinations.
  const draggedId = handDragging ? dragSession?.source : undefined;
  const draggedActions = dragActions.filter((route) => route.sourceId === draggedId);
  useLayoutEffect(() => {
    const session = dragMotion.getSnapshot();
    if (session?.phase === "pending") {
      if (!hand.some((card) => card.instanceId === session.source)) dragMotion.finish();
      else if (draft.submissionRejected) dragMotion.returnToSource(reducedMotion ? 0 : 180);
    }
  }, [view.stateVersion, draft.submissionRejected, dragMotion, reducedMotion, hand]);
  // A hand card held by an open draft stays at the drop point; when the draft
  // closes without the card leaving the hand (cancel), fly it back.
  const heldDraftSource = useRef<string | null>(null);
  useEffect(() => {
    const session = dragMotion.getSnapshot();
    if (draft.active && session?.phase === "pending") {
      heldDraftSource.current = session.source;
      return;
    }
    if (heldDraftSource.current && session?.phase === "pending") {
      heldDraftSource.current = null;
      if (hand.some((card) => card.instanceId === session.source))
        dragMotion.returnToSource(reducedMotion ? 0 : 180);
    }
  }, [draft.active, dragMotion, reducedMotion, hand]);
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
  const canSelectMulligan =
    !!openingScene && beat?.id === "hand" && !!(mulligan || declareMulligan) && enabled;
  const handPlayActionFor = (instanceId: string) => {
    const plays = view.actions.filter(
      (action) =>
        action.enabled && action.source?.instanceId === instanceId && action.intent === "play-card",
    );
    return plays.length === 1 ? plays[0] : undefined;
  };
  const paymentInput =
    promptSurface.input?.kind === "option-selection" &&
    promptSurface.input.presentation?.kind === "cost-slots"
      ? (promptSurface.input as OptionSelectionInput & {
          presentation: CostSlotsPresentation;
        })
      : undefined;
  const paymentOptionEntity = (optionId: string) =>
    paymentInput?.options.find((option) => option.id === optionId)?.entity?.instanceId;
  // Resources engaged in the staged cost tap sideways, the physical tell of a
  // card being spent; the set drives the scene's rotation.
  const paymentEngagedIds = useMemo(() => {
    if (!paymentInput) return EMPTY_SELECTABLE;
    const rawValue = promptSurface.values[paymentInput.id];
    const assigned = normalizeCostSlotValue(
      paymentInput,
      Array.isArray(rawValue) ? rawValue : undefined,
    );
    return new Set(
      assigned.map((optionId) => paymentOptionEntity(optionId)).filter((id): id is string => !!id),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInput, promptSurface.values]);
  const paymentSelectableIds = useMemo(() => {
    if (!paymentInput) return null;
    const rawValue = promptSurface.values[paymentInput.id];
    const assigned = normalizeCostSlotValue(
      paymentInput,
      Array.isArray(rawValue) ? rawValue : undefined,
    );
    return new Set(
      paymentInput.options.flatMap((option) => {
        const id = option.entity?.instanceId;
        return id && (paymentEngagedIds.has(id) || bestOptionForEntity(paymentInput, id, assigned))
          ? [id]
          : [];
      }),
    );
  }, [paymentInput, promptSurface.values, paymentEngagedIds]);
  const attackAction =
    !draft.active && enabled && !inspect && !drawer && !library && !openingBusy
      ? view.actions.find((action) => action.id === "initiateClash" && action.enabled)
      : undefined;
  const attackerInput = attackAction?.inputs.find((input) => input.id === "attackerId");
  const directAttackIds = new Set(
    attackerInput?.kind === "entity-selection"
      ? attackerInput.candidates
          .filter((candidate) => candidate.enabled !== false)
          .map((candidate) => candidate.entity.instanceId)
      : [],
  );
  // Opening selection uses the same candidate set for hit targets and scene
  // cues. Keep it ahead of generic inspection/play routing.
  const mulliganCardIds = canSelectMulligan ? new Set(hand.map((card) => card.instanceId)) : null;
  const effectiveSelectableIds =
    mulliganCardIds ??
    paymentSelectableIds ??
    (draft.active
      ? selectableInstanceIds
      : new Set([...(selectableInstanceIds ?? []), ...directAttackIds]));
  // The staged payment: board taps engage resources into cost slots, and a
  // complete draft plays the card without a second confirmation.
  const handlePaymentTap = (card: LiveBoardCard): boolean => {
    if (!paymentInput) return false;
    // While paying, board resources belong to the payment context: taps that
    // cannot engage (engaged gems, no legal slot) are swallowed, never
    // promoted to card inspection.
    if (card.zone !== "resource" || card.controller !== viewerSeat) return false;
    if (!enabled || promptSurface.locked || !card.ready) return true;
    const rawValue = promptSurface.values[paymentInput.id];
    const assigned = normalizeCostSlotValue(
      paymentInput,
      Array.isArray(rawValue) ? rawValue : undefined,
    );
    if (assigned.some((optionId) => paymentOptionEntity(optionId) === card.instanceId)) {
      draft.change(
        paymentInput.id,
        assigned.map((optionId) =>
          paymentOptionEntity(optionId) === card.instanceId ? "" : optionId,
        ),
      );
      return true;
    }
    const pick = bestOptionForEntity(paymentInput, card.instanceId, assigned);
    if (!pick) return true;
    const next = [...assigned];
    next[pick.slotIndex] = pick.optionId;
    draft.change(paymentInput.id, next);
    return true;
  };
  const [autoPayEnabled, setAutoPayEnabled] = useState(() => {
    try {
      return window.localStorage.getItem("alpha-clash.auto-pay") !== "0";
    } catch {
      return true;
    }
  });
  const changeAutoPay = (next: boolean) =>
    setAutoPayEnabled(() => {
      try {
        window.localStorage.setItem("alpha-clash.auto-pay", next ? "1" : "0");
      } catch {
        // Storage may be unavailable; the toggle still works for this match.
      }
      return next;
    });

  // Waiting-to-pay uses the persistent scene card: it moves
  // aside while the declared card holds at the resolution focus. With auto-pay
  // the panel never mounts, so the card stays rendered until the engine moves
  // it to Standby — one continuous flight instead of a vanish-and-pop.
  const paymentStaging = Boolean(paymentInput) && !autoPayEnabled;
  // Variable costs use explicit resource selection rather than fixed slots.
  // Omitting that optional declaration delegates payment to the native engine.
  useEffect(() => {
    if (
      autoPayEnabled &&
      promptSurface.input?.id === "xResourcePayment" &&
      !promptSurface.locked &&
      !promptSurface.rejected
    )
      draft.skipCurrent();
  }, [autoPayEnabled, promptSurface, draft]);
  // With auto-pay on, the staged panel never mounts: every cost-slots draft is
  // assigned from available gems and submitted as soon as it becomes current.
  const autoSubmitted = useRef("");
  useEffect(() => {
    if (!autoPayEnabled || !paymentInput || promptSurface.locked) return;
    const submitKey = `${promptSurface.action?.requestId ?? ""}:${paymentInput.id}`;
    if (autoSubmitted.current === submitKey) return;
    const rawValue = promptSurface.values[paymentInput.id];
    const completion = autoAssignCostSlots(
      paymentInput,
      Array.isArray(rawValue) ? rawValue : undefined,
    );
    if (!completion) return;
    autoSubmitted.current = submitKey;
    draft.change(paymentInput.id, completion);
    draft.confirmCurrent();
  }, [autoPayEnabled, paymentInput, promptSurface, draft]);
  const decisionActive = Boolean(
    promptSurface.input &&
    !combatDraft &&
    !promptSurface.locked &&
    !promptSurface.minimized &&
    !portrait &&
    !inspect &&
    !drawer &&
    !library &&
    !openingBusy,
  );
  // Reserve the compact lower edge only for choices whose candidates sit on
  // the table. Hand/resource selectors still need that edge for their cards.
  const tableChoice =
    promptSurface.input?.kind === "entity-selection" &&
    promptSurface.candidateIds.size > 0 &&
    [...promptSurface.candidateIds].every((id) =>
      board.cards.some(
        (card) =>
          card.instanceId === id &&
          ["clash", "contender", "accessory", "clashground"].includes(card.zone),
      ),
    );
  const attentionTargets = new Set(
    paymentSelectableIds ?? [
      ...promptSurface.candidateIds,
      ...(effectiveSelectableIds ?? []),
      ...promptSurface.selectedIds,
    ],
  );
  if ((promptSourceOnBoard || paymentStaging) && promptSourceId)
    attentionTargets.add(promptSourceId);
  const displayCards = useMemo(() => {
    return cards.map((placed) => {
      if (
        !paymentStaging ||
        placed.card.zone !== "resource" ||
        placed.card.controller !== viewerSeat
      )
        return placed;
      // Expand the row around its existing center. Scene projection also supplies
      // the enlarged hit targets, so payment taps stay aligned with the artwork.
      const scale = PAYMENT_FOCUS_SCALE;
      return { ...placed, x: 160 + (placed.x - 160) * scale, height: placed.height * scale };
    });
  }, [cards, paymentStaging, viewerSeat]);
  const displayZones = useMemo(
    () =>
      zones.map((zone) =>
        paymentStaging && !compact && zone.zone === "resource" && zone.seat === viewerSeat
          ? {
              ...zone,
              width: zone.width * PAYMENT_FOCUS_SCALE,
              height: zone.height * PAYMENT_FOCUS_SCALE,
              captionY: zone.y + (zone.captionY - zone.y) * PAYMENT_FOCUS_SCALE,
            }
          : zone,
      ),
    [zones, paymentStaging, compact, viewerSeat],
  );
  // The scene keeps the same mesh through drag, payment, commit and cancellation.
  useLayoutEffect(() => {
    if (paymentStaging) dragMotion.finish();
  }, [paymentStaging, dragMotion]);
  const inspectCard = (card: LiveBoardCard) => {
    if (canInspectCard(card, viewerSeat)) setInspect({ ...card, faceDown: false });
  };
  const chooseCard = (card: LiveBoardCard) => {
    if (handlePaymentTap(card)) return;
    if (mulliganCardIds?.has(card.instanceId)) {
      setMulliganSelection((previous) => {
        const next = new Set(previous);
        if (next.has(card.instanceId)) next.delete(card.instanceId);
        else next.add(card.instanceId);
        return next;
      });
      return;
    }
    if (targetHandles && targetSlot !== null) {
      retarget(targetSlot, card.instanceId);
      return;
    }
    if (costRouteActive) {
      // A cast is in progress: payment taps were handled above; only payment
      // candidates respond, and nothing promotes to inspection.
      if (selectableInstanceIds?.has(card.instanceId) && onCardClick) onCardClick(card.instanceId);
      return;
    }
    if (selectableInstanceIds?.has(card.instanceId) && onCardClick) {
      if (sound) playSimulatorSound("card.move", () => !document.hidden);
      onCardClick(card.instanceId);
      return;
    }
    if (attackAction && attackerInput && directAttackIds.has(card.instanceId)) {
      draft.begin(attackAction.id, { [attackerInput.id]: [card.instanceId] });
      return;
    }
    if (handDrag && card.zone === "hand" && card.controller === viewerSeat) {
      if (
        resourceStep &&
        resourceAction &&
        resourceInput &&
        resourceIds.includes(card.instanceId)
      ) {
        draft.begin(resourceAction.id, { [resourceInput.id]: [card.instanceId] });
        return;
      }
      const play = handPlayActionFor(card.instanceId);
      if (play) {
        activate(play);
        return;
      }
    }
    inspectCard(card);
  };
  const handleCardKey = (event: KeyboardEvent<HTMLElement>, card: LiveBoardCard) => {
    if (
      (event.key === "Enter" && event.shiftKey) ||
      event.key === "ContextMenu" ||
      (event.key === "F10" && event.shiftKey)
    ) {
      event.preventDefault();
      event.stopPropagation();
      inspectCard(card);
    } else if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      chooseCard(card);
    }
  };
  const inspectionPile =
    inspect && inspect.zone === "oblivion"
      ? board.cards.filter(
          (card) =>
            card.zone === inspect.zone &&
            card.controller === inspect.controller &&
            canInspectCard(card, viewerSeat),
        )
      : [];
  const inspectionIndex = inspectionPile.findIndex(
    (card) => card.instanceId === inspect?.instanceId,
  );
  const handIndex = hand.findIndex((card) => card.instanceId === inspect?.instanceId);
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
      cancelKey={handDrag ? view.stateVersion : "locked"}
      decodeSource={(id) => id}
      renderOverlay={() => null}
      collisionDetection={(args) => {
        const hits = args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args);
        const cards = hits.filter((hit) => String(hit.id).startsWith("card:"));
        return cards.length > 0 ? cards : hits;
      }}
      onDragStart={() => setDropNotice(null)}
      onDragEnd={(id, destination) => {
        const routes = handDrag
          ? dragActions.filter(
              (route) => route.sourceId === id && route.destination === destination,
            )
          : [];
        if (routes.length === 1) {
          draft.begin(routes[0].action.id, routes[0].values);
          return { kind: "accepted" };
        }
        if (routes.length > 1) {
          // The same gesture can mean play or set, or one of several abilities.
          // Keep that choice explicit instead of guessing the player's intent.
          const card = board.cards.find((entry) => entry.instanceId === id);
          if (card) setInspect({ ...card, faceDown: false });
          setDropNotice("Choose the action for this card.");
          return { kind: "rejected" };
        }
        setDropNotice(
          "No action taken. Drop on a highlighted zone or card. Click the card for its actions.",
        );
        return { kind: "rejected" };
      }}
    >
      <section
        className={styles.root}
        data-decision-active={decisionActive || undefined}
        data-table-choice={tableChoice || undefined}
        style={{ "--ac-action": `url("${arenaAssets.button}")` } as CSSProperties}
        onPointerDownCapture={() => {
          if (sound) void initSimulatorSoundService().catch(() => setSound(false));
        }}
        onKeyDownCapture={() => {
          if (sound) void initSimulatorSoundService().catch(() => setSound(false));
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setTargetSlot(null);
        }}
        data-testid="alpha-clash-arena-3d"
        data-inspecting={!!inspect || undefined}
        data-opening-beat={beat?.id ?? "play"}
        data-perspective={viewerSeat}
        data-priority={prioritySeat}
        data-reduced-motion={reducedMotion || undefined}
      >
        <div className={styles.screenReader} aria-label="Player status">
          {(["player-one", "player-two"] as const).map((seat) => (
            <p key={seat}>
              {seat === viewerSeat ? "You" : "Opponent"}: {board.players[seat].health} of{" "}
              {board.players[seat].maxHealth} health. Deck {board.players[seat].deckSize}. Hand{" "}
              {board.players[seat].handSize}.
            </p>
          ))}
          {board.cards
            .filter(
              (card) => canInspectCard(card, viewerSeat) && card.phaseDamage + card.clashDamage > 0,
            )
            .map((card) => (
              <p key={`damage-${card.instanceId}`}>
                {card.name}: {card.phaseDamage + card.clashDamage} damage.
              </p>
            ))}
          {board.cards
            .filter((card) => !card.faceDown && visibleCounters(card.counters).length)
            .map((card) => (
              <p key={card.instanceId}>
                {card.name}:{" "}
                {visibleCounters(card.counters)
                  .map(([kind, count]) => `${count} ${kind}`)
                  .join(", ")}{" "}
                counters.
              </p>
            ))}
        </div>
        {/* Keep the WebGL renderer mounted while the portrait guard is visible. */}
        <div
          className={styles.scene}
          style={portrait ? { visibility: "hidden", pointerEvents: "none" } : undefined}
          aria-hidden={portrait || undefined}
        >
          <SceneBoundary key={retryKey} fallback={fallback}>
            <ArenaScene
              onMotionStart={motionActivity.begin}
              resolvingId={promptSourceOnBoard ? promptSourceId : undefined}
              dragMotion={dragMotion}
              paymentEngagedIds={paymentEngagedIds}
              paymentStaging={paymentStaging}
              paymentSourceId={
                paymentStaging && !compact ? (promptSourceId ?? undefined) : undefined
              }
              availableInteractionIds={canSelectMulligan ? undefined : availableCards}
              selectionActive={canSelectMulligan || draft.active}
              openingScene={openingScene}
              openingSound={sound}
              counterFlights={counterFlights}
              onCounterFlightComplete={(sequence) =>
                setCounterFlights((active) =>
                  active[0]?.sequence === sequence ? active.slice(1) : active,
                )
              }
              zones={displayZones}
              highlightedZone={
                destinationInput?.candidates[0]?.entity.instanceId ??
                (handDragging ? null : highlightedZone)
              }
              inspectedCard={inspect}
              onZoneAnchors={setZoneAnchors}
              board={deckOrderReturn.board}
              viewer={viewerSeat}
              cards={deckOrderReturn.flights.length ? deckOrderReturn.cards : displayCards}
              compact={compact}
              hovered={sceneHovered}
              selected={
                canSelectMulligan
                  ? mulliganSelection
                  : attackDraft && selectedAttackerId
                    ? new Set([...selectedInstanceIds, selectedAttackerId])
                    : selectedInstanceIds
              }
              selectable={allocationTargetsAnchored ? EMPTY_SELECTABLE : effectiveSelectableIds}
              muteAccentIds={mutedAccents}
              reducedMotion={reducedMotion}
              onAssets={setAssetStatus}
              retryKey={retryKey}
              onAnchors={setAnchors}
              onFailure={handleSceneFailure}
              turnSeat={view.status === "game-over" ? undefined : board.activePlayer}
              prioritySeat={
                view.projectionFailure || view.status === "game-over" ? null : prioritySeat
              }
            />
          </SceneBoundary>
        </div>
        {portrait ? (
          <LandscapeNotice />
        ) : (
          <>
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
            {!beat && !inspect && board.clash && (
              <CombatAttackPath
                anchors={anchors}
                clash={board.clash}
                reducedMotion={reducedMotion}
              />
            )}
            {!beat && (
              <ArenaZoneBadges
                compact={compact}
                zones={displayZones}
                anchors={zoneAnchors}
                viewer={viewerSeat}
                highlighted={handDragging ? null : highlightedZone}
                destinationIds={destinationInput ? destinationIds : undefined}
              />
            )}
            {!beat && (
              <ZoneOverlay
                compact={compact}
                zones={displayZones}
                anchors={zoneAnchors}
                viewer={viewerSeat}
                onHighlight={setHighlightedZone}
                players={board.players}
                destinationIds={destinationInput ? destinationIds : undefined}
                onOpen={(zone) => {
                  if (destinationInput) {
                    if (!promptSurface.locked && destinationIds.has(zone.id)) {
                      promptSurface.select(zone.id);
                    }
                    return;
                  }
                  if (costRouteActive) return;
                  const first =
                    zone.zone === "oblivion"
                      ? board.cards.find(
                          (card) =>
                            card.zone === zone.zone &&
                            card.controller === zone.seat &&
                            canInspectCard(card, viewerSeat),
                        )
                      : undefined;
                  if (first) {
                    setInspect(first);
                    return;
                  }
                  setLibraryZone(zone);
                  setLibrary(true);
                }}
              />
            )}
            <PickExitFlights
              flights={pickExits}
              onDone={(id) =>
                setPickExits((current) => current.filter((flight) => flight.id !== id))
              }
            />
            <PickExitFlights flights={deckOrderReturn.flights} onDone={deckOrderReturn.finish} />
            {placementGhost && (
              <img
                className={styles.placementGhost}
                src={placementGhost.imageUrl}
                alt={placementGhost.label}
                draggable={false}
                style={{ left: placementGhost.left, top: placementGhost.top }}
              />
            )}
            {deckShuffle && (
              <div
                key={deckShuffle.id}
                className={styles.deckShuffleCue}
                style={{
                  left: deckShuffle.anchor.left,
                  top: deckShuffle.anchor.top,
                  width: deckShuffle.anchor.width,
                  height: deckShuffle.anchor.height,
                }}
              >
                <i style={{ backgroundImage: `url(${arenaAssets.back})` }} />
                <i style={{ backgroundImage: `url(${arenaAssets.back})` }} />
                <i style={{ backgroundImage: `url(${arenaAssets.back})` }} />
              </div>
            )}
            {handDrag &&
              handDragging &&
              [...new Set(draggedActions.map((route) => route.destination))].map((destination) => {
                const routes = draggedActions.filter((route) => route.destination === destination);
                const route = routes[0];
                const zone = route.zone;
                const anchor = zone
                  ? zoneAnchors.find((entry) => entry.id === zoneId(viewerSeat, zone))
                  : anchors.find((entry) => `card:${entry.id}` === destination);
                if (!anchor) return null;
                return (
                  <ArenaDropZone
                    key={destination}
                    anchor={anchor}
                    zone={route.zone ?? "clash"}
                    destination={destination}
                    label={routes.length > 1 ? "Choose action" : route.label}
                    description={
                      routes.length > 1 ? "Release, then choose the card action" : route.label
                    }
                  />
                );
              })}
            {decisionActive && (
              <ArenaAttentionLayer
                anchors={anchors}
                targetIds={attentionTargets}
                sceneCueIds={
                  new Set([
                    ...hand.map((card) => card.instanceId),
                    ...board.cards
                      .filter((card) => card.zone === "contender")
                      .map((card) => card.instanceId),
                    ...(promptSourceOnBoard && promptSourceId ? [promptSourceId] : []),
                  ])
                }
                payment={paymentStaging}
                paymentZone={
                  paymentStaging && !compact
                    ? zoneAnchors.find((zone) => zone.id === zoneId(viewerSeat, "resource"))
                    : undefined
                }
                engagedIds={paymentEngagedIds}
              />
            )}
            <div className={styles.cardTargets} aria-label="Board cards">
              {!openingBusy &&
                anchors.map((anchor) => {
                  const card = displayCards.find((p) => p.card.instanceId === anchor.id)?.card;
                  if (!card) return null;
                  const hit = anchor.hit ?? anchor;
                  const targetStyle: CSSProperties & Record<`--focus-${string}`, string> = {
                    left: hit.left,
                    top: hit.top,
                    width: hit.width,
                    height: hit.height,
                    zIndex: anchor.layer,
                    "--focus-left": `${anchor.left - hit.left - 3}px`,
                    "--focus-top": `${anchor.top - hit.top - 3}px`,
                    "--focus-width": `${anchor.width + 6}px`,
                    "--focus-height": `${anchor.height + 6}px`,
                  };
                  if (costRouteActive && card.zone === "hand" && card.instanceId === actionSourceId)
                    return null;
                  const interactionAvailable =
                    card.zone === "hand" &&
                    card.controller === viewerSeat &&
                    availableCards.has(card.instanceId);
                  const playAction = interactionAvailable
                    ? handPlayActionFor(card.instanceId)
                    : undefined;
                  const deployable =
                    interactionAvailable && resourceStep && resourceIds.includes(card.instanceId);
                  const clickHint =
                    draft.active && effectiveSelectableIds?.has(card.instanceId)
                      ? paymentInput
                        ? "Click to assign or remove this resource."
                        : attackDraft
                          ? "Click or Enter to attack this target. Right-click or Shift+Enter to inspect."
                          : "Click to select this card."
                      : deployable
                        ? "Click or Enter to deploy as a resource. Right-click or Shift+Enter to inspect."
                        : playAction
                          ? "Click or Enter to play. Right-click or Shift+Enter to inspect."
                          : directAttackIds.has(card.instanceId)
                            ? "Click or Enter to choose an attack target. Right-click or Shift+Enter to inspect."
                            : "Click to inspect.";
                  const mulliganCard = mulliganCardIds?.has(card.instanceId) === true;
                  const selectable =
                    mulliganCard || effectiveSelectableIds?.has(card.instanceId) === true;
                  const selected = (mulliganCard ? mulliganSelection : selectedInstanceIds).has(
                    card.instanceId,
                  );
                  const cardRoutes = dragActions.filter(
                    (route) => route.sourceId === card.instanceId,
                  );
                  if (handDrag && cardRoutes.length > 0) {
                    const destinations = [
                      ...new Set(
                        cardRoutes.map((route) =>
                          route.zone ? `${route.zone} zone` : "a highlighted card",
                        ),
                      ),
                    ].join(" or ");
                    return (
                      <div
                        key={anchor.id}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          inspectCard(card);
                        }}
                      >
                        <PointerDraggable
                          id={card.instanceId}
                          transformBehavior="overlay-only"
                          data-testid={`ac-card:${card.instanceId}`}
                          aria-label={`${directAttackIds.has(card.instanceId) ? "Attack with" : deployable ? "Deploy as resource" : playAction ? "Play" : "Inspect"} ${card.name ?? "card"}; drag to ${destinations}`}
                          title={
                            card.zone === "contender"
                              ? undefined
                              : `${clickHint} Drag to a highlighted target.`
                          }
                          onClick={() => chooseCard(card)}
                          onMouseEnter={() => setHovered(card.instanceId)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(card.instanceId)}
                          onBlur={() => setHovered(null)}
                          data-selectable={directAttackIds.has(card.instanceId) || undefined}
                          data-playable={interactionAvailable || undefined}
                          data-hand={card.zone === "hand" || undefined}
                          onKeyDownCapture={(event) => handleCardKey(event, card)}
                          className={styles.cardTarget}
                          style={targetStyle}
                        >
                          <span className={styles.screenReader}>
                            {clickHint} Drag to {destinations}.
                          </span>
                        </PointerDraggable>
                      </div>
                    );
                  }
                  return (
                    <button
                      key={anchor.id}
                      type="button"
                      style={targetStyle}
                      data-hand={card.zone === "hand" || undefined}
                      className={styles.cardTarget}
                      data-board-target-id={card.instanceId}
                      data-testid={`ac-card:${card.instanceId}`}
                      data-selectable={selectable || undefined}
                      data-payment-engaged={paymentEngagedIds.has(card.instanceId) || undefined}
                      aria-disabled={
                        (paymentStaging && card.zone === "resource" && !selectable) || undefined
                      }
                      aria-label={`${directAttackIds.has(card.instanceId) ? "Attack with" : selectable ? (attackDraft && selectedAttackerId ? "Attack target" : obstructionDraft ? "Obstruct with" : "Select") : deployable ? "Deploy as resource" : playAction ? "Play" : "Inspect"} ${card.faceDown ? "face-down card" : (card.name ?? "card")}${interactionAvailable ? ", interaction available" : ""}`}
                      aria-pressed={selectable ? selected : undefined}
                      data-mulligan-selected={(mulliganCard && selected) || undefined}
                      title={
                        mulliganCard
                          ? "Click to select. Right-click or Shift+Enter to inspect."
                          : clickHint
                      }
                      onMouseEnter={() => setHovered(card.instanceId)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(card.instanceId)}
                      onBlur={() => setHovered(null)}
                      onClick={() => chooseCard(card)}
                      onKeyDownCapture={(event) => handleCardKey(event, card)}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        inspectCard(card);
                      }}
                    ></button>
                  );
                })}
            </div>
            {!opening && targetHandles && !combatDraft && !inspect && !drawer && !library && (
              <BoardTargetHandles
                key={promptSurface.requestId}
                anchors={anchors}
                selectedIds={targetIds}
                ordered={
                  targetInput?.kind === "ordering" ||
                  (targetInput?.kind === "entity-selection" && !!targetInput.ordered)
                }
                reducedMotion={reducedMotion}
                activeSlot={targetSlot}
                onActivate={setTargetSlot}
                onRetarget={retarget}
              />
            )}
            <header className={styles.header}>
              <div className={styles.brand}>
                <img
                  src="https://cdn.tcg.online/public/thecardgoat/branding/logo-full-dark-440.webp"
                  alt="The Card Goat"
                />
              </div>
              <div className={styles.tools}>
                {!opening && !inspect && (
                  <ResourcePaymentControl
                    compact
                    automatic={autoPayEnabled}
                    onChange={changeAutoPay}
                  />
                )}
                {!opening && (
                  <button
                    type="button"
                    aria-label={portalLabel}
                    title={
                      portalAction?.disabledText
                        ? resolveInteractionText(portalAction.disabledText)
                        : portalLabel
                    }
                    aria-pressed={board.portalOpen}
                    disabled={!enabled || !portalAction?.enabled || !!draft.active || !!inspect}
                    onClick={() => portalAction && activate(portalAction)}
                  >
                    {board.portalOpen ? (
                      <CircleDot size={21} aria-hidden="true" />
                    ) : (
                      <CircleDashed size={21} aria-hidden="true" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  disabled={openingBusy}
                  aria-label="Cards & piles"
                  title="Cards & piles"
                  onClick={() => {
                    setLibraryZone(null);
                    setLibrary(true);
                  }}
                >
                  <Layers size={19} aria-hidden="true" />
                </button>
                <Popover
                  opened={settingsOpen}
                  onChange={setSettingsOpen}
                  position="bottom-end"
                  withArrow
                  trapFocus
                >
                  <Popover.Target>
                    <button
                      type="button"
                      aria-expanded={settingsOpen}
                      aria-label="Settings"
                      title="Sound and motion settings"
                      onClick={() => setSettingsOpen((open) => !open)}
                    >
                      <Settings size={19} aria-hidden="true" />
                    </button>
                  </Popover.Target>
                  <Popover.Dropdown style={{ background: "#101b24", color: "#edf0e7" }}>
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
                    <button type="button" onClick={() => setSettingsOpen(false)}>
                      Close settings
                    </button>
                  </Popover.Dropdown>
                </Popover>
                <button
                  type="button"
                  aria-label="Match"
                  title="Match menu"
                  onClick={() => setDrawer(true)}
                >
                  <Menu size={20} aria-hidden="true" />
                </button>
              </div>
            </header>
            {opening && (
              <div className={`${styles.turn} ${styles.openingTurn}`} role="status">
                <strong>
                  {board.openingHandsReady && (!beat || beat.id === "hand")
                    ? "HANDS READY"
                    : (beat?.title ?? status)}
                </strong>
                <span>{seatName(viewerSeat)}</span>
                {beat && <small>{beat.id === "hand" ? openingHint : beat.detail}</small>}
              </div>
            )}
            {(!beat || beat.localCount > 0) && maxPage > 0 && (
              <div className={styles.handInfo}>
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

            {dropNotice && (
              <p className={styles.dropNotice} role="status">
                {dropNotice}
              </p>
            )}
            <div
              className={styles.actions}
              data-priority-local={prioritySeat === viewerSeat || undefined}
              data-live-turn-console={!opening || undefined}
            >
              {!opening && turnPresentation && (
                <ArenaTurnConsole
                  {...turnPresentation}
                  combatMessage={
                    attackDraft
                      ? `Choose ${promptSurface.input?.id === "attackerId" ? "an attacker" : "a target for " + (board.cards.find((card) => card.instanceId === selectedAttackerId)?.name ?? "your attacker")}`
                      : board.clash
                        ? `${board.cards.find((card) => card.instanceId === board.clash?.attackerId)?.name ?? "Attacker"} is attacking ${board.cards.find((card) => card.instanceId === board.clash?.targetId)?.name ?? "the target"}`
                        : undefined
                  }
                  statusLabel={`${status}. Turn ${board.turnNumber}. Priority: ${prioritySeat === viewerSeat ? "You" : seatName(prioritySeat)}. Decision: ${(board.decisionSeat ?? prioritySeat) === viewerSeat ? "You" : seatName(board.decisionSeat ?? prioritySeat)}.`}
                  actions={turnActions}
                  instruction={
                    combatDraft && promptSurface.rejected
                      ? "Choice was not accepted. Check the highlighted cards and try again."
                      : attackDraft
                        ? selectedAttackerId
                          ? "Click a highlighted target to submit the attack. Right-click or Shift+Enter to inspect."
                          : "Click a ready attacker, then a highlighted target. Right-click or Shift+Enter to inspect."
                        : obstructionInput
                          ? obstructionCount
                            ? `${obstructionCount} selected. Click a selected card to remove it, then confirm.`
                            : obstructionInput.min > 0
                              ? "Click highlighted cards to obstruct."
                              : "Click highlighted cards to obstruct, or choose No obstruction."
                          : draft.active && promptSurface.input
                            ? resolveInteractionText(promptSurface.input.text)
                            : turnPresentation.instruction
                  }
                  onAction={activateTurnAction}
                  reducedMotion={reducedMotion}
                />
              )}
              {!opening && board.phaseName === "complete" && <p role="status">Match complete</p>}
              {opening && (
                <>
                  {opening && !beat && <p className={styles.setupHint}>{openingHint}</p>}
                  <div className={styles.secondaryActions}>
                    {declareMulligan && !openingBusy && (
                      <button
                        className={`${styles.assetButton} ${styles.primary} ${styles.replaceButton}`}
                        aria-label={
                          openingScene && mulliganSelection.size > 0
                            ? `Replace ${mulliganSelection.size} selected ${mulliganSelection.size === 1 ? "card" : "cards"}`
                            : undefined
                        }
                        disabled={!enabled}
                        onClick={() => activate(declareMulligan)}
                      >
                        <span>
                          {openingScene && mulliganSelection.size > 0
                            ? `Replace ${mulliganSelection.size}`
                            : "Take mulligan"}
                        </span>
                        <ChevronRight size={18} className={styles.actionArrow} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {(!openingScene || !board.openingHandsReady || openingBusy) &&
                    !resourceStep &&
                    !retrieving &&
                    !(
                      draft.active &&
                      (promptSurface.input?.kind === "entity-allocation" ||
                        promptSurface.input?.kind === "number" ||
                        promptSurface.input?.kind === "boolean" ||
                        (promptSurface.input?.kind === "option-selection" &&
                          promptSurface.input.max === 1 &&
                          promptSurface.input.options.length <= 6))
                    ) && (
                      <button
                        className={`${styles.assetButton} ${styles.primary}`}
                        data-action-attention-target
                        aria-label={
                          openingScene && !openingBusy && next?.id === "mulligan"
                            ? `Replace ${mulliganSelection.size} selected ${mulliganSelection.size === 1 ? "card" : "cards"}`
                            : undefined
                        }
                        disabled={openingBusy || !enabled || (!next && !draft.active)}
                        onClick={() => {
                          if (draft.active && promptSurface.input) {
                            if (promptSurface.canConfirm) promptSurface.confirm();
                            else promptSurface.restore();
                          } else if (draft.active) setDrawer(true);
                          else if (next) activate(next);
                        }}
                      >
                        <span>
                          {openingBusy
                            ? "Preparing…"
                            : openingScene && next?.id === "mulligan"
                              ? mulliganSelection.size
                                ? `Replace ${mulliganSelection.size}`
                                : "Replace none"
                              : draft.active
                                ? promptSurface.canConfirm
                                  ? "Confirm choice"
                                  : "Choose cards"
                                : next
                                  ? next.intent === "resource-card"
                                    ? "Deploy resource"
                                    : next.id === "passCounter" && board.responseWindow
                                      ? `Pass · ${seatName(board.responseWindow.openFor)}`
                                      : resolveInteractionText(next.text)
                                  : "Waiting"}
                        </span>
                        <ChevronRight className={styles.actionArrow} size={18} aria-hidden="true" />
                      </button>
                    )}
                </>
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
          <div className={styles.practiceTools}>{utilities}</div>
          <ResourcePaymentControl automatic={autoPayEnabled} onChange={changeAutoPay} />
          {controls}
        </Drawer>
        {!portrait &&
          !inspect &&
          !library &&
          !drawer &&
          !draft.active &&
          view.status === "choosing" && (
            <EffectPlayPrompt
              actions={view.actions.filter((action) => action.id.startsWith("resolveEffectPlay:"))}
              disabled={!enabled}
              onChoose={activate}
            />
          )}
        {!inspect &&
          !library &&
          !drawer &&
          costRouteActive &&
          promptSurface.input?.id === "costRoute" && (
            <CostRouteCastPrompt
              surface={promptSurface}
              card={
                actionSourceCard
                  ? {
                      name: actionSourceCard.name ?? "Card",
                      imageUrl: cardArtwork(actionSourceCard) ?? arenaAssets.back,
                    }
                  : undefined
              }
              compact={compact}
            />
          )}
        {!portrait && !inspect && !library && !drawer && !costRouteActive && retrieving && (
          <SearchRetrievePrompt
            surface={promptSurface}
            cards={promptCards}
            onExitPlan={handlePickExit}
          />
        )}
        {!portrait &&
          !inspect &&
          !library &&
          !drawer &&
          !retrieving &&
          allocationTargetsAnchored && (
            <BoardAllocation
              key={promptSurface.requestId}
              input={
                promptSurface.input?.kind === "entity-allocation" ? promptSurface.input : undefined
              }
              surface={promptSurface}
              anchors={anchors}
              labels={new Map([...promptCards].map(([id, card]) => [id, card.label]))}
              sourceArt={
                promptSurface.action?.source
                  ? promptCards.get(promptSurface.action.source.instanceId)?.imageUrl
                  : undefined
              }
              reducedMotion={reducedMotion}
              onAdjust={() => {
                if (sound) playSimulatorSound("counter.land", () => !document.hidden);
              }}
            />
          )}
        {!portrait &&
          !inspect &&
          !library &&
          !drawer &&
          !retrieving &&
          paymentInput &&
          !autoPayEnabled && (
            <PaymentStage
              compact={compact}
              surface={promptSurface}
              input={paymentInput}
              reducedMotion={reducedMotion}
              sceneOwnsCard
              source={(() => {
                const sourceCard = promptSurface.action?.source
                  ? promptCards.get(promptSurface.action.source.instanceId)
                  : undefined;
                return sourceCard
                  ? { name: sourceCard.label, imageUrl: sourceCard.imageUrl }
                  : undefined;
              })()}
            />
          )}
        {!portrait &&
          !inspect &&
          !library &&
          !drawer &&
          !retrieving &&
          !compact &&
          declarationFeature &&
          declarationAnchor && (
            <ResolutionFocusCard
              key={promptSurface.requestId}
              caption="Choosing target"
              art={declarationFeature.imageUrl}
              name={declarationFeature.label}
              panelSide="left"
              flightFrom={{
                left: declarationAnchor.left,
                top: declarationAnchor.top,
                width: declarationAnchor.width,
                height: declarationAnchor.height,
              }}
              reducedMotion={reducedMotion}
              children={null}
            />
          )}
        {!portrait &&
          !inspect &&
          !library &&
          !drawer &&
          !(costRouteActive && promptSurface.input?.id === "costRoute") &&
          !opening &&
          !retrieving &&
          !allocationTargetsAnchored &&
          !combatDraft && (
            <SharedInteractionPrompt
              onChoose={() => {
                if (sound) playSimulatorSound("effect.trigger", () => !document.hidden);
              }}
              onCue={(cue) => {
                if (sound && !document.hidden) playSimulatorSound(cue);
              }}
              suppressCostSlots
              autoSubmitSingleTarget
              numberedOrdering
              reducedMotion={reducedMotion}
              onOrderMove={() => {
                if (sound) playSimulatorSound("card.move", () => !document.hidden);
              }}
              surface={promptSurface}
              view={view}
              viewerId={view.actorId}
              cards={promptCards}
              confirmOnBoard={promptSurface.input?.kind !== "number"}
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
        {inspect && !portrait && (
          <CardInspectionControls
            label={inspect.name ?? "Card inspection"}
            onClose={inspection.dismiss}
          >
            {attackDraft &&
              targetInput?.kind === "entity-selection" &&
              targetInput.id === "targetId" &&
              targetInput.candidates.some(
                (candidate) =>
                  candidate.enabled && candidate.entity.instanceId === inspect.instanceId,
              ) && (
                <button
                  type="button"
                  className={`${styles.assetButton} ${styles.primary}`}
                  disabled={!enabled || promptSurface.locked}
                  onClick={() => {
                    setInspect(null);
                    chooseCard(inspect);
                  }}
                >
                  Attack this target
                </button>
              )}
            {inspect.zone === "hand" && inspect.controller === viewerSeat && !openingBusy && (
              <div className={styles.inspectionBrowse} role="group" aria-label="Arrange your hand">
                <button
                  disabled={handIndex <= 0}
                  onClick={() => moveInHand(inspect.instanceId, -1)}
                >
                  Move left
                </button>
                <span aria-live="polite">
                  {" "}
                  Position {handIndex + 1} of {hand.length}{" "}
                </span>
                <button
                  disabled={handIndex >= hand.length - 1}
                  onClick={() => moveInHand(inspect.instanceId, 1)}
                >
                  Move right
                </button>
              </div>
            )}
            {inspectionPile.length > 0 && (
              <div
                className={styles.inspectionBrowse}
                role="group"
                aria-label="Browse pile in game order"
              >
                <button
                  disabled={inspectionIndex <= 0}
                  onClick={() => setInspect(inspectionPile[inspectionIndex - 1])}
                >
                  Previous card
                </button>
                <span aria-live="polite">
                  {" "}
                  Card {inspectionIndex + 1} of {inspectionPile.length}{" "}
                </span>
                <button
                  disabled={inspectionIndex >= inspectionPile.length - 1}
                  onClick={() => setInspect(inspectionPile[inspectionIndex + 1])}
                >
                  Next card
                </button>
              </div>
            )}
            {visibleCounters(inspect.counters).length > 0 && (
              <div className={styles.inspectionCounters} aria-label="Counters on this card">
                {visibleCounters(inspect.counters).map(([kind, count]) => (
                  <span key={kind} style={{ borderColor: counterAppearance(kind).color }}>
                    {kind} <b>{count}</b>
                  </span>
                ))}
              </div>
            )}
            {resourceAction && resourceInput && resourceIds.includes(inspect.instanceId) && (
              <button
                type="button"
                className={styles.assetButton}
                disabled={!enabled || !!draft.active}
                onClick={() => {
                  setInspect(null);
                  draft.begin(resourceAction.id, { [resourceInput.id]: [inspect.instanceId] });
                }}
              >
                Deploy as resource
              </button>
            )}
            {inspectActions.some((action) =>
              action.inputs.some(
                (input) =>
                  input.kind === "option-selection" &&
                  (input.presentation?.kind === "cost-slots" || input.id === "xResourcePayment"),
              ),
            ) && <ResourcePaymentControl automatic={autoPayEnabled} onChange={changeAutoPay} />}
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
          returnFocus={!inspect}
          onClose={() => setLibrary(false)}
          title={
            libraryZone
              ? `${libraryZone.seat === viewerSeat ? "Your" : "Opponent’s"} ${libraryZone.name.toLowerCase()}`
              : "Cards & targets"
          }
          mode={librarySelecting ? "select" : "inspect"}
          cards={visibleLibraryCards.map((card) => ({
            id: card.instanceId,
            label: canInspectCard(card, viewerSeat) ? (card.name ?? "Card") : "Face-down card",
            imageUrl: canInspectCard(card, viewerSeat)
              ? (cardArtwork(card) ?? arenaAssets.back)
              : arenaAssets.back,
            enabled:
              canInspectCard(card, viewerSeat) || selectableInstanceIds?.has(card.instanceId),
            detail: `${card.controller === viewerSeat ? "You" : "Opponent"} · ${card.zone}`,
            stackKey: ["deck", "oblivion", "resource"].includes(card.zone)
              ? (card.definitionId ?? undefined)
              : undefined,
            card,
          }))}
          filter={librarySelecting ? (target) => selectableInstanceIds.has(target.id) : undefined}
          selectedIds={selectedInstanceIds}
          emptyMessage={
            libraryZone?.zone === "deck"
              ? "Deck order and card identities are hidden."
              : libraryZone?.zone === "hand" && libraryZone.seat !== viewerSeat
                ? "The opponent’s hand is hidden."
                : draft.active
                  ? "No legal targets in this zone."
                  : "This zone is empty."
          }
          description={
            librarySelecting
              ? "Choose from the legal targets for your current action."
              : libraryZone?.zone === "deck"
                ? "Only cards visible to you are shown. Other deck identities and order stay hidden."
                : undefined
          }
          onCard={(target) => {
            if (librarySelecting) {
              chooseCard(target.card);
            } else if (canInspectCard(target.card, viewerSeat)) {
              setInspect({ ...target.card, faceDown: false });
              setLibrary(false);
            }
          }}
        />
      </section>
    </PointerDragDropSurface>
  );
}
