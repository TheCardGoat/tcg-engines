import { describe, expect, test } from "vite-plus/test";
import { createPlayerId, type PlayerId } from "../src/types/branded.ts";
import {
  privateField,
  stripPrivateFields,
  type MulliganLog,
  type MoveLog,
} from "../src/logging/index.ts";
import { CyberpunkTestEngine } from "../src/testing/index.ts";
import { alphaSatoriSwordOfSaburo } from "@tcg/cyberpunk-cards";

const P1 = createPlayerId("p1");
const P2 = createPlayerId("p2");

describe("stripPrivateFields", () => {
  test("self viewer unwraps the value", () => {
    const log: MulliganLog = {
      type: "mulligan",
      playerId: P1,
      timestamp: 1,
      turnNumber: 0,
      drawnCount: 6,
      drawn: privateField(["c1", "c2"] as never[], [P1]),
    };
    const filtered = stripPrivateFields(log, P1);
    expect(filtered.drawn).toEqual(["c1", "c2"]);
    expect(filtered.drawnCount).toBe(6);
    expect(filtered.playerId).toBe(P1);
  });

  test("rival viewer drops the private field but keeps public count", () => {
    const log: MulliganLog = {
      type: "mulligan",
      playerId: P1,
      timestamp: 1,
      turnNumber: 0,
      drawnCount: 6,
      drawn: privateField(["c1", "c2"] as never[], [P1]),
    };
    const filtered = stripPrivateFields(log, P2);
    expect(filtered.drawn).toBeUndefined();
    expect(filtered.drawnCount).toBe(6);
  });

  test("spectator (null) drops every private field", () => {
    const log: MulliganLog = {
      type: "mulligan",
      playerId: P1,
      timestamp: 1,
      turnNumber: 0,
      drawnCount: 6,
      drawn: privateField(["c1"] as never[], [P1, P2]),
    };
    const filtered = stripPrivateFields(log, null);
    expect(filtered.drawn).toBeUndefined();
  });

  test("non-private fields are untouched", () => {
    const log: MoveLog = {
      type: "playCard",
      playerId: P1,
      timestamp: 1,
      turnNumber: 0,
      cardId: "c1" as never,
      cardName: "Goro",
      cost: 2,
    };
    const filtered = stripPrivateFields(log, P2);
    expect(filtered).toEqual(log);
  });

  test("recursively strips nested private fields", () => {
    const obj = {
      outer: "ok",
      list: [
        { name: "a", secret: privateField(42, [P1]) },
        { name: "b", secret: privateField(99, [P2]) },
      ],
    };
    const filtered = stripPrivateFields(obj, P1);
    expect(filtered.list[0].secret).toBe(42);
    expect(filtered.list[1].secret).toBeUndefined();
    expect(filtered.outer).toBe("ok");
  });
});

describe("MoveLog union shapes", () => {
  test("each system log carries playerId, timestamp, turnNumber", () => {
    const turnStarted: MoveLog = {
      type: "turnStarted",
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    };
    expect(turnStarted.type).toBe("turnStarted");
  });

  test("gameEnded carries winnerId + reason", () => {
    const ended: MoveLog = {
      type: "gameEnded",
      playerId: P1,
      timestamp: 0,
      turnNumber: 5,
      winnerId: P1 as PlayerId,
      reason: "gig_victory",
    };
    expect(ended.winnerId).toBe(P1);
    expect(ended.reason).toBe("gig_victory");
  });
});

describe("command move log coverage", () => {
  test("gainGig emits a player move log", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 10, fixerDice: ["d4"] },
      { deck: 10, fixerDice: ["d4"] },
      { skipSetup: false, autoGainGig: false },
    );
    engine.keepHand({ as: P1 });
    engine.keepHand({ as: P2 });
    const active = engine.getActivePlayerId();
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("gainGig");

    const dieId = choice?.type === "gainGig" ? choice.payload.allowedDieIds[0] : undefined;
    expect(dieId).toBeDefined();

    const result = engine.gainGig(dieId as string, { as: active });
    expect(result.moveLogs.some((log) => log.type === "gainGig")).toBe(true);
  });

  test("passPhase emits a player move log", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 10, fixerDice: ["d4"] },
      { deck: 10, fixerDice: ["d4"] },
      { skipSetup: false, autoGainGig: false },
    );
    engine.keepHand({ as: P1 });
    engine.keepHand({ as: P2 });
    const active = engine.getActivePlayerId();
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const dieId = choice?.type === "gainGig" ? choice.payload.allowedDieIds[0] : undefined;
    engine.gainGig(dieId as string, { as: active });

    const result = engine.passPhase({ as: active });
    expect(result.moveLogs.some((log) => log.type === "passPhase")).toBe(true);
  });

  test("sellCard emits a typed card log", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [alphaSatoriSwordOfSaburo], deck: 10, fixerDice: ["d4"] },
      { deck: 10, fixerDice: ["d4"] },
      { skipSetup: false, autoGainGig: false },
    );
    engine.keepHand({ as: P1 });
    engine.keepHand({ as: P2 });
    const active = engine.getActivePlayerId();
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const dieId = choice?.type === "gainGig" ? choice.payload.allowedDieIds[0] : undefined;
    engine.gainGig(dieId as string, { as: active });

    const result = engine.sellCard(alphaSatoriSwordOfSaburo, { as: active });
    const log = result.moveLogs.find((entry) => entry.type === "sellCard");
    expect(log).toMatchObject({
      type: "sellCard",
      cardName: alphaSatoriSwordOfSaburo.displayName,
    });
  });
});
