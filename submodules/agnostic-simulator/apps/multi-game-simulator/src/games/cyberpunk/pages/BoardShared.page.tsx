import { Board, InteractionPanel, MobileShell } from "@tcg/simulator-ui";

import { AiControlPanel } from "../components/AiControlPanel";
import { ChatPanel } from "../components/ChatPanel";
import { EndGameModal } from "../components/EndGameModal";
import { MoveLogPanel } from "../components/MoveLogPanel";
import { CyberpunkSharedAnimationLayer } from "../animation";
import {
  EngineProvider,
  useEngine,
  type AISideConfig,
  type AiMode,
  type AiSpeed,
  type CyberpunkTestEngine,
  type PostGameSurface,
  type ScenarioId,
  type Side,
} from "../engine";
import { useSimulatorProjection } from "../engine/useSimulatorProjection";

export interface BoardSharedPageProps {
  scenarioId?: ScenarioId;
  initialEngineBuilder?: () => CyberpunkTestEngine;
  initialAi?: AISideConfig;
  initialHumanSide?: Side;
  initialAiMode?: AiMode;
  initialAiSpeed?: AiSpeed;
  autoResolveSingletonCardTargets?: boolean;
  onMatchEnded?: (result: { winnerId: string | null; reason: string | null }) => void;
  postGameSurface?: PostGameSurface;
}

export function BoardSharedPage(props: BoardSharedPageProps) {
  return (
    <EngineProvider
      initialScenario={props.scenarioId}
      initialEngineBuilder={props.initialEngineBuilder}
      initialAi={props.initialAi}
      initialHumanSide={props.initialHumanSide}
      initialAiMode={props.initialAiMode}
      initialAiSpeed={props.initialAiSpeed}
      autoResolveSingletonCardTargets={props.autoResolveSingletonCardTargets}
      onMatchEnded={props.onMatchEnded}
      postGameSurface={props.postGameSurface}
    >
      <CyberpunkSharedAnimationLayer>
        <BoardSharedContent />
      </CyberpunkSharedAnimationLayer>
    </EngineProvider>
  );
}

function BoardSharedContent() {
  const { fixture, onSubmitInteraction } = useSimulatorProjection();
  const { matchState } = useEngine();
  const gameEnded = matchState.G.gameEnded;

  return (
    <main className="mx-auto min-h-svh w-full max-w-[1600px] p-4 max-[900px]:p-3">
      <MobileShell
        hasLog
        sidebar={<SidebarContent />}
        board={
          <section
            className="min-w-0 overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-layout-bg)] shadow-[var(--shadow)]"
            aria-label={fixture.boardLayout.title}
          >
            <Board
              table={fixture.table}
              entities={fixture.entities}
              layout={fixture.boardLayout}
              label={fixture.name}
            />
          </section>
        }
        interactions={
          <div className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] max-[520px]:p-3">
            <InteractionPanel fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
          </div>
        }
        log={<ChatPanel />}
      />
      {gameEnded && <EndGameModal />}
    </main>
  );
}

function SidebarContent() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <AiControlPanel />
      <MoveLogPanel />
    </div>
  );
}
