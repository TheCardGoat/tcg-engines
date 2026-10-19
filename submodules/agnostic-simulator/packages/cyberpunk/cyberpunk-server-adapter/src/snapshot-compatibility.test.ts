import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  LocalEngine,
  P1,
  setCardRegistry,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import {
  embracingPowerRetailStarterDeckMinotaur as minotaur,
  createCardCatalog,
  welcomeToNightCityRetailCorpoSecurity as corpo,
  welcomeToNightCityRetailFieldOperator as operator,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon as yorinobu,
} from "@tcg/cyberpunk-cards";
import type { EngineSnapshot } from "@tcg/shared/game-engine";
import { CyberpunkServerEngine } from "./cyberpunk-server-engine";
import { cyberpunkRestoreEngine, cyberpunkSerializeEngine } from "./cyberpunk-engine-lifecycle";

const context = {
  gameSlug: "cyberpunk" as const,
  seed: "release-compatibility",
  player1Id: "p1",
  player2Id: "p2",
};
const dispatchContext = { gameId: "compatibility-game", sourceAuthority: "server" as const };

function previousRelease(): EngineSnapshot {
  return JSON.parse(
    readFileSync(new URL("./fixtures/snapshot-v1-les-elemens.json", import.meta.url), "utf8"),
  );
}

