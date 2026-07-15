import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2, type GigFixtureEntry } from "./index.ts";

const gigs = (...dieTypes: GigFixtureEntry["dieType"][]): GigFixtureEntry[] =>
  dieTypes.map((dieType) => ({ dieType, faceValue: 1 }));

function withWarnSpy(fn: (messages: string[]) => void): void {
  const messages: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    messages.push(args.map(String).join(" "));
  };
  try {
    fn(messages);
  } finally {
    console.warn = originalWarn;
  }
}

describe("createWithFixture turn sync", () => {
  it("starts default play fixtures without running setup or start-phase preparation", () => {
    const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "fixture-default" });
    const state = engine.getState();

    expect(state.G.gamePhase).toBe("main");
    expect(state.G.turnMetadata.turnNumber).toBe(1);
    expect(state.G.turnMetadata.activePlayerId).toBe(P1);
    expect(state.G.turnMetadata.pendingChoice).toBeUndefined();
    expect(state.G.players[P1]!.firstPlayer).toBe(true);
    expect(state.G.players[P2]!.firstPlayer).toBe(false);
    expect(state.G.players[P1]!.zones.hand).toHaveLength(0);
    expect(state.G.players[P2]!.zones.hand).toHaveLength(0);
    expect(state.G.players[P1]!.zones.deck.length).toBeGreaterThan(6);
    expect(state.G.players[P2]!.zones.deck.length).toBeGreaterThan(6);
    expect(state.G.players[P1]!.gigArea).toHaveLength(0);
    expect(state.G.players[P1]!.fixerArea).toHaveLength(6);
    expect(state.G.players[P2]!.gigArea).toHaveLength(0);
    expect(state.G.players[P2]!.fixerArea).toHaveLength(6);
  });

  it("uses explicit fixture gig areas without changing the requested active player", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { gigArea: gigs("d4") },
      {},
      { activePlayerId: P2 },
    );
    const state = engine.getState();

    expect(state.G.turnMetadata.turnNumber).toBe(1);
    expect(state.G.turnMetadata.activePlayerId).toBe(P2);
    expect(state.G.players[P1]!.gigArea).toHaveLength(1);
    expect(state.G.players[P2]!.gigArea).toHaveLength(0);
    expect(state.G.players[P1]!.firstPlayer).toBe(false);
    expect(state.G.players[P2]!.firstPlayer).toBe(true);
  });

  it("leaves equal claimed gig counts in player one's main phase by default", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { gigArea: gigs("d4") },
      { gigArea: gigs("d4") },
      { seed: "fixture-equal-gigs" },
    );
    const state = engine.getState();

    expect(state.G.turnMetadata.turnNumber).toBe(1);
    expect(state.G.turnMetadata.activePlayerId).toBe(P1);
    expect(state.G.players[P1]!.firstPlayer).toBe(true);
    expect(state.G.players[P2]!.firstPlayer).toBe(false);
  });

  it("can configure equal claimed gig counts to start on player two", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { gigArea: gigs("d4") },
      { gigArea: gigs("d4") },
      { activePlayerId: P2, seed: "fixture-equal-gigs" },
    );
    const state = engine.getState();

    expect(state.G.turnMetadata.turnNumber).toBe(1);
    expect(state.G.turnMetadata.activePlayerId).toBe(P2);
    expect(state.G.players[P1]!.firstPlayer).toBe(false);
    expect(state.G.players[P2]!.firstPlayer).toBe(true);
  });

  it("complements fixer dice when only gig area is authored", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ gigArea: gigs("d4", "d6") }, {});

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toEqual(["d4", "d6"]);
    expect(engine.getFixerDice(P1).map((die) => die.dieType)).toEqual(["d20", "d12", "d10", "d8"]);
  });

  it("does not infer later turn counts from claimed gig totals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { gigArea: gigs("d4", "d6", "d8", "d10") },
      { gigArea: gigs("d4", "d6", "d8") },
    );
    const state = engine.getState();

    expect(state.G.turnMetadata.turnNumber).toBe(1);
    expect(state.G.turnMetadata.activePlayerId).toBe(P1);
    expect(state.G.players[P1]!.firstPlayer).toBe(true);
  });

  it("can fixture a stolen rival die in a player's gig area", () => {
    withWarnSpy((messages) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
        {
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d4", faceValue: 2, source: "rival" },
            { dieType: "d12", faceValue: 8 },
          ],
        },
      );
      const state = engine.getState();
      const p1 = state.G.players[P1]!;
      const p2 = state.G.players[P2]!;
      const p2Gigs = p2.gigArea.map((dieId) => state.G.gigDice[dieId as string]!);
      const p1FixerTypes = p1.fixerArea.map((dieId) => state.G.gigDice[dieId as string]!.dieType);

      expect(messages.some((message) => message.includes("out of turn order"))).toBe(false);
      expect(p2Gigs.filter((die) => die.dieType === "d4")).toHaveLength(2);
      expect(p2Gigs.every((die) => die.ownerId === P2)).toBe(true);
      expect(p1FixerTypes).not.toContain("d4");
      expect(state.G.turnMetadata.activePlayerId).toBe(P1);
    });
  });

  it("honors explicit fixer dice fixtures", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { fixerDice: [] },
      { fixerDice: ["d4", "d6"] },
    );

    expect(engine.getFixerDice(P1)).toHaveLength(0);
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toEqual([
      "d20",
      "d12",
      "d10",
      "d8",
      "d6",
      "d4",
    ]);
    expect(engine.getFixerDice(P2).map((die) => die.dieType)).toEqual(["d4", "d6"]);
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toEqual(["d20", "d12", "d10", "d8"]);
  });

  it("uses authored gig and fixer dice as-is when both are present", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { gigArea: gigs("d4", "d6"), fixerDice: ["d20"] },
      {},
    );

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toEqual(["d4", "d6"]);
    expect(engine.getFixerDice(P1).map((die) => die.dieType)).toEqual(["d20"]);
  });

  it("can place a fixture directly into overtime", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { gigArea: gigs("d4", "d6", "d8") },
      { gigArea: gigs("d4", "d6", "d8") },
      { overtime: true },
    );
    const state = engine.getState();

    expect(state.G.overtime).toBe(true);
    expect(state.G.turnMetadata.overtimeActive).toBe(true);
    expect(state.G.turnMetadata.previousTurnNoGigTaken).toBe(true);
    expect(state.G.turnMetadata.gigTakenThisTurn).toBe(false);
    expect(state.G.turnMetadata.pendingChoice).toBeUndefined();
    expect(state.G.players[P1]!.fixerArea).toHaveLength(0);
    expect(state.G.players[P2]!.fixerArea).toHaveLength(0);
  });

  it("warns when a fixture claims d20 before it is the last fixer die", () => {
    withWarnSpy((messages) => {
      CyberpunkTestEngine.createWithFixture({ gigArea: gigs("d20") }, {});

      expect(messages.some((message) => message.includes("claims d20 before"))).toBe(true);
    });
  });

  it("leaves setup fixtures before the gain-gig step", () => {
    const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
    const state = engine.getState();

    expect(state.G.gamePhase).toBe("setup");
    expect(state.G.turnMetadata.turnNumber).toBe(1);
    expect(state.G.players[P1]!.gigArea).toHaveLength(0);
    expect(state.G.players[P2]!.gigArea).toHaveLength(0);
  });

  it("can place skipped-setup fixtures directly into an attack step", () => {
    const engine = CyberpunkTestEngine.createWithFixture({}, {}, { gamePhase: "main" });

    expect(engine.getState().G.gamePhase).toBe("main");
  });
});
