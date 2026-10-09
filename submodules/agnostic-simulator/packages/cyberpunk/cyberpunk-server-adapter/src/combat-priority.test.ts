import { describe, expect, it } from "vite-plus/test";
import { LocalEngine, createPlayerId } from "@tcg/cyberpunk-engine";
import { CyberpunkTestEngine, P1, P2 } from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetailOffdutyMalfini as attacker,
  welcomeToNightCityRetailCorpoSecurity as defender,
  welcomeToNightCityRetailMaelstromZealots as zealots,
  welcomeToNightCityRetailFieldOperator as operator,
  welcomeToNightCityRetailMantisBlades as blades,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt as river,
  welcomeToNightCityRetailSafetyOverride as safetyOverride,
} from "@tcg/cyberpunk-cards";
import { buildInteractionSubmissionForActionId } from "@tcg/protocol";
import { CyberpunkServerEngine } from "./cyberpunk-server-engine";
import { cyberpunkSerializeEngine, cyberpunkRestoreEngine } from "./cyberpunk-engine-lifecycle";

const context = { gameId: "combat-priority", sourceAuthority: "server" as const };
function game() {
  const fixture = CyberpunkTestEngine.createWithFixture(
    { field: [{ card: attacker, spent: false, hasLag: false }] },
    { legendArea: [], hand: [], eddies: 0, field: [{ card: defender, spent: true }] },
  );
  return new CyberpunkServerEngine(new LocalEngine(fixture.getState()));
}
function setHold(server: CyberpunkServerEngine, hold: boolean) {
  const view = server.getInteractionView(P2);
  const submission = buildInteractionSubmissionForActionId({
    view,
    actionId: "setCombatPriority",
    values: { hold },
  });
  if (!submission) throw new Error("Missing hold interaction");
  return server.submitInteraction(P2, submission, context);
}
function attack(server: CyberpunkServerEngine) {
  const state = server.getRawState();
  return server.dispatch(
    "attackUnit",
    P1,
    {
      attackerId: state.G.players[P1]!.zones.field[0],
      defenderId: state.G.players[P2]!.zones.field[0],
    },
    context,
  );
}