describe("saved-game release compatibility", () => {
  it("classifies the original missing-array exception as a server fault, not an illegal move", () => {
    setCardRegistry(createCardCatalog());
    const state = previousRelease().state as MatchState;
    const original = JSON.stringify(state);
    const engine = new CyberpunkServerEngine(new LocalEngine(state));
    const action = engine
      .getInteractionView("p1")
      .actions.find((candidate) => candidate.id === "playCard")!;
    const program = state.G.players.p1!.zones.hand[0]!;
    expect(() =>
      engine.submitInteraction(
        "p1",
        {
          protocolVersion: 2,
          stateVersion: state.ctx.stateID,
          requestId: action.requestId,
          actionId: action.id,
          values: { cardId: program },
        },
        dispatchContext,
      ),
    ).toThrow(
      expect.objectContaining({ code: "game_engine_failed", cause: expect.any(TypeError) }),
    );
    expect(JSON.stringify(engine.getState())).toBe(original);
  });

  it("restores the pre-event-history release and plays Les Élémens through the public interaction API", async () => {
    const snapshot = previousRelease();
    const original = JSON.stringify(snapshot);
    const engine = await cyberpunkRestoreEngine(snapshot, context);
    const before = engine.getState() as MatchState;
    const program = Object.values(before.G.cardIndex).find(
      (card) => card.definitionId === "c29aefc5-c8dd-4188-95d9-e46c5ee289eb",
    )!;
    const target = before.G.players.p2!.zones.field[0]!;
    const action = engine.getInteractionView!("p1").actions.find(
      (candidate) => candidate.id === "playCard",
    )!;
    const result = engine.submitInteraction!(
      "p1",
      {
        protocolVersion: 2,
        stateVersion: before.ctx.stateID,
        requestId: action.requestId,
        actionId: action.id,
        values: { cardId: program.instanceId },
      },
      dispatchContext,
    );
    expect(result.success).toBe(true);
    const after = engine.getState() as MatchState;
    expect(after.ctx.stateID).toBe(before.ctx.stateID + 1);
    expect(after.G.players.p2!.zones.deck.at(-1)).toBe(target);
    expect(after.G.players.p2!.zones.field).not.toContain(target);
    expect(after.G.players.p1!.zones.trash).toContain(program.instanceId);
    expect(JSON.stringify(snapshot)).toBe(original);
    const saved = cyberpunkSerializeEngine(engine, snapshot.cardsMaps!);
    expect(saved.snapshotSchemaVersion).toBe(2);
    const restoredAgain = await cyberpunkRestoreEngine(JSON.parse(JSON.stringify(saved)), context);
    expect(restoredAgain.getState()).toEqual(after);
  });

  it("rejects a future schema before exposing an actionable engine", async () => {
    await expect(
      cyberpunkRestoreEngine({ ...previousRelease(), snapshotSchemaVersion: 999 }, context),
    ).rejects.toMatchObject({ code: "game_state_incompatible" });
  });

  it("does not silently repair a corrupt current-schema snapshot", async () => {
    await expect(
      cyberpunkRestoreEngine({ ...previousRelease(), snapshotSchemaVersion: 2 }, context),
    ).rejects.toMatchObject({ code: "game_state_incompatible" });
  });

  it("preserves event history in unversioned snapshots that already contain it", async () => {
    const fixture = CyberpunkTestEngine.createWithFixture(
      { hand: [corpo], deck: 4, eddies: 5 },
      { deck: 4 },
    );
    fixture.playCard(corpo, { as: P1 });
    expect(fixture.getState().G.turnMetadata.firstTimeEventsThisTurn.length).toBeGreaterThan(0);
    const snapshot = cyberpunkSerializeEngine(new CyberpunkServerEngine(fixture.getLocalEngine()), {
      cardInstances: {},
      owners: {},
    });
    delete snapshot.snapshotSchemaVersion;
    const restored = await cyberpunkRestoreEngine(snapshot, context);
    expect(restored.getState()).toEqual(fixture.getState());
  });

  it("rejects an invalid saved continuation instead of silently dropping undo history", async () => {
    const snapshot = previousRelease();
    snapshot.metadata = { combatStateVersion: 3, continuation: { version: 999, undoStack: [] } };
    await expect(cyberpunkRestoreEngine(snapshot, context)).rejects.toMatchObject({
      code: "game_state_incompatible",
    });
  });

  it("keeps a fired first-time ability spent after migration and starts full history next turn", async () => {
    const fixture = CyberpunkTestEngine.createWithFixture(
      {
        deck: 10,
        field: [
          yorinobu,
          { card: operator, spent: false, hasLag: false },
          { card: minotaur, spent: false, hasLag: false },
        ],
      },
      { deck: 10, field: [{ card: corpo, spent: true, powerModifier: 8 }] },
    );
    fixture.attackUnit(operator, corpo, { as: P1 });
    fixture.resolveFullFight({ as: P1 });
    const before = fixture.getHandCount(P1);
    expect(before).toBe(1);
    const saved = legacySnapshot(new CyberpunkServerEngine(fixture.getLocalEngine()));
    const restored = await cyberpunkRestoreEngine(saved, context);
    const resumed = CyberpunkTestEngine.fromState(restored.getState() as MatchState);
    resumed.attackUnit(minotaur, corpo, { as: P1 });
    resumed.resolveFullFight({ as: P1 });
    expect(resumed.getHandCount(P1)).toBe(before);
    expect(resumed.getState().G.turnMetadata.legacyFirstTimeLimitsUntilNextTurn).toBe(true);
    resumed.completeTurn({ as: P1 });
    expect(resumed.getState().G.turnMetadata.legacyFirstTimeLimitsUntilNextTurn).toBeUndefined();
    expect(resumed.getState().G.turnMetadata.firstTimeEventsThisTurn).toEqual([]);
  });

  it.each(["undo", "undoToTurnStart"] as const)(
    "migrates retained states used by %s",
    async (method) => {
      const fixture = CyberpunkTestEngine.createWithFixture(
        { hand: [corpo], deck: 4, eddies: 5 },
        { deck: 4 },
      );
      fixture.playCard(corpo, { as: P1 });
      const restored = await cyberpunkRestoreEngine(
        legacySnapshot(new CyberpunkServerEngine(fixture.getLocalEngine())),
        context,
      );
      expect(restored[method]?.("p1", dispatchContext)?.success).toBe(true);
      const resumed = CyberpunkTestEngine.fromState(restored.getState() as MatchState);
      resumed.playCard(corpo, { as: P1 });
      expect(
        resumed.getCardsInZone("field", P1).some((card) => card.definitionId === corpo.id),
      ).toBe(true);
    },
  );
});

function legacySnapshot(engine: CyberpunkServerEngine): EngineSnapshot {
  return JSON.parse(
    JSON.stringify(
      cyberpunkSerializeEngine(engine, { cardInstances: {}, owners: {} }),
      (key, value) =>
        key === "firstTimeEventsThisTurn" || key === "snapshotSchemaVersion" ? undefined : value,
    ),
  );
}
