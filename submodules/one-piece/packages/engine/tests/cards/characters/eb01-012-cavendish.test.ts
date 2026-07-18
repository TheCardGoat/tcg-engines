import { describe, expect, test } from "vite-plus/test";
import { eb01Cavendish012, op01TrafalgarLaw002 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-012 Cavendish", () => {
  test("ignores itself for On Play, but another Cavendish blocks the DON!! refresh", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01TrafalgarLaw002,
      hand: [eb01Cavendish012],
      activeDon: 5,
    });

    engine.playCard(eb01Cavendish012);

    const refresh = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(refresh?.kind).toBe("chooseOption");
    if (refresh?.kind !== "chooseOption") {
      throw new Error("Expected Cavendish's rested-DON!! count choice.");
    }
    expect(refresh.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");
    expect(engine.getView("south").players.south.activeDon).toBe(2);

    const blockedEngine = OnePieceTestEngine.create({
      leaderCardId: op01TrafalgarLaw002,
      hand: [eb01Cavendish012],
      character: [eb01Cavendish012],
      activeDon: 5,
    });
    blockedEngine.playCard(eb01Cavendish012);
    const blockedView = blockedEngine.getView("south");
    expect(blockedView.players.south.activeDon).toBe(0);
    expect(blockedView.players.south.restedDon).toBe(5);
    expect(blockedView.prompts).toHaveLength(0);
  });

  test("sets rested DON!! active through the public When Attacking timing", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01TrafalgarLaw002,
        character: [{ card: eb01Cavendish012, playedOnTurn: 0 }],
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cavendishId = engine.findCardInZone("south", "character", eb01Cavendish012);

    engine.declareAttack(cavendishId, engine.leader("north"), "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.restedDon).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
