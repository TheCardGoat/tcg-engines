import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FleshAndBloodSimulatorProviders } from "../games/flesh-and-blood/App";
import { FleshAndBloodTabletop } from "../games/flesh-and-blood/FleshAndBloodTabletop";
import { createOpeningFixtureRuntime } from "../games/flesh-and-blood/fixtures";
import { definitionsForFabMatchPresentation } from "../games/flesh-and-blood/cardArt";
import { useFabCardArt } from "../games/flesh-and-blood/FabPresentationCatalog";
import { useFabCardPresentation } from "../games/flesh-and-blood/useFabCardPresentation";
import { FabSpectatorNotice } from "../games/flesh-and-blood/FabSpectatorNotice";
import { presentRuntime } from "../games/flesh-and-blood/projection";
import {
  SimulatorOpponentParticipantActions,
  SimulatorParticipantConnectionStatus,
  SimulatorSelfParticipantActions,
} from "../simulator/participant-actions";
import {
  SimulatorSidebarTip,
  SimulatorSidebarTips,
} from "../simulator/participant-actions/SimulatorSidebarTips";

/** Local visual fixture; example identities and ratings are not live player data. */
export default function FabSidebarPreview() {
  if (!import.meta.env.DEV) return null;
  return (
    <FleshAndBloodSimulatorProviders>
      <SidebarPreview />
    </FleshAndBloodSimulatorProviders>
  );
}

function SidebarPreview() {
  const location = useLocation();
  const spectator = new URLSearchParams(location.search).get("mode") === "spectator";
  const [runtime] = useState(createOpeningFixtureRuntime);
  const definitions = useMemo(
    () => definitionsForFabMatchPresentation(runtime.getState()),
    [runtime],
  );
  useFabCardPresentation(definitions, "sidebar-preview");
  const resolver = useFabCardArt();
  const state = {
    ...presentRuntime(runtime, "player-1", resolver),
    priorityAutomation: "play-and-skip" as const,
  };
  return (
    <SimulatorSidebarTips>
      <FleshAndBloodTabletop
        state={state}
        viewerId="player-1"
        readOnly={spectator}
        readOnlyLabel={spectator ? "Spectating · read only" : undefined}
        activityLogLabel={spectator ? "Spectating" : undefined}
        matchActions={
          spectator ? <FabSpectatorNotice displayName="Preview Supporter" /> : undefined
        }
        spectatorReturnHref={
          spectator ? "/flesh-and-blood/matchmaking?from=sidebar-preview" : undefined
        }
        participantPresentation={{
          "player-1": {
            displayName: "Preview Supporter",
            subscriptionTier: "tier3",
            rankedMmr: 1520,
            actions: spectator ? undefined : (
              <SimulatorSidebarTip id="support">
                <SimulatorSelfParticipantActions
                  support={{ source: "sidebar-preview", gameSlug: "flesh-and-blood" }}
                  gameConfiguration={{ onSelect: () => {} }}
                />
              </SimulatorSidebarTip>
            ),
          },
          "player-2": {
            displayName: "Preview Opponent",
            subscriptionTier: "tier2",
            rankedMmr: 1480,
            connection: (
              <SimulatorParticipantConnectionStatus
                displayName="Preview Opponent"
                status="connected"
              />
            ),
            actions: spectator ? undefined : (
              <SimulatorSidebarTip id="opponent">
                <SimulatorOpponentParticipantActions
                  participant={{
                    kind: "human",
                    gameProfileId: "preview-opponent",
                    displayName: "Preview Opponent",
                  }}
                  match={{ matchId: "preview", gameId: "preview", gameSlug: "flesh-and-blood" }}
                />
              </SimulatorSidebarTip>
            ),
          },
        }}
        matchHistory={[
          {
            id: "start",
            kind: "match-start",
            turn: 1,
            timestamp: "2026-09-04T10:00:00Z",
            title: "Sidebar preview · Example identities and ratings",
          },
        ]}
        onUndo={() => {}}
        canUndo
        onConcede={() => {}}
      />
    </SimulatorSidebarTips>
  );
}
