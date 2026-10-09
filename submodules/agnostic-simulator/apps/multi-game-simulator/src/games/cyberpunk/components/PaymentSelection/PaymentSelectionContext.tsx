import {
  availableEddies,
  computeEffectiveCost,
  abilityEddieCost,
  callLegendEddieCost,
  defOf,
  goSoloCost,
  legendCanPayEddie,
  reservedLegendIdsForAbilityCosts,
  spendReadyLegendsForEddies,
  type CardInstanceId,
} from "@tcg/cyberpunk-engine";
import { useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { PLAYER_SIDE_TO_ID, useEngine } from "../../engine";
import { useUserConfig } from "../../engine/UserConfigContext";
import {
  PaymentSelectionContext,
  type PaymentAction,
  type PaymentSelectionContextValue,
} from "./paymentSelectionContextValue";

export function PaymentSelectionProvider({ children }: { readonly children: ReactNode }) {
  const engine = useEngine();
  const { choosePaymentSources } = useUserConfig();
  const [pendingAction, setPendingAction] = useState<PaymentAction | null>(null);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
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
      case "activateAbility": {
        const card = engine.matchState.G.cardIndex[pendingAction.cardId];
        const ability = card ? defOf(card).abilities[pendingAction.abilityIndex] : undefined;
        return ability
          ? abilityEddieCost(
              ability,
              engine.matchState,
              pendingAction.cardId as CardInstanceId,
              playerId,
            )
          : 0;
      }
      case "resolveRedirectDefeat": {
        const choice = engine.matchState.G.turnMetadata.pendingChoice;
        return choice?.type === "redirectDefeat" && !pendingAction.pass ? choice.payload.cost : 0;
      }
      case "resolveCardToPlay": {
        const choice = engine.matchState.G.turnMetadata.pendingChoice;
        if (choice?.type !== "chooseCardToPlay" || choice.payload.free || !pendingAction.cardId) {
          return 0;
        }
        return computeEffectiveCost(
          engine.matchState,
          pendingAction.cardId as CardInstanceId,
          playerId,
        );
      }
    }
  }, [engine.matchState, pendingAction, playerId]);

  const paymentCardId = useMemo(() => {
    if (!pendingAction || !("cardId" in pendingAction) || !pendingAction.cardId) return null;
    return String(pendingAction.cardId);
  }, [pendingAction]);

  /** Legends that must stay ready because the action spends them as its own cost. */
  const reservedLegendIdsForAction = useCallback(
    (action: PaymentAction): ReadonlySet<string> => {
      const reserved = new Set<string>();
      if (action.type === "activateAbility") {
        const source = engine.matchState.G.cardIndex[action.cardId];
        const ability = source ? defOf(source).abilities[action.abilityIndex] : undefined;
        if (ability) {
          for (const id of reservedLegendIdsForAbilityCosts(
            ability,
            engine.matchState,
            action.cardId as CardInstanceId,
            playerId,
          )) {
            reserved.add(String(id));
          }
        }
      }
      return reserved;
    },
    [engine.matchState, playerId],
  );

  const eligibleSourcesForAction = useCallback(
    (action: PaymentAction) => {
      const player = engine.matchState.G.players[String(playerId)];
      if (!player) return new Set<string>();
      const reservedLegendIds = reservedLegendIdsForAction(action);
      return new Set(
        [...player.eddieCardIds, ...player.zones.legendArea].flatMap((id) => {
          const card = engine.matchState.G.cardIndex[String(id)];
          if (!card || card.meta.spent || reservedLegendIds.has(String(id))) return [];
          const legal =
            card.zone === "eddieArea" || (card.zone === "legendArea" && legendCanPayEddie(card));
          if (!legal) return [];
          return [String(id)];
        }),
      );
    },
    [engine.matchState, playerId, reservedLegendIdsForAction],
  );

  const eligiblePaymentSourceIds = useMemo(
    () => (pendingAction ? eligibleSourcesForAction(pendingAction) : new Set<string>()),
    [eligibleSourcesForAction, pendingAction],
  );

  const costForAction = useCallback(
    (action: PaymentAction) => {
      switch (action.type) {
        case "playCard":
          return computeEffectiveCost(engine.matchState, action.cardId as CardInstanceId, playerId);
        case "callLegend":
          return callLegendEddieCost(engine.matchState, playerId);
        case "goSolo":
          return goSoloCost(engine.matchState, action.cardId as CardInstanceId, playerId);
        case "activateAbility": {
          const card = engine.matchState.G.cardIndex[action.cardId];
          const ability = card ? defOf(card).abilities[action.abilityIndex] : undefined;
          return ability
            ? abilityEddieCost(
                ability,
                engine.matchState,
                action.cardId as CardInstanceId,
                playerId,
              )
            : 0;
        }
        case "resolveRedirectDefeat": {
          const choice = engine.matchState.G.turnMetadata.pendingChoice;
          return choice?.type === "redirectDefeat" && !action.pass ? choice.payload.cost : 0;
        }
        case "resolveCardToPlay": {
          const choice = engine.matchState.G.turnMetadata.pendingChoice;
          if (choice?.type !== "chooseCardToPlay" || choice.payload.free || !action.cardId) {
            return 0;
          }
          return computeEffectiveCost(engine.matchState, action.cardId as CardInstanceId, playerId);
        }
      }
    },
    [engine.matchState, playerId],
  );

  const dispatchCostedAction = useCallback(
    (action: PaymentAction) => {
      if (!choosePaymentSources) {
        const result = engine.dispatch(action);
        return result.success;
      }
      const cost = costForAction(action);
      // The engine's Eddie total covers the numeric pool plus every ready
      // Legend that can pay (face-up with a Sell Tag and hidden ones). A cost
      // using that full pool leaves no meaningful choice, so skip selection.
      if (cost === 0 || cost === availableEddies(engine.matchState, playerId)) {
        const result = engine.dispatch(action);
        return result.success;
      }
      setSelectedSourceIds([]);
      setPendingAction(action);
      return true;
    },
    [choosePaymentSources, costForAction, engine, playerId],
  );

  const dismiss = useCallback(() => {
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

      setPendingAction(null);
      setSelectedSourceIds([]);
      engine.dispatch({ ...pendingAction, paymentSourceIds: nextSourceIds });
    },
    [eligiblePaymentSourceIds, engine, paymentCost, pendingAction, selectedSourceIds],
  );

  const selectedPaymentSourceIds = useMemo(() => new Set(selectedSourceIds), [selectedSourceIds]);

  const payAutomatically = useCallback(() => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    setSelectedSourceIds([]);
    // Nothing picked: the engine's own payment order is exactly what "pay
    // automatically" means (Eddie pool first, then Legends by spend priority,
    // e.g. a Go Solo Legend funding itself before its crew).
    if (selectedSourceIds.length === 0) {
      engine.dispatch(action);
      return;
    }
    // Keep the player's picks and let the engine priority fill the remainder.
    // The pool covers as much as it can; Legends only cover the shortfall, so
    // a hand-picked Legend is never double-charged by the auto pass.
    const player = engine.matchState.G.players[String(playerId)];
    const pool = player?.eddies ?? 0;
    const selectedLegendCount = selectedSourceIds.filter(
      (id) => engine.matchState.G.cardIndex[id]?.zone === "legendArea",
    ).length;
    const autoLegendCount = Math.max(0, paymentCost - selectedLegendCount - pool);
    const autoLegendIds =
      autoLegendCount > 0
        ? spendReadyLegendsForEddies(engine.matchState.G, playerId, autoLegendCount, [
            ...selectedSourceIds,
            ...reservedLegendIdsForAction(action),
          ] as CardInstanceId[]).map(String)
        : [];
    engine.dispatch({
      ...action,
      paymentSourceIds: [...selectedSourceIds, ...autoLegendIds],
    });
  }, [engine, paymentCost, pendingAction, playerId, reservedLegendIdsForAction, selectedSourceIds]);

  useEffect(() => {
    if (!pendingAction) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target;
      const isTextEntry =
        target instanceof HTMLElement &&
        (target.isContentEditable || target.matches("input, textarea, select, [role='textbox']"));
      if (event.key === "Enter" && !event.repeat && !isTextEntry) {
        event.preventDefault();
        payAutomatically();
        return;
      }
      if (event.key !== "Escape") return;
      event.preventDefault();
      dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dismiss, payAutomatically, pendingAction]);

  const value = useMemo<PaymentSelectionContextValue>(
    () => ({
      paymentSelectionActive: pendingAction !== null,
      paymentCost,
      selectedPaymentCount: selectedSourceIds.length,
      paymentCardId,
      eligiblePaymentSourceIds,
      selectedPaymentSourceIds,
      payAutomatically,
      togglePaymentSource,
      cancelPaymentSelection: dismiss,
      dispatchCostedAction,
    }),
    [
      dismiss,
      dispatchCostedAction,
      eligiblePaymentSourceIds,
      paymentCost,
      pendingAction,
      selectedPaymentSourceIds,
      payAutomatically,
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
