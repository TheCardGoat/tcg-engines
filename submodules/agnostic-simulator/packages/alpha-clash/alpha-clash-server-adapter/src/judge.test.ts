import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { insightTrap, skirmisher } from "@tcg/alpha-clash-cards";
import { createFixtureState } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import { alphaClashSerializeEngine, alphaClashRestoreEngine } from "./alpha-clash-engine-lifecycle";
import { alphaClashBotCommandCandidates } from "./bot";

const actor = "alice";
const opponent = "bob";
const context = { gameId: "correction-test", sourceAuthority: "server" as const };
const enabled = { ...context, correctionModeEnabled: true };
function engine() {
  const state = createFixtureState({
    playerOne: { clash: [skirmisher], hand: [insightTrap], resource: 1 },
  });
  state.stateID = 0;
  return new AlphaClashServerEngine(state, {
    [actor]: "player-one",
    [opponent]: "player-two",
  });
}

describe("Alpha Clash correction permission", () => {
  it("requires server consent and binds the actor to the authenticated seat", () => {
    const game = engine();
    const payload = { targetPlayerId: "player-two", playerId: "player-one", amount: 21 };
    expect(game.dispatch("manualSetHealth", opponent, payload, context).success).toBe(false);
    expect(game.getStateID()).toBe(0);
    expect(game.dispatch("manualSetHealth", "stranger", payload, enabled).success).toBe(false);
    const result = game.dispatch("manualSetHealth", opponent, payload, enabled);
    expect(result.success).toBe(true);
    expect(game.state.players["player-two"].health).toBe(21);
    expect(game.state.moveLog.at(-1)?.playerId).toBe("player-two");
    expect(result.stateID).toBe(1);
    if (result.success) {
      expect(result.commandVisibility).toBe("actor");
      expect(result.engineLogRecords?.[0]?.log).toMatchObject({ playerId: opponent });
    }
  });

  it("pauses raw and interaction play, then resumes the same legal native action", () => {
    const game = engine();
    const view = game.getInteractionView(actor);
    const action = view.actions.find((a) => a.id === "endTurn");
    if (!action) throw new Error("Expected the native phase pass");
    const submission = buildInteractionSubmission({ view, action, values: {} });
    const before = structuredClone(game.state);
    expect(game.dispatch("pass", actor, {}, enabled).success).toBe(false);
    expect(game.submitInteraction(actor, submission, enabled).success).toBe(false);
    expect(game.dispatch("undo", actor, {}, enabled).success).toBe(false);
    expect(game.state).toEqual(before);
    expect(game.submitInteraction(actor, submission, context).success).toBe(true);
    expect(game.getStateID()).toBe(1);
  });

  it("keeps correction commands out of native action and bot menus", () => {
    const game = engine();
    for (const id of [actor, opponent])
      expect(game.getInteractionView(id).actions.every((a) => !a.id.startsWith("manual"))).toBe(
        true,
      );
    expect(
      alphaClashBotCommandCandidates(game.state, "player-one").every(
        (c) => !c.type.startsWith("manual"),
      ),
    ).toBe(true);
  });

  it("rejects invalid inputs atomically and keeps hidden identities out of public logs", () => {
    const game = engine();
    const hidden = Object.values(game.state.cards).find(
      (c) => c.zone === "hand" && c.owner === "player-one",
    );
    if (!hidden) throw new Error("Missing hand card");
    const before = structuredClone(game.state);
    expect(
      game.dispatch(
        "manualSetHealth",
        actor,
        { targetPlayerId: "player-one", amount: 3.5 },
        enabled,
      ).success,
    ).toBe(false);
    expect(game.state).toEqual(before);
    const result = game.dispatch(
      "manualMoveCard",
      actor,
      { cardId: hidden.instanceId, targetZone: "resource" },
      enabled,
    );
    expect(result.success).toBe(true);
    if (result.success) {
      const publicLogs = JSON.stringify(result.engineLogRecords);
      expect(publicLogs).toContain("a hidden card");
      expect(publicLogs).not.toContain(insightTrap.name);
      expect(publicLogs).not.toContain(hidden.instanceId);
    }
  });

  it("preserves an edit and its pre-edit checkpoint through serialization", async () => {
    const game = engine();
    expect(
      game.dispatch("manualSetHealth", actor, { targetPlayerId: "player-one", amount: 28 }, enabled)
        .success,
    ).toBe(true);
    expect(game.getUndoState().checkpoints.at(-1)?.state.players["player-one"].health).toBe(30);
    const snapshot = alphaClashSerializeEngine(game, { cardInstances: {}, owners: {} });
    const restored = await alphaClashRestoreEngine(snapshot, {
      player1Id: actor,
      player2Id: opponent,
      gameSlug: "alpha-clash",
    });
    expect(restored.getStateID()).toBe(1);
    expect(restored.getViewerState?.({ role: "player", actorId: actor })).toEqual(
      game.getViewerState({ role: "player", actorId: actor }),
    );
    expect(
      restored.dispatch(
        "manualSetHealth",
        actor,
        { targetPlayerId: "player-one", amount: 26 },
        context,
      ).success,
    ).toBe(false);
  });
});
