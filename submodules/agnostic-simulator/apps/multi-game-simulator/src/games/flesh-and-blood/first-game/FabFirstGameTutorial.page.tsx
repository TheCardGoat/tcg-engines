import { useState } from "react";

import {
  SimulatorOpponentParticipantActions,
  SimulatorSelfParticipantActions,
} from "../../../simulator/participant-actions";
import { FleshAndBloodTabletop } from "../FleshAndBloodTabletop";
import { createOpeningFixtureState } from "../fixtures";
import { FabFirstGameGuide } from "./FabFirstGameGuide";

/**
 * Guided first game on the opening practice board. The guide names and
 * highlights controls that already exist; it does not play the match.
 */
export function FabFirstGameTutorialPage() {
  const [state] = useState(() => ({
    ...createOpeningFixtureState(),
    priorityAutomation: "play-and-skip" as const,
  }));
  const viewerId = "player-1";
  const opponentId = state.players.find((playerId) => playerId !== viewerId) ?? "player-2";

  return (
    <FabFirstGameGuide>
      <FleshAndBloodTabletop
        state={state}
        viewerId={viewerId}
        onUndo={() => {}}
        canUndo={false}
        onConcede={() => {}}
        participantPresentation={{
          [viewerId]: {
            displayName: "You",
            actions: (
              <SimulatorSelfParticipantActions
                gameConfiguration={{
                  label: "Game configuration",
                  title: "Change practice configuration?",
                  description:
                    "This leaves the guide and returns to hero, deck, and bot configuration.",
                  confirmLabel: "Return to setup",
                  onSelect: () => {
                    window.location.assign("/flesh-and-blood/simulator/play/practice");
                  },
                }}
                support={{
                  source: "flesh-and-blood-first-game-guide",
                  gameSlug: "flesh-and-blood",
                  gameId: "first-game-guide",
                }}
              />
            ),
          },
          [opponentId]: {
            displayName: "Practice opponent",
            actions: (
              <SimulatorOpponentParticipantActions
                participant={{
                  kind: "human",
                  gameProfileId: "first-game-opponent",
                  displayName: "Practice opponent",
                }}
                match={{
                  matchId: "first-game-guide",
                  gameId: "first-game-guide",
                  gameSlug: "flesh-and-blood",
                }}
              />
            ),
          },
        }}
      />
    </FabFirstGameGuide>
  );
}
