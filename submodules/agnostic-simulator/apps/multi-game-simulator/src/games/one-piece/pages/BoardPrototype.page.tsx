import { useMemo } from "react";
import {
  buildDefaultOnePieceBoard,
  buildOnePieceBoardFromFixture,
} from "../data/projectVisualFixture.ts";
import { getOnePieceVisualFixture, type OnePieceVisualFixtureId } from "../data/visualFixtures.ts";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";

export interface BoardPrototypePageProps {
  fixtureId?: OnePieceVisualFixtureId;
}

export function BoardPrototypePage({ fixtureId }: BoardPrototypePageProps) {
  const board = useMemo(() => {
    if (!fixtureId) {
      return buildDefaultOnePieceBoard();
    }
    const fixture = getOnePieceVisualFixture(fixtureId);
    return fixture ? buildOnePieceBoardFromFixture(fixture) : buildDefaultOnePieceBoard();
  }, [fixtureId]);

  return <OnePieceSimulatorShell board={board} />;
}
