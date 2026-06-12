import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../src/testing/matchers.d.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  ServerView,
  PlayerHandle,
  createMockUnit,
  createMockProgram,
  createMockGear,
  createMockLegend,
  createTestMatchState,
  registerMatchers,
} from "../src/testing/index.ts";

beforeAll(() => {
  registerMatchers();
});

describe("Test harness — mock cards", () => {
  it("createMockUnit produces a valid unit definition", () => {
    const unit = createMockUnit({ name: "Test Striker", cost: 3, power: 5 });
    expect(unit.type).toBe("unit");
    expect(unit.cost).toBe(3);
    expect(unit.power).toBe(5);
    expect(unit.set.code).toBe("alpha");
    expect(unit.abilities).toEqual([]);
  });

  it("createMockProgram has null power per type contract", () => {
    const program = createMockProgram({ name: "Test Program", cost: 2 });
    expect(program.type).toBe("program");
    expect(program.cost).toBe(2);
    expect(program.power).toBeNull();
  });

  it("createMockGear and createMockLegend hand back the right card types", () => {
    const gear = createMockGear({ cost: 0, power: 2 });
    expect(gear.type).toBe("gear");
    const legend = createMockLegend({ name: "Test Boss" });
    expect(legend.type).toBe("legend");
    expect(legend.cost).toBeNull();
  });

  it("mock cards survive end-to-end through the engine", () => {
    const unit = createMockUnit({ name: "Mock Unit", cost: 1, power: 4 });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [unit],
      eddies: 5,
    });
    const result = engine.playCard(unit);
    expect(result.success).toBe(true);
    const inField = engine.getCardsInZone("field", P1);
    expect(inField).toHaveLength(1);
    expect(inField[0]!.definitionId).toBe(unit.id);
  });
});

describe("Test harness — multi-view API", () => {
  it("asServer / asPlayerOne / asPlayerTwo return the documented handle types", () => {
    const engine = CyberpunkTestEngine.createWithFixture({});
    expect(engine.asServer()).toBeInstanceOf(ServerView);
    expect(engine.asPlayerOne()).toBeInstanceOf(PlayerHandle);
    expect(engine.asPlayerTwo()).toBeInstanceOf(PlayerHandle);
    expect(engine.asPlayerOne().playerId).toBe(P1);
    expect(engine.asPlayerTwo().playerId).toBe(P2);
  });

  it("all views read the same underlying state", () => {
    const unit = createMockUnit({ cost: 1, power: 2 });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 5 });

    engine.asPlayerOne().playCard(unit);

    expect(engine.asServer().getCardsInZone("field", P1)).toHaveLength(1);
    expect(engine.asPlayerOne().getCardsInZone("field")).toHaveLength(1);
  });

  it("asServer is the explicit hidden-zone escape hatch", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [createMockUnit()] },
      { hand: [createMockUnit(), createMockUnit()] },
    );
    // Server view sees both players' hands directly.
    expect(engine.asServer().getZoneCount("hand", P1)).toBe(1);
    expect(engine.asServer().getZoneCount("hand", P2)).toBe(2);
  });
});

describe("Test harness — createTestMatchState", () => {
  it("returns a MatchState ready for the main phase by default (skipSetup)", () => {
    const state = createTestMatchState({ deck: 7 });
    expect(state.G.gamePhase).toBe("main");
    expect(state.ctx.playerIds).toEqual([P1, P2]);
    expect(state.G.players[P1]!.zones.hand).toHaveLength(0);
    expect(state.G.players[P1]!.zones.deck).toHaveLength(7);
    expect(state.G.players[P1]!.gigArea).toHaveLength(0);
  });

  it("honors skipSetup: false for mulligan-window tests", () => {
    const state = createTestMatchState({}, {}, { skipSetup: false });
    expect(state.G.gamePhase).toBe("setup");
  });
});

describe("Test harness — custom matchers", () => {
  it("toBeSpent / toBeReady reflect card meta", () => {
    const unit = createMockUnit({ cost: 1, power: 2 });
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: unit, spent: false }],
    });
    const inst = engine.getCard(unit, "field", P1);
    expect(inst).toBeReady();
    engine.judgeSpendCard(unit);
    expect(engine.getCard(unit, "field", P1)).toBeSpent();
  });

  it("toHaveZoneCounts asserts multiple zones in one call", () => {
    const unit = createMockUnit();
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [unit, createMockUnit()],
      field: [createMockUnit()],
    });
    expect(engine.getState()).toHaveZoneCounts({
      player: "p1",
      hand: 2,
      field: 1,
    });
  });

  it("toBeActivePlayer matches the active player id", () => {
    const engine = CyberpunkTestEngine.createWithFixture({});
    const active = engine.getActivePlayerId();
    expect(engine.getState()).toBeActivePlayer(active);
  });
});
