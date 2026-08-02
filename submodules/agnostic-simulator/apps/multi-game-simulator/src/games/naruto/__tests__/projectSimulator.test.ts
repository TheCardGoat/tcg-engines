/**
 * Projection differential checks: projected entities/zones/pills must match
 * engine state exactly for the fixture states (design doc section 8 gate).
 */

import { describe, expect, test } from "vitest";

import { deciderOf, leaderUid } from "@tcg-engines/naruto-engine";

import { projectSimulator } from "../projection/projectSimulator.ts";
import { getNarutoFixture } from "../stories/fixtures.ts";

describe("projectSimulator", () => {
  test("mid-game: seats, zones, and entities match engine state", () => {
    const fixture = getNarutoFixture("mid-game");
    expect(fixture).not.toBeNull();
    if (!fixture) return;
    const state = fixture.state;
    const projection = projectSimulator(state, "p1");

    expect(projection.turn).toBe(state.turn);
    expect(projection.decider).toBe(deciderOf(state));
    expect(projection.bottom.leader.life).toBe(state.players.p1.life);
    expect(projection.top.leader.life).toBe(state.players.p2.life);
    expect(projection.bottom.deckCount).toBe(state.players.p1.deck.length);
    expect(projection.top.deckCount).toBe(state.players.p2.deck.length);
    expect(projection.bottom.hand.length).toBe(state.players.p1.hand.length);
    expect(projection.top.hand.length).toBe(state.players.p2.hand.length);

    // characters carry engine-computed power and slot indices
    const p1Character = state.players.p1.characters.find((c) => c !== null);
    expect(p1Character).toBeTruthy();
    if (p1Character) {
      const view = projection.bottom.characters.find((c) => c?.uid === p1Character.uid);
      expect(view?.cardId).toBe(p1Character.cardId);
      expect(view?.rested).toBe(p1Character.rested);
      const entity = projection.entities.find((e) => e.id === p1Character.uid);
      expect(entity?.dataAttributes?.["data-board-uid"]).toBe(p1Character.uid);
    }

    // opponent hand is masked
    const opponentHandEntity = projection.entities.find(
      (e) => e.id === state.players.p2.hand[0]?.uid,
    );
    expect(opponentHandEntity?.face).toBe("hidden");
    expect(opponentHandEntity?.title).toBe("Hidden card");

    // own hand is visible
    const ownHandEntity = projection.entities.find((e) => e.id === state.players.p1.hand[0]?.uid);
    expect(ownHandEntity?.face).toBe("public");

    // zones: 8 per seat
    expect(projection.table.zones.filter((z) => z.ownerId === "p1").length).toBe(8);
    expect(projection.table.zones.filter((z) => z.ownerId === "p2").length).toBe(8);
    const deckZone = projection.table.zones.find((z) => z.id === "p2-deck");
    expect(deckZone?.visibility).toBe("secret");
    expect(deckZone?.count).toBe(state.players.p2.deck.length);

    // seam pills: end turn enabled for the active viewer
    const endTurn = projection.seamPills.find((p) => p.id === "end-turn");
    expect(endTurn?.enabled).toBe(true);

    // leader pills exist under the leader uid key
    expect(projection.pills[leaderUid("p1")]?.length).toBeGreaterThan(0);
  });

  test("counter window: attack view + targeting intent + pass gating", () => {
    const fixture = getNarutoFixture("counter-window");
    if (!fixture) throw new Error("fixture missing");
    const state = fixture.state;
    expect(state.pendingAttack).not.toBeNull();

    // viewed from the defender (priority holder)
    const projection = projectSimulator(state, "p2");
    expect(projection.attack).not.toBeNull();
    expect(projection.attack?.targetUid).toBe(leaderUid("p2"));
    expect(projection.targetingIntents.length).toBe(1);
    expect(projection.targetingIntents[0]?.sourceEntityId).toBe(state.pendingAttack?.attackerUid);

    const pass = projection.seamPills.find((p) => p.id === "pass-counter");
    expect(pass?.enabled).toBe(true);

    // attacker view: pass disabled with reason
    const attackerProjection = projectSimulator(state, "p1");
    const attackerPass = attackerProjection.seamPills.find((p) => p.id === "pass-counter");
    expect(attackerPass?.enabled).toBe(false);
    expect(attackerPass?.reason).toBeTruthy();
  });

  test("board-target choice: board uids split from modal options", () => {
    const fixture = getNarutoFixture("board-target-choice");
    if (!fixture) throw new Error("fixture missing");
    const projection = projectSimulator(fixture.state, "p1");
    expect(projection.choice).not.toBeNull();
    expect(projection.choice?.isModal).toBe(false);
    expect(projection.choice?.boardTargetUids.length).toBeGreaterThan(0);
    expect(projection.choice?.modalOptions.length).toBe(0);
    expect(projection.choice?.cancellable).toBe(true);
  });

  test("modal choice: hand options go to the modal list", () => {
    const fixture = getNarutoFixture("modal-choice");
    if (!fixture) throw new Error("fixture missing");
    const projection = projectSimulator(fixture.state, "p1");
    expect(projection.choice?.isModal).toBe(true);
    expect(projection.choice?.modalOptions.length).toBeGreaterThan(0);
    expect(projection.choice?.boardTargetUids.length).toBe(0);
  });

  test("log lines localize and nest effect entries", () => {
    const fixture = getNarutoFixture("counter-window");
    if (!fixture) throw new Error("fixture missing");
    const projection = projectSimulator(fixture.state, "p2");
    expect(projection.logLines.length).toBe(fixture.state.log.length);
    const attackLine = projection.logLines.find((l) => l.text.includes("declares an attack"));
    expect(attackLine).toBeTruthy();
    // no raw log.* keys leak through
    for (const line of projection.logLines) {
      expect(line.text.startsWith("log.")).toBe(false);
    }
  });
});
