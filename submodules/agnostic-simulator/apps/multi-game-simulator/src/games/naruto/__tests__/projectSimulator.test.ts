/**
 * Projection differential checks: projected entities/zones/pills must match
 * engine state exactly for the fixture states (design doc section 8 gate).
 */

import { describe, expect, test } from "vitest";

import { deciderOf, leaderUid } from "@tcg-engines/naruto-engine";
import type { GameState } from "@tcg-engines/naruto-engine";

import { logEntryText } from "../projection/labels.ts";
import { projectSimulator } from "../projection/projectSimulator.ts";
import { getNarutoFixture } from "../stories/fixtures.ts";

describe("projectSimulator", () => {
  test("uses platform participant names for seats and player-facing logs", () => {
    const fixture = getNarutoFixture("mid-game");
    if (!fixture) throw new Error("mid-game fixture missing");
    const state = {
      ...fixture.state,
      activePlayer: "p2",
      log: [
        { turn: 4, actor: "p1", key: "log.draw" },
        { turn: 4, actor: "p2", key: "log.passPriority" },
        {
          turn: 4,
          actor: "p2",
          key: "log.hitLeader",
          values: {
            attacker: "Kakashi Hatake",
            target: fixture.state.players.p1.name,
            amount: 1,
            life: 14,
          },
        },
      ],
    } satisfies GameState;

    const projection = projectSimulator(state, "p1", {
      p1: "Local Naruto P1",
      p2: "Naruto E2E Player Two",
    });

    expect(projection.bottom.name).toBe("Local Naruto P1");
    expect(projection.top.name).toBe("Naruto E2E Player Two");
    expect(projection.table.seats.map((seat) => seat.label)).toEqual([
      "Local Naruto P1",
      "Naruto E2E Player Two",
    ]);
    expect(projection.prompt.text).toBe("Naruto E2E Player Two's turn - Main phase");
    expect(projection.logLines.map((line) => line.text)).toEqual([
      "Local Naruto P1 draws a card.",
      "Naruto E2E Player Two passes.",
      "Kakashi Hatake hits Local Naruto P1's Leader for 1. (14 Life remaining)",
    ]);
  });

  test("renders system and effect logs without raw template placeholders", () => {
    const names = { p1: "Naruto", p2: "Sasuke" };
    const lines = [
      logEntryText(
        { turn: 1, actor: "system", key: "log.deckOut", values: { player: "Naruto" } },
        names,
      ),
      logEntryText(
        { turn: 1, actor: "system", key: "log.victory", values: { player: "Sasuke" } },
        names,
      ),
      logEntryText(
        { turn: 1, actor: "p1", key: "log.koAll", values: { card: "Almighty Push" } },
        names,
      ),
      logEntryText({ turn: 1, actor: "p1", key: "log.koTarget", values: { card: "Jugo" } }, names),
      logEntryText({ turn: 1, actor: "p1", key: "log.bounce", values: { card: "Jugo" } }, names),
    ];

    expect(lines).toEqual([
      "Naruto cannot draw - decked out.",
      "Sasuke wins the game!",
      "Almighty Push K.O.s all characters!",
      "Jugo is K.O.'d by an effect.",
      "Jugo returns to its owner's hand.",
    ]);
    for (const line of lines) expect(line).not.toMatch(/\{\w+\}/);
  });

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
    const bottomFirstChakra = projection.bottom.chakra[0];
    expect(bottomFirstChakra?.visible ? bottomFirstChakra.cardId : undefined).toBe(
      state.players.p1.chakra[0]?.cardId,
    );
    expect(projection.bottom.summon).toEqual({
      uid: state.players.p1.summon.uid,
      cardId: state.players.p1.summon.cardId,
      rested: state.players.p1.summon.rested,
    });

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
    const opponentHandEntity = projection.entities.find((e) => e.id === "hidden:p1:p2:hand:0");
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
    expect(projection.table.zones.find((z) => z.id === "p1-chakra")?.entityIds).toEqual([]);
    expect(projection.table.zones.find((z) => z.id === "p1-ex")?.entityIds).toEqual([]);

    const entityIds = new Set(projection.entities.map((entity) => entity.id));
    for (const zone of projection.table.zones) {
      for (const entityId of zone.entityIds) {
        expect(entityIds).toContain(entityId);
      }
    }

    // seam pills: end turn enabled for the active viewer
    const endTurn = projection.seamPills.find((p) => p.id === "end-turn");
    expect(endTurn?.enabled).toBe(true);

    // leader pills exist under the leader uid key
    expect(projection.pills[leaderUid("p1")]?.length).toBeGreaterThan(0);
  });

  test("full projection never serializes opponent hidden identities or identity-bearing uids", () => {
    const fixture = getNarutoFixture("mid-game");
    if (!fixture) throw new Error("fixture missing");
    const state = structuredClone(fixture.state);
    state.players.p2.hand = [{ uid: "p2-hand-PRIVATE-HAND-CARD", cardId: "PRIVATE-HAND-CARD" }];
    state.players.p2.supports[0] = {
      uid: "p2-support-PRIVATE-SUPPORT-CARD",
      cardId: "PRIVATE-SUPPORT-CARD",
    };
    state.players.p2.chakra[0] = {
      uid: "p2-chakra-PRIVATE-CHAKRA-CARD",
      cardId: "PRIVATE-CHAKRA-CARD",
      faceUp: true,
    };

    const projection = projectSimulator(state, "p1");
    const serialized = JSON.stringify(projection);
    expect(serialized).not.toContain("PRIVATE-HAND-CARD");
    expect(serialized).not.toContain("PRIVATE-SUPPORT-CARD");
    expect(serialized).not.toContain("p2-hand-PRIVATE-HAND-CARD");
    expect(serialized).not.toContain("p2-support-PRIVATE-SUPPORT-CARD");
    expect(serialized).not.toContain("PRIVATE-CHAKRA-CARD");
    expect(serialized).not.toContain("p2-chakra-PRIVATE-CHAKRA-CARD");

    expect(projection.top.chakra[0]).toEqual({
      uid: "hidden:p1:p2:chakra:0",
      faceUp: true,
      visible: false,
    });

    const hiddenHand = projection.top.hand[0];
    expect(hiddenHand).toEqual({
      uid: "hidden:p1:p2:hand:0",
      visible: false,
      isCharacter: false,
      isSupport: false,
    });
    expect(hiddenHand).not.toHaveProperty("cardId");
    expect(hiddenHand).not.toHaveProperty("name");

    const hiddenSupport = projection.top.supports[0];
    expect(hiddenSupport).toEqual({
      uid: "hidden:p1:p2:support:0",
      slotIndex: 0,
      revealed: false,
      visible: false,
      cost: null,
      chainLink: null,
    });
    expect(hiddenSupport).not.toHaveProperty("cardId");
    expect(hiddenSupport).not.toHaveProperty("name");

    const hiddenEntityIds = projection.entities
      .filter((entity) => entity.ownerId === "p2" && entity.face === "hidden")
      .map((entity) => entity.id);
    expect(hiddenEntityIds).toContain("hidden:p1:p2:hand:0");
    expect(hiddenEntityIds).toContain("hidden:p1:p2:support:0");
    expect(projection.table.zones.find((zone) => zone.id === "p2-hand")?.entityIds).toEqual([
      "hidden:p1:p2:hand:0",
    ]);

    // The viewer's own engine ids remain action-compatible.
    const ownHand = state.players.p1.hand[0];
    expect(projection.bottom.hand[0]?.uid).toBe(ownHand?.uid);
    expect(projection.pills[ownHand?.uid ?? ""]).toBeDefined();
  });

  test("does not project another player's private pending-choice options", () => {
    const fixture = getNarutoFixture("modal-choice");
    if (!fixture) throw new Error("fixture missing");
    const state = fixture.state;
    const pending = state.pendingChoice;
    if (!pending || pending.player !== "p1") throw new Error("expected a p1 modal choice");
    state.pendingChoice = {
      ...pending,
      options: pending.options.map((option, index) => ({
        ...option,
        key: `PRIVATE-CHOICE-UID-${index}`,
        cardId: `PRIVATE-CHOICE-CARD-${index}`,
      })),
    };
    const privateOptions = state.pendingChoice.options;

    const opponentProjection = projectSimulator(state, "p2");
    const serialized = JSON.stringify(opponentProjection);
    expect(opponentProjection.choice).toBeNull();
    for (const option of privateOptions) {
      expect(serialized).not.toContain(option.key);
      expect(serialized).not.toContain(option.cardId);
    }

    const deciderProjection = projectSimulator(state, "p1");
    expect(deciderProjection.choice?.modalOptions).toHaveLength(privateOptions.length);
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
    expect(projection.attack?.damage).toBe(1);
    expect(projection.attack?.willKo).toBe(false);
    expect(projection.targetingIntents.length).toBe(1);
    expect(projection.targetingIntents[0]?.preview).toEqual({ damage: 1 });
    expect(projection.targetingIntents[0]?.sourceEntityId).toBe(state.pendingAttack?.attackerUid);

    const pass = projection.seamPills.find((p) => p.id === "pass-counter");
    expect(pass?.enabled).toBe(true);

    // attacker view: pass disabled with reason
    const attackerProjection = projectSimulator(state, "p1");
    const attackerPass = attackerProjection.seamPills.find((p) => p.id === "pass-counter");
    expect(attackerPass?.enabled).toBe(false);
    expect(attackerPass?.reason).toBeTruthy();
  });

  test("character counter window exposes the current K.O. forecast", () => {
    const fixture = getNarutoFixture("character-counter-window");
    if (!fixture) throw new Error("fixture missing");

    const projection = projectSimulator(fixture.state, "p2");
    expect(projection.attack?.targetKind).toBe("character");
    expect(projection.attack?.damage).toBe(5);
    expect(projection.attack?.willKo).toBe(true);
    expect(projection.targetingIntents[0]?.preview).toEqual({ damage: 5 });
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