describe("hosted combat priority", () => {
  it("restores authored and delayed fight triggers and resolves their public order choice once", async () => {
    const fixture = CyberpunkTestEngine.createWithFixture(
      {
        hand: [safetyOverride],
        field: [{ card: zealots, spent: false, hasLag: false }],
        eddies: 2,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {
        field: [{ card: defender, spent: true }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
    );
    const zealotsId = fixture.findCardId(zealots, "field", P1);
    const defenderId = fixture.findCardId(defender, "field", P2);
    fixture.playCard(safetyOverride, { as: P1 });
    const server = new CyberpunkServerEngine(new LocalEngine(fixture.getState()));

    const attackResult = server.dispatch(
      "attackUnit",
      P1,
      { attackerId: zealotsId, defenderId },
      context,
    );
    expect(attackResult.success).toBe(true);
    expect(server.dispatch("resolveAttack", P2, { pass: true }, context).success).toBe(true);
    const pendingView = server.getInteractionView(P1);
    const pendingAction = pendingView.actions.find((action) => action.id === "resolveTrigger");
    const pendingInput = pendingAction?.inputs.find((input) => input.id === "triggerId");
    if (pendingInput?.kind !== "option-selection") {
      throw new Error("Expected public authored and delayed fight trigger choices");
    }
    expect(pendingInput.options).toHaveLength(2);
    expect(pendingInput.options.map((option) => option.text.params?.cardName)).toEqual(
      expect.arrayContaining(["Maelstrom Zealots", "Safety Override"]),
    );
    expect(server.getInteractionView(P2).status).toBe("waiting");

    const snapshot = cyberpunkSerializeEngine(server, { cardInstances: {}, owners: {} });
    const restored = await cyberpunkRestoreEngine(snapshot, {
      gameSlug: "cyberpunk",
      seed: "fight-trigger-order",
      player1Id: P1,
      player2Id: P2,
    });
    if (!(restored instanceof CyberpunkServerEngine)) throw new Error("Wrong engine");
    const restoredView = restored.getInteractionView(P1);
    const restoredAction = restoredView.actions.find((action) => action.id === "resolveTrigger");
    const restoredInput = restoredAction?.inputs.find((input) => input.id === "triggerId");
    if (restoredInput?.kind !== "option-selection") {
      throw new Error("Expected restored public fight trigger choices");
    }
    expect(restoredInput.options.map((option) => option.id)).toEqual(
      pendingInput.options.map((option) => option.id),
    );

    const submission = buildInteractionSubmissionForActionId({
      view: restoredView,
      actionId: "resolveTrigger",
      values: { triggerId: restoredInput.options[0]!.id },
    });
    if (!submission) throw new Error("Missing public trigger order submission");
    expect(restored.submitInteraction(P1, submission, context).success).toBe(true);
    expect(
      restored.getInteractionView(P1).actions.some((action) => action.id === "resolveTrigger"),
    ).toBe(false);
    expect(restored.getRawState().G.players[P1]!.zones.trash).toContain(zealotsId);
    expect(restored.getRawState().G.players[P2]!.zones.trash).toContain(defenderId);
    expect(restored.getRawState().G.players[P1]!.gigArea).toHaveLength(1);
    expect(restored.getRawState().G.players[P2]!.gigArea).toHaveLength(1);
    expect(restored.getRawState().G.attackState).toBeNull();
    expect(restored.getInteractionView(P1).status).not.toBe("choice");
  });

  it("restores a suspended fight-result effect before applying combat defeats", async () => {
    const fixture = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: zealots, hasLag: false, spent: false }], legendArea: [] },
      {
        field: [{ card: operator, spent: true, attachedGears: [blades] }],
        legendArea: [{ card: river, faceDown: false, spent: true }],
        deck: [defender, defender],
      },
      { preserveDeckOrder: true },
    );
    const attackerId = fixture.findCardId(zealots, "field", P1);
    fixture.attackUnit(zealots, operator, { as: P1 });
    fixture.resolveFullFight({ as: P1 });
    const server = new CyberpunkServerEngine(new LocalEngine(fixture.getState()));
    expect(server.getRawState().G.attackState?.step).toBe("fightResult");
    expect(server.getRawState().G.players[P1]!.zones.field).toContain(attackerId);
    const snapshot = cyberpunkSerializeEngine(server, { cardInstances: {}, owners: {} });
    const restored = await cyberpunkRestoreEngine(snapshot, {
      gameSlug: "cyberpunk",
      seed: "fight-result",
      player1Id: P1,
      player2Id: P2,
    });
    if (!(restored instanceof CyberpunkServerEngine)) throw new Error("Wrong engine");
    const choice = restored.getRawState().G.turnMetadata.pendingChoice;
    if (choice?.type !== "scry") throw new Error("Expected River's search before combat defeats");
    const result = restored.dispatch(
      "resolveScry",
      P2,
      {
        destinations: [{ zone: "trash", cardIds: [choice.payload.revealedCardIds[0]!] }],
      },
      context,
    );
    expect(result.success).toBe(true);
    expect(restored.getRawState().G.attackState).toBeNull();
    expect(restored.getRawState().G.players[P1]!.zones.trash).toContain(attackerId);
  });

  it("arms while waiting without a public setting log or opponent state", () => {
    const server = game();
    expect(server.getInteractionView(P2).status).toBe("waiting");
    const result = setHold(server, true);
    expect(result).toMatchObject({
      success: true,
      commandVisibility: "actor",
      acceptedMoveRecord: { visibility: "actor" },
      engineLogRecords: [],
      animations: [],
    });
    expect(server.engine.getFilteredView(P2).players[P2]!.combatPriority).toBe("hold");
    expect(server.engine.getFilteredView(P1).players[P2]).not.toHaveProperty("combatPriority");
    expect(
      server.engine.getFilteredView(createPlayerId("spectator")).players[P2],
    ).not.toHaveProperty("combatPriority");
    expect(server.getInteractionView(P2).status).toBe("waiting");
  });

  it("preserves hold across snapshot restore, then completes combat on pass", async () => {
    const server = game();
    setHold(server, true);
    const snapshot = cyberpunkSerializeEngine(server, { cardInstances: {}, owners: {} });
    const restored = await cyberpunkRestoreEngine(snapshot, {
      gameSlug: "cyberpunk",
      seed: "combat-priority",
      player1Id: P1,
      player2Id: P2,
    });
    expect(restored.getViewerState?.({ role: "player", actorId: P2 })).toMatchObject({
      players: { p2: { combatPriority: "hold" } },
    });
    if (!(restored instanceof CyberpunkServerEngine)) throw new Error("Wrong engine");
    attack(restored);
    expect(restored.getRawState().G.attackState?.step).toBe("react");
    expect(restored.getActivePlayerId()).toBe(P2);
    const result = restored.dispatch("resolveAttack", P2, { pass: true }, context);
    expect(result.success).toBe(true);
    expect(restored.getRawState().G.attackState).toBeNull();
    expect(restored.getRawState().G.players[P2]!.combatPriority).toBe("hold");
  });

  it("rejects incompatible snapshots and malformed current preferences", async () => {
    const server = game();
    setHold(server, true);
    const snapshot = cyberpunkSerializeEngine(server, { cardInstances: {}, owners: {} });
    const restoreContext = {
      gameSlug: "cyberpunk",
      seed: "combat-priority",
      player1Id: P1,
      player2Id: P2,
    };
    const legacyState = structuredClone(server.getRawState());
    Reflect.deleteProperty(legacyState.G.players[P2]!, "combatPriority");
    await expect(
      cyberpunkRestoreEngine(
        { ...snapshot, state: legacyState, metadata: undefined },
        restoreContext,
      ),
    ).rejects.toThrow("Unsupported Cyberpunk combat snapshot version");
    await expect(
      cyberpunkRestoreEngine({ ...snapshot, metadata: { combatStateVersion: 2 } }, restoreContext),
    ).rejects.toThrow("Unsupported Cyberpunk combat snapshot version");
    await expect(
      cyberpunkRestoreEngine({ ...snapshot, state: legacyState }, restoreContext),
    ).rejects.toThrow("Invalid combat priority");
  });

  it("automatically finishes the same attack with hold disabled", () => {
    const server = game();
    const result = attack(server);
    expect(result.success).toBe(true);
    expect(server.getRawState().G.attackState).toBeNull();
  });

  it("rejects unknown actors and cross-player preference payloads", () => {
    const server = game();
    expect(
      server.dispatch("setCombatPriority", "spectator", { mode: "hold" }, context).success,
    ).toBe(false);
    expect(
      server.dispatch("setCombatPriority", P1, { mode: "hold", playerId: P2 }, context).success,
    ).toBe(false);
    expect(server.dispatch("setCombatPriority", P1, { mode: "invalid" }, context).success).toBe(
      false,
    );
    expect(server.getRawState().G.players[P2]!.combatPriority).toBe("automatic");
  });

  it("retains gameplay undo history and current preferences when undoing", () => {
    const server = game();
    attack(server);
    expect(server.engine.canUndo()).toBe(true);
    setHold(server, true);
    expect(server.engine.canUndo()).toBe(true);
    server.engine.undo();
    expect(server.getRawState().G.players[P2]!.combatPriority).toBe("hold");
    expect(server.getRawState().G.players[P2]!.zones.field).toHaveLength(1);
    expect(server.getRawState().G.attackState).toBeNull();
  });
});
