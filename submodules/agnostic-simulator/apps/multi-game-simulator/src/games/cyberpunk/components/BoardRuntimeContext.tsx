import { createContext, useContext, type ReactNode } from "react";
import type { SimulatorConnectionDiagnosticInput } from "@tcg/game-page-contract/connection-diagnostic";

import type { PlayerConnectionBySide, PlayerIdentityBySide } from "../engine";

export type LiveMatchSidebarParticipant = PlayerIdentityBySide["player"] & {
  seat: 1 | 2;
  userId?: string;
  deckName?: string;
  deckListId?: string;
};

export interface LiveMatchSidebarConfig {
  matchId: string;
  gameId: string;
  localPlayerId?: string;
  participants: ReadonlyArray<LiveMatchSidebarParticipant>;
  player1Score?: number;
  player2Score?: number;
  returnUrl?: string;
}

export interface CyberpunkBoardRuntimeContextValue {
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  liveMatchSidebar?: LiveMatchSidebarConfig;
}

const CyberpunkBoardRuntimeContext = createContext<CyberpunkBoardRuntimeContextValue>({});

export function CyberpunkBoardRuntimeProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: CyberpunkBoardRuntimeContextValue;
}) {
  return (
    <CyberpunkBoardRuntimeContext.Provider value={value}>
      {children}
    </CyberpunkBoardRuntimeContext.Provider>
  );
}

export function useCyberpunkBoardRuntime(): CyberpunkBoardRuntimeContextValue {
  return useContext(CyberpunkBoardRuntimeContext);
}
