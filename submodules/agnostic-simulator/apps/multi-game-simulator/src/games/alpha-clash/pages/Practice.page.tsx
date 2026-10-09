import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Paper, Stack, Text, Title } from "@mantine/core";
import type { ProjectedState } from "@tcg/alpha-clash-engine";
import {
  alphaClashCreateServerEngine,
  alphaClashServerAdapter,
  type AlphaClashServerEngine,
} from "@tcg/alpha-clash-server-adapter";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { useArenaOpening } from "../components/Arena3D/useArenaOpening";
import { InteractionWorkspace } from "@tcg/simulator-ui";
import {
  AlphaClashInteractionPanel,
  AlphaClashInteractionBoard,
  labelAlphaClashInteractions,
} from "../components/AlphaClashInteractions";
import { Link } from "react-router";
import classes from "./Practice.module.css";
import { practiceModeFromSearch } from "../../../simulator/practiceMode";

const HUMAN = "human";
const BOT = "bot";

interface LogLine {
  readonly id: number;
  readonly text: string;
}

/** Local practice match on the tabletop: you versus a practice bot. */
export function AlphaClashPracticePage({ fixtureId }: { fixtureId?: string } = {}) {
  const mode = fixtureId ? "self" : practiceModeFromSearch(window.location.search);
  const [setupPlayer, setSetupPlayer] = useState(HUMAN);
  const [engine, setEngine] = useState<AlphaClashServerEngine | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const logCounter = useRef(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (fixtureId) {
          const { createAlphaClashVisualFixture } = await import("../visual-fixtures");
          const created = createAlphaClashVisualFixture(fixtureId);
          if (!cancelled) setEngine(created);
          return;
        }
        // Deck presets are query-param selectable (?deckA=<preset>@<seed>&deckB=…)
        // so practice matches can rotate decks; defaults keep the original table.
        const params = new URLSearchParams(window.location.search);
        const deckIdA = params.get("deckA") ?? "starter-titan";
        const deckIdB = params.get("deckB") ?? "starter-warden";
        const deckA = alphaClashServerAdapter.practiceDecks?.getDeck(deckIdA);
        const deckB = alphaClashServerAdapter.practiceDecks?.getDeck(deckIdB);
        if (!deckA || !deckB) throw new Error("Practice decks are unavailable.");
        const owners = [HUMAN, BOT];
        const cardsMaps = alphaClashServerAdapter.buildCardInstances(
          [deckA, deckB].map((deck, index) => ({
            owner: owners[index] ?? `owner-${index}`,
            deck: deck.map((entry) => ({
              cardId: entry.cardId,
              qty: entry.quantity,
              ...(entry.sectionId ? { sectionId: entry.sectionId } : {}),
            })),
          })),
        );
        const created = await alphaClashCreateServerEngine({
          gameSlug: "alpha-clash",
          seed: "1",
          player1Id: HUMAN,
          player2Id: BOT,
          cardsMaps,
        });
        if (!cancelled) setEngine(created as AlphaClashServerEngine);
      } catch (loadError) {
        if (!cancelled) {
          setLoadError(loadError instanceof Error ? loadError.message : String(loadError));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fixtureId]);

  const context = useMemo(
    () => ({ gameId: "alpha-clash-local-practice", sourceAuthority: "server" as const }),
    [],
  );

  const logLinesOf = useCallback((result: { engineLogRecords?: readonly unknown[] }): string[] => {
    return practiceLogLines(result.engineLogRecords ?? []);
  }, []);

  const applyResult = useCallback(
    (result: { success: boolean; error?: string; engineLogRecords?: readonly unknown[] }) => {
      if (!engine) return false;
      if (!result.success) {
        setError(result.error ?? "That action is not legal right now.");
        return false;
      }
      setError(null);
      const lines = logLinesOf(result);
      if (lines.length > 0) {
        setLog((current) =>
          [...lines.map((text) => ({ id: (logCounter.current += 1), text })), ...current].slice(
            0,
            60,
          ),
        );
      }
      // Drive the practice bot synchronously until it is the human's turn
      // again (mirrors the adapter's headless automation loop; the engine
      // validates every action at the dispatch boundary).
      let guard = 0;
      if (mode === "self") {
        setVersion(engine.getStateID());
        return true;
      }
      while (!engine.hasGameEnded() && guard < 200) {
        const actor = engine.getActivePlayerId();
        if (actor !== BOT) break;
        const botResult = engine.takeAutomatedAction({ strategyId: "default" }, context);
        if (!botResult.finalResult.success) {
          setError(botResult.finalResult.error ?? "The practice bot could not act.");
          break;
        }
        const botLines = logLinesOf(botResult.finalResult);
        if (botLines.length > 0) {
          setLog((current) =>
            [
              ...botLines.map((text) => ({ id: (logCounter.current += 1), text })),
              ...current,
            ].slice(0, 60),
          );
        }
        guard += 1;
      }
      setVersion(engine.getStateID());
      return true;
    },
    [engine, context, logLinesOf, mode],
  );

  const openingSetup = fixtureId === "opening-preview" && engine?.state.phase.name === "setup";
  const controlledPlayer = openingSetup
    ? setupPlayer
    : mode === "self"
      ? (engine?.getActivePlayerId() ?? HUMAN)
      : HUMAN;

  const submit = useCallback(
    (submission: InteractionSubmission) => {
      if (!engine) return false;
      const result = engine.submitInteraction(controlledPlayer, submission, context);
      return applyResult(result);
    },
    [engine, context, applyResult, controlledPlayer],
  );

  const openingScene = useArenaOpening(fixtureId === "opening-preview", (id, values = {}) => {
    if (!engine) return false;
    const view = engine.getInteractionView(controlledPlayer);
    const action = view.actions.find((candidate) => candidate.id === id && candidate.enabled);
    if (!action) return false;
    return submit({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    });
  });
  const openingBusy = Boolean(openingScene && openingScene.beat.id !== "hand");

  if (loadError) {
    return (
      <main className={classes.page}>
        <Title order={2}>Alpha Clash practice</Title>
        <Text c="red">Unable to load the practice match: {loadError}</Text>
      </main>
    );
  }
  if (!engine) {
    return (
      <main className={classes.page}>
        <Title order={2}>Alpha Clash practice</Title>
        <Text>Setting the table…</Text>
      </main>
    );
  }

  const board = engine.getViewerState({
    role: "player",
    actorId: controlledPlayer,
  }) as ProjectedState;
  const nativeView = engine.getInteractionView(controlledPlayer);
  const ended = engine.hasGameEnded();
  const endResult = engine.getGameEndResult();
  const labelFor = (instanceId: string): string => {
    const card = board.cards.find((entry) => entry.instanceId === instanceId);
    if (!card) return instanceId;
    return card.name ?? (card.faceDown ? "Set card" : instanceId);
  };

  const view = labelAlphaClashInteractions(nativeView, labelFor);

  return (
    <InteractionWorkspace
      key={controlledPlayer}
      view={view}
      viewerId={controlledPlayer}
      onSubmit={submit}
      disabled={ended || openingBusy}
    >
      <main
        className={`${classes.page} ${classes.arenaPage}`}
        data-version={version}
        data-practice-mode={mode}
        data-controlled-player={controlledPlayer}
      >
        <div className={classes.tableArea}>
          {ended ? (
            <Paper
              withBorder
              p="sm"
              radius="md"
              className={`${classes.resultBanner} ${
                endResult?.winnerId === HUMAN ? classes.resultWin : classes.resultLose
              }`}
              data-testid="ac-result"
            >
              <Text fw={700}>
                {mode === "self"
                  ? `${endResult?.winnerId === HUMAN ? "Player 1" : "Player 2"} wins`
                  : endResult?.winnerId === HUMAN
                    ? "You win"
                    : "You lose"}{" "}
                · {endResult?.reason}
              </Text>
            </Paper>
          ) : null}
          <AlphaClashInteractionBoard
            openingScene={openingScene}
            board={{
              cards: board.cards,
              players: board.players,
              activePlayer: board.activePlayer,
              phaseName: board.phase.name,
              turnNumber: board.turnNumber,
              portalOpen: board.portalOpen,
              clash: board.clash,
              standbyCount: board.standby.length,
            }}
            viewerSeat={controlledPlayer === HUMAN ? "player-one" : "player-two"}
            participantNames={{
              p1: mode === "self" ? "Player 1" : "You",
              p2: mode === "self" ? "Player 2" : "Opponent",
            }}
            view={view}
            disabled={ended || openingBusy}
            utilities={
              <>
                {openingSetup && (
                  <>
                    <button
                      type="button"
                      aria-pressed={controlledPlayer === HUMAN}
                      disabled={openingBusy}
                      onClick={() => setSetupPlayer(HUMAN)}
                    >
                      Player 1
                    </button>
                    <button
                      type="button"
                      aria-pressed={controlledPlayer === BOT}
                      disabled={openingBusy}
                      onClick={() => setSetupPlayer(BOT)}
                    >
                      Player 2
                    </button>
                  </>
                )}
                <Link to="/alpha-clash/simulator/tests">Fixtures</Link>
                {fixtureId && (
                  <button type="button" onClick={() => window.location.reload()}>
                    Reset
                  </button>
                )}
              </>
            }
            controls={
              <aside className={classes.arenaControls}>
                {openingSetup && (
                  <Text size="sm">
                    Local engine fixture. Player 1 starts. Use Player 1 / Player 2 to inspect each
                    seat before starting. The engine currently supports one full-hand redraw per
                    player; selective mulligans are not implemented.
                  </Text>
                )}
                <AlphaClashInteractionPanel
                  view={view}
                  viewerId={controlledPlayer}
                  onSubmit={submit}
                  disabled={ended || Boolean(openingScene)}
                />
                <Paper withBorder p="sm" radius="md" className={classes.logPanel}>
                  <Text fw={600} size="sm" mb={4}>
                    Event log
                  </Text>
                  <Stack gap={2} data-testid="ac-event-log">
                    {log.slice(0, 14).map((line) => (
                      <Text key={line.id} size="xs" c="dimmed" data-testid="ac-event-log-line">
                        {line.text}
                      </Text>
                    ))}
                    {log.length === 0 ? (
                      <Text size="xs" c="dimmed">
                        The match has not started yet.
                      </Text>
                    ) : null}
                  </Stack>
                </Paper>
              </aside>
            }
          />
          {error ? (
            <Paper withBorder p="xs" radius="md" className={classes.errorBanner}>
              <Text size="sm" c="red">
                {error}
              </Text>
            </Paper>
          ) : null}
        </div>
      </main>
    </InteractionWorkspace>
  );
}

export default AlphaClashPracticePage;

/**
 * Extracts concise player-facing lines from adapter EngineLogRecords: each
 * record envelopes the canonical log on `.log`, whose `public` messages carry
 * the player-readable `defaultMessage`.
 */
export function practiceLogLines(records: readonly unknown[]): string[] {
  const wrapped = records as ReadonlyArray<
    { log?: { public?: readonly { defaultMessage?: string }[] } } | null | undefined
  >;
  return wrapped
    .flatMap((record) => record?.log?.public ?? [])
    .map((message) => message.defaultMessage ?? "")
    .filter((text) => text.length > 0);
}
