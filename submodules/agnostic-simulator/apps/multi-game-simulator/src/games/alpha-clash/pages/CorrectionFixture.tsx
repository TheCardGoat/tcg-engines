import { useState } from "react";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { nativeFixtureState } from "../native-fixture-state";
import { Button, Stack, Text, Title } from "@mantine/core";
import { createBoardActionFixture } from "../board-action-fixture";
import { GameStateCorrection, type CorrectionSession } from "../components/GameStateCorrection";
import { parseProjectedState } from "./LiveMatch.page";

function createBadgeFixture() {
  const moxie = getCard("ac-ac4-128");
  const g = nativeFixtureState({
    id: "correction-badge",
    playerOne: { hand: [moxie], resource: [moxie, moxie] },
  });
  g.playerOne.play(moxie);
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  if (!Object.values(g.state.cards).some((card) => card.isToken))
    throw new Error("Moxie did not create a Badge");
  return new AlphaClashServerEngine(g.state, { human: "player-one", bot: "player-two" });
}

/** Local consent-enabled correction controls backed by the actual adapter and native state. */
export function AlphaClashCorrectionFixture() {
  const [engine, setEngine] = useState(createBoardActionFixture);
  const [version, setVersion] = useState(() => engine.getStateID());
  const [error, setError] = useState<string>();
  const board = parseProjectedState(engine.getViewerState({ role: "player", actorId: "human" }));
  if (!board) throw new Error("Invalid correction fixture projection");
  const session: CorrectionSession = {
    enabled: true,
    proposal: null,
    request: () => false,
    exit: () => false,
    accept: () => false,
    decline: () => false,
    execute(moveType, payload) {
      const result = engine.dispatch(moveType, "human", payload, {
        gameId: "correction-fixture",
        sourceAuthority: "server",
        correctionModeEnabled: true,
      });
      setError(result.success ? undefined : result.error);
      if (result.success) setVersion(engine.getStateID());
      return result.success;
    },
  };
  return (
    <main style={{ maxWidth: 560, margin: "32px auto", padding: 16 }}>
      <Stack>
        <Title order={1}>Alpha Clash correction fixture</Title>
        <Text>
          Local fixture with correction consent already enabled. Each edit uses the real adapter.
        </Text>
        <Button
          onClick={() => {
            const next = createBadgeFixture();
            setEngine(next);
            setVersion(next.getStateID());
            setError(undefined);
          }}
        >
          Load Badge scenario
        </Button>
        <GameStateCorrection
          board={board}
          viewerSeat="player-one"
          session={session}
          disabled={false}
        />
        {error && (
          <Text role="alert" c="red">
            {error}
          </Text>
        )}
        <Text role="status">Committed version: {version}</Text>
        <ul aria-label="Created tokens">
          {Object.values(engine.state.cards)
            .filter((card) => card.isToken)
            .map((card) => (
              <li key={card.instanceId}>
                {board.cards.find((entry) => entry.instanceId === card.instanceId)?.name} ·{" "}
                {card.ready ? "ready" : "engaged"} · {card.zone}
              </li>
            ))}
        </ul>
        <Title order={2}>Your Oblivion · top first</Title>
        <ol aria-label="Your Oblivion">
          {engine.state.oblivionOrder["player-one"].map((id) => (
            <li key={id}>{board.cards.find((card) => card.instanceId === id)?.name ?? "Card"}</li>
          ))}
        </ol>
        <Button
          variant="outline"
          onClick={() => {
            const reset = createBoardActionFixture();
            setEngine(reset);
            setVersion(reset.getStateID());
            setError(undefined);
          }}
        >
          Reset correction fixture
        </Button>
      </Stack>
    </main>
  );
}
