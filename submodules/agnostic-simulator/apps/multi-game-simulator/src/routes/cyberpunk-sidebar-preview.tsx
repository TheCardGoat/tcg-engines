import { useEffect, useState } from "react";
import { CyberpunkSimulatorProviders } from "../games/cyberpunk/App";
import { BoardSharedPage } from "../games/cyberpunk/pages/BoardShared.page";

/** Local visual fixture. Identities, supporter tiers, and scores are illustrative. */
export default function CyberpunkSidebarPreview() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!import.meta.env.DEV || !mounted) return null;
  return (
    <CyberpunkSimulatorProviders>
      <BoardSharedPage
        scenarioId="openingMain"
        playerIdentities={{
          player: { id: "preview-self", displayName: "WazaR Testing" },
          opponent: { id: "preview-rival", displayName: "ChoomRideOrDie", isMobile: true },
        }}
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
        playerConnections={{
          player: { status: "connected" },
          opponent: { status: "connected" },
        }}
        liveMatchSidebar={{
          matchId: "sidebar-preview",
          gameId: "sidebar-preview-game",
          format: "best_of_1",
          gameNumber: 1,
          localPlayerId: "preview-self",
          player1Score: 1,
          player2Score: 0,
          participants: [
            {
              id: "preview-self",
              userId: "preview-self-user",
              seat: 1,
              displayName: "WazaR Testing",

              subscriptionTier: "tier3",
              mmrAtMatch: 1500,
            },
            {
              id: "preview-rival",
              userId: "preview-rival-user",
              seat: 2,
              displayName: "ChoomRideOrDie",
              isMobile: true,

              subscriptionTier: "tier2",
              mmrAtMatch: 1450,
            },
          ],
        }}
      />
    </CyberpunkSimulatorProviders>
  );
}
