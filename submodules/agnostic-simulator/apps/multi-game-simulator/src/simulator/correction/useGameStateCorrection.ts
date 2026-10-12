import { useCallback, useEffect, useRef, useState } from "react";
import type { PendingProposal, PlayableGameSlug } from "@tcg/protocol";
import { acquireRootGatewayHandle } from "../../lib/gateway/root-socket";

/** Shared proposal lifecycle. The server is the sole source of correction permission. */
export function useGameStateCorrection(options: {
  gameSlug: PlayableGameSlug;
  gameId: string | undefined;
  viewerId: string | undefined;
  stateVersion: number;
  connected: boolean;
  onError: (message: string) => void;
}) {
  const { gameSlug, gameId, viewerId, stateVersion, connected } = options;
  const [enabled, setEnabled] = useState(false);
  const [proposal, setProposal] = useState<PendingProposal | null>(null);
  const errorRef = useRef(options.onError);
  errorRef.current = options.onError;
  useEffect(() => {
    setEnabled(false);
    setProposal(null);
    if (!gameId || !viewerId) return;
    const handle = acquireRootGatewayHandle(gameSlug);
    const resolved = (payload: { gameId: string; actionType: string; resolution: string }) => {
      if (
        payload.gameId !== gameId ||
        !["enable_manual_mode", "disable_manual_mode"].includes(payload.actionType)
      )
        return;
      setProposal(null);
      if (payload.resolution === "accepted")
        setEnabled(payload.actionType === "enable_manual_mode");
    };
    const unsubscribers = [
      handle.on("game_joined", (payload) => {
        if (payload.gameId !== gameId) return;
        setEnabled(payload.manualModeEnabled === true);
        setProposal(
          payload.pendingProposal?.actionType === "enable_manual_mode"
            ? payload.pendingProposal
            : null,
        );
      }),
      handle.on("proposal_received", (payload) => {
        if (payload.gameId === gameId && payload.actionType === "enable_manual_mode")
          setProposal({ ...payload, actionType: "enable_manual_mode" });
      }),
      handle.on("proposal_resolved", resolved),
      handle.on("proposal_expired", (payload) => {
        if (payload.gameId === gameId && payload.actionType === "enable_manual_mode")
          setProposal(null);
      }),
      handle.on("proposal_send:response", (response) => {
        if (response.status === "err") {
          errorRef.current(response.data.message);
          return;
        }
        if ("resolution" in response.data) resolved(response.data);
        else if (
          response.data.gameId === gameId &&
          response.data.actionType === "enable_manual_mode"
        )
          setProposal({ ...response.data, actionType: "enable_manual_mode" });
      }),
      handle.on("proposal_accept:response", (response) => {
        if (response.status === "err") errorRef.current(response.data.message);
        else resolved(response.data);
      }),
      handle.on("proposal_decline:response", (response) => {
        if (response.status === "err") errorRef.current(response.data.message);
        else resolved(response.data);
      }),
    ];
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.release();
    };
  }, [gameId, gameSlug, viewerId]);
  useEffect(() => {
    if (!proposal) return;
    const timeout = window.setTimeout(
      () => setProposal((current) => (current?.deadline === proposal.deadline ? null : current)),
      Math.max(0, proposal.deadline - Date.now()),
    );
    return () => window.clearTimeout(timeout);
  }, [proposal]);
  const sendProposal = useCallback(
    (
      actionType: "enable_manual_mode" | "disable_manual_mode",
      event: "proposal_send" | "proposal_accept" | "proposal_decline" = "proposal_send",
    ) => {
      if (!gameId || !viewerId || !connected) return false;
      const handle = acquireRootGatewayHandle(gameSlug);
      if (handle.wouldHoldEmit()) {
        handle.release();
        return false;
      }
      handle.emit(event, { gameId, actionType });
      handle.release();
      return true;
    },
    [gameId, gameSlug, viewerId, connected],
  );
  const execute = useCallback(
    (moveType: string, payload: Record<string, unknown>) => {
      if (!enabled || !connected || !gameId || !viewerId) return false;
      const handle = acquireRootGatewayHandle(gameSlug);
      if (handle.wouldHoldEmit()) {
        handle.release();
        return false;
      }
      handle.emit("execute_move", {
        gameId,
        expectedVersion: stateVersion,
        moveType,
        payload,
        correlationId: crypto.randomUUID(),
      });
      handle.release();
      return true;
    },
    [enabled, connected, gameId, gameSlug, stateVersion, viewerId],
  );
  return {
    enabled,
    proposal,
    execute,
    request: () => sendProposal("enable_manual_mode"),
    exit: () => sendProposal("disable_manual_mode"),
    accept: () => sendProposal("enable_manual_mode", "proposal_accept"),
    decline: () => sendProposal("enable_manual_mode", "proposal_decline"),
  };
}
