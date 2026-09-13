/**
 * CR 6.2.2a — player-anchored "until the end of [your/their] next turn"
 * durations compile to a player-anchored turn-end expiry, not the global
 * next-turn compilation.
 *
 * "Until the end of your next turn" (Infiltrate, Tiger-Eye Reflex, Break Tide)
 * and "until the end of their next turn" (Erase Face) anchor to a specific
 * seat's next turn: when generated during the anchor player's own turn, that
 * next turn is two turns away (the opponent takes the immediately following
 * one), so the global `turnNumber + 1` compilation expires a full turn early.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { normalizeBaseObjectProperties } from "../../cards.ts";
import { createSyntheticFabObjectSnapshot } from "../snapshots.ts";
import { fabPlayerId } from "../../game/identity.ts";
import { continuousDurationSupported, resolveContinuousExpiry } from "../proposals/shared.ts";

function seatedState(turnNumber: number, activePlayerId: string) {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "player-anchored-expiry",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
  state.turnNumber = turnNumber;
  state.activePlayerId = fabPlayerId(activePlayerId);
  return state;
}

function controllerObject() {
  return createSyntheticFabObjectSnapshot({
    ref: { instanceId: "anchor-source", incarnation: 1 },
    canonicalId: "canonical-anchor-source",
    objectKind: "catalog-card",
    baseSource: { kind: "registered" },
    ownerId: "p1",
    controllerId: "p1",
    zone: "arena",
    zoneRef: { playerId: fabPlayerId("p1"), zone: "arena" },
    base: normalizeBaseObjectProperties({
      canonicalId: "canonical-anchor-source",
      name: "Anchor Source",
      types: ["Generic", "Action"],
      color: "Blue",
      cost: 0,
      pitch: 3,
    }),
    counters: {},
  });
}

describe("CR 6.2.2a — player-anchored next-turn durations", () => {
  it("accepts the own/their next-turn duration strings", () => {
    expect(continuousDurationSupported("until-end-of-own-next-turn")).toBe(true);
    expect(continuousDurationSupported("until-end-of-their-next-turn")).toBe(true);
  });

  it("'until the end of your next turn' generated during YOUR turn survives the opponent's turn", () => {
    // Turn 3 is p1's (the controller's) turn. Their NEXT turn is 5 — the
    // opponent takes turn 4 — so the expiry must anchor to 5, not the global
    // turn 4 (which would expire while the opponent is still taking their go).
    const state = seatedState(3, "p1");
    const expiry = resolveContinuousExpiry(state, controllerObject(), "until-end-of-own-next-turn");
    expect(expiry).toEqual({ kind: "player-turn-end", playerId: "p1", turnNumber: 5 });
  });

  it("'until the end of your next turn' generated during the OPPONENT's turn anchors to the next turn", () => {
    // Generated during p2's turn 3, the controller's next turn is 4.
    const state = seatedState(3, "p2");
    const expiry = resolveContinuousExpiry(state, controllerObject(), "until-end-of-own-next-turn");
    expect(expiry).toEqual({ kind: "player-turn-end", playerId: "p1", turnNumber: 4 });
  });

  it("'until the end of their next turn' anchors to the opponent's next turn", () => {
    // Generated during the controller's turn 3, "their" is p2 and p2's next
    // turn is 4.
    const state = seatedState(3, "p1");
    const expiry = resolveContinuousExpiry(
      state,
      controllerObject(),
      "until-end-of-their-next-turn",
    );
    expect(expiry).toEqual({ kind: "player-turn-end", playerId: "p2", turnNumber: 4 });
  });

  it("accepts during-their-next-action-phase", () => {
    expect(continuousDurationSupported("during-their-next-action-phase")).toBe(true);
  });

  it("accepts during-own-next-action-phase", () => {
    expect(continuousDurationSupported("during-own-next-action-phase")).toBe(true);
  });

  it("accepts during-own-next-end-phase", () => {
    expect(continuousDurationSupported("during-own-next-end-phase")).toBe(true);
  });

  it("'during your next end phase' generated on your turn windows this turn", () => {
    const state = seatedState(3, "p1");
    const expiry = resolveContinuousExpiry(state, controllerObject(), "during-own-next-end-phase");
    expect(expiry).toEqual({
      kind: "player-end-phase-window",
      playerId: "p1",
      windowTurnNumber: 3,
    });
  });

  it("'during your next end phase' generated on their turn windows your next turn", () => {
    const state = seatedState(3, "p2");
    const expiry = resolveContinuousExpiry(state, controllerObject(), "during-own-next-end-phase");
    expect(expiry).toEqual({
      kind: "player-end-phase-window",
      playerId: "p1",
      windowTurnNumber: 4,
    });
  });

  it("'during their next action phase' generated on your turn windows their next turn", () => {
    const state = seatedState(3, "p1");
    const expiry = resolveContinuousExpiry(
      state,
      controllerObject(),
      "during-their-next-action-phase",
    );
    expect(expiry).toEqual({
      kind: "player-action-phase-window",
      playerId: "p2",
      windowTurnNumber: 4,
    });
  });

  it("'during your next action phase' generated on their turn windows your next turn", () => {
    const state = seatedState(3, "p2");
    const expiry = resolveContinuousExpiry(
      state,
      controllerObject(),
      "during-own-next-action-phase",
    );
    expect(expiry).toEqual({
      kind: "player-action-phase-window",
      playerId: "p1",
      windowTurnNumber: 4,
    });
  });

  it("'during your next action phase' generated on your turn skips the current action phase", () => {
    const state = seatedState(3, "p1");
    const expiry = resolveContinuousExpiry(
      state,
      controllerObject(),
      "during-own-next-action-phase",
    );
    expect(expiry).toEqual({
      kind: "player-action-phase-window",
      playerId: "p1",
      windowTurnNumber: 5,
    });
  });

  it("accepts until-end-of-action-phase", () => {
    expect(continuousDurationSupported("until-end-of-action-phase")).toBe(true);
  });

  it("'until the end of this action phase' windows the current turn-player's action phase", () => {
    const state = seatedState(3, "p1");
    const expiry = resolveContinuousExpiry(state, controllerObject(), "until-end-of-action-phase");
    expect(expiry).toEqual({
      kind: "player-action-phase-window",
      playerId: "p1",
      windowTurnNumber: 3,
    });
  });
});
