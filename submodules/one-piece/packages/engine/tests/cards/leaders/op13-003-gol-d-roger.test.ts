import { describe, expect, test } from "vite-plus/test";
import { op13GolDRoger003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-003 Gol.D.Roger", () => {
  test("gives one newly placed DON!! to the Leader and applies the live 9-DON!! power boundary", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op13GolDRoger003, activeDon: 1, donDeckCount: 2 },
      {},
      { firstPlayer: "south", activeSeat: "south" },
    );

    engine.endTurn("south");
    engine.endTurn("north");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, donDeckCount: 0 });
    expect(view.players.south.leader).toMatchObject({ attachedDon: 1, power: 10000 });

    const capped = OnePieceTestEngine.create({
      leaderCardId: op13GolDRoger003,
      activeDon: 10,
    });
    expect(capped.getView("south").players.south.leader.power).toBe(7000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
