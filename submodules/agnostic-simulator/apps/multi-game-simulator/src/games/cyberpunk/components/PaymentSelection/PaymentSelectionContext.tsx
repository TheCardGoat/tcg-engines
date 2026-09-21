import {
  computeEffectiveCost,
  callLegendEddieCost,
  goSoloCost,
  legendCanPayEddie,
  type CardInstanceId,
  type CommandResult,
} from "@tcg/cyberpunk-engine";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useSimulatorSettings } from "../../../../simulator/settings";
import { PLAYER_SIDE_TO_ID, useEngine, type EngineAction } from "../../engine";

type PaymentAction = Extract<EngineAction, { type: "playCard" | "callLegend" | "goSolo" }>;
type DispatchResult = CommandResult | { success: false; error: string };
type DispatchFollowUp = (result: DispatchResult) => void;

interface PaymentSelectionContextValue {
  readonly nextPaymentSelectionArmed: boolean;
  readonly paymentSelectionActive: boolean;
  readonly paymentCost: number;
  readonly selectedPaymentCount: number;
  readonly eligiblePaymentSourceIds: ReadonlySet<string>;
  readonly selectedPaymentSourceIds: ReadonlySet<string>;
  readonly toggleNextPaymentSelection: () => void;
  readonly togglePaymentSource: (sourceId: string) => void;
  readonly cancelPaymentSelection: () => void;
  /**
   * Route a costed action (playCard / callLegend / goSolo) through the
   * payment-selection gate. In "choose" mode — or when the one-shot arm is
   * set — the action enters board payment selection instead of dispatching,
   * and `onExecuted` fires with the dispatch result after the final required
   * source is clicked. Direct dispatches invoke it immediately.
   */
  readonly dispatchCostedAction: (action: PaymentAction, onExecuted?: DispatchFollowUp) => boolean;
}

const PaymentSelectionContext = createContext<PaymentSelectionContextValue | null>(null);

export function PaymentSelectionProvider({ children }: { readonly children: ReactNode }) {
  const engine = useEngine();
  const {
    settings: { paymentSelectionMode },
  } = useSimulatorSettings();
  const [nextPaymentSelectionArmed, setNextPaymentSelectionArmed] = useState(false);
  const [pendingAction, setPendingAction] = useState<PaymentAction | null>(null);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const onExecutedRef = useRef<DispatchFollowUp | null>(null);
  const playerId = PLAYER_SIDE_TO_ID[engine.humanSide];

  const paymentCost = useMemo(() => {
    if (!pendingAction) return 0;
    switch (pendingAction.type) {
      case "playCard":
        return computeEffectiveCost(
          engine.matchState,
          pendingAction.cardId as CardInstanceId,
          playerId,
        );
      case "callLegend":
        return callLegendEddieCost(engine.matchState, playerId);
      case "goSolo":
        return goSoloCost(engine.matchState, pendingAction.cardId as CardInstanceId, playerId);
    }
  }, [engine.matchState, pendingAction, playerId]);

  const eligiblePaymentSourceIds = useMemo(() => {
    const player = engine.matchState.G.players[String(playerId)];
    if (!player) return new Set<string>();
    return new Set(
      [...player.eddieCardIds, ...player.zones.legendArea].flatMap((id) => {
        const card = engine.matchState.G.cardIndex[String(id)];
        if (!card || card.meta.spent) return [];
        const legal =
          card.zone === "eddieArea" || (card.zone === "legendArea" && legendCanPayEddie(card));
        if (!legal) return [];
        return [String(id)];
      }),
    );
  }, [engine.matchState, playerId]);

  const costForAction = useCallback(
    (action: PaymentAction) => {
      switch (action.type) {
        case "playCard":
          return computeEffectiveCost(engine.matchState, action.cardId as CardInstanceId, playerId);
        case "callLegend":
          return callLegendEddieCost(engine.matchState, playerId);
        case "goSolo":
          return goSoloCost(engine.matchState, action.cardId as CardInstanceId, playerId);
      }
    },
    [engine.matchState, playerId],
  );

  const dispatchCostedAction = useCallback(
    (action: PaymentAction, onExecuted?: DispatchFollowUp) => {
      if (paymentSelectionMode === "automatic" && !nextPaymentSelectionArmed) {
        const result = engine.dispatch(action);
        onExecuted?.(result);
        return result.success;
      }
      if (costForAction(action) === 0) {
        setNextPaymentSelectionArmed(false);
        const result = engine.dispatch(action);
        onExecuted?.(result);
        return result.success;
      }
      setNextPaymentSelectionArmed(false);
      setSelectedSourceIds([]);
      onExecutedRef.current = onExecuted ?? null;
      setPendingAction(action);
      return true;
    },
    [costForAction, engine, nextPaymentSelectionArmed, paymentSelectionMode],
  );

  const dismiss = useCallback(() => {
    onExecutedRef.current = null;
    setPendingAction(null);
    setSelectedSourceIds([]);
  }, []);

  const togglePaymentSource = useCallback(
    (sourceId: string) => {
      if (!pendingAction || !eligiblePaymentSourceIds.has(sourceId)) return;
      if (selectedSourceIds.includes(sourceId)) {
        setSelectedSourceIds(selectedSourceIds.filter((id) => id !== sourceId));
        return;
      }
      if (selectedSourceIds.length >= paymentCost) return;

      const nextSourceIds = [...selectedSourceIds, sourceId];
      if (nextSourceIds.length < paymentCost) {
        setSelectedSourceIds(nextSourceIds);
        return;
      }

      const followUp = onExecutedRef.current;
      onExecutedRef.current = null;
      setPendingAction(null);
      setSelectedSourceIds([]);
      const result = engine.dispatch({ ...pendingAction, paymentSourceIds: nextSourceIds });
      followUp?.(result);
    },
    [eligiblePaymentSourceIds, engine, paymentCost, pendingAction, selectedSourceIds],
  );

  useEffect(() => {
    if (!pendingAction) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dismiss, pendingAction]);

  const selectedPaymentSourceIds = useMemo(() => new Set(selectedSourceIds), [selectedSourceIds]);

  const value = useMemo<PaymentSelectionContextValue>(
    () => ({
      nextPaymentSelectionArmed,
      paymentSelectionActive: pendingAction !== null,
      paymentCost,
      selectedPaymentCount: selectedSourceIds.length,
      eligiblePaymentSourceIds,
      selectedPaymentSourceIds,
      toggleNextPaymentSelection: () => setNextPaymentSelectionArmed((armed) => !armed),
      togglePaymentSource,
      cancelPaymentSelection: dismiss,
      dispatchCostedAction,
    }),
    [
      dismiss,
      dispatchCostedAction,
      eligiblePaymentSourceIds,
      nextPaymentSelectionArmed,
      paymentCost,
      pendingAction,
      selectedPaymentSourceIds,
      selectedSourceIds.length,
      togglePaymentSource,
    ],
  );

  return (
    <PaymentSelectionContext.Provider value={value}>{children}</PaymentSelectionContext.Provider>
  );
}

export function usePaymentSelection(): PaymentSelectionContextValue {
  const context = useContext(PaymentSelectionContext);
  if (!context) throw new Error("usePaymentSelection must be used inside PaymentSelectionProvider");
  return context;
}

/** Non-throwing variant for card surfaces that may render outside the board tree. */
export function usePaymentSelectionOptional(): PaymentSelectionContextValue | null {
  return useContext(PaymentSelectionContext);
}
