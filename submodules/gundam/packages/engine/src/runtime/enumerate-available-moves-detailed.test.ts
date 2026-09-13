/**
 * enumerateAvailableMovesDetailed — UI-facing move enumeration with
 * per-move card candidates. Proves that each wired move emits the expected
 * `selectableCardIds` for typical main-phase / battle-phase fixtures.
 */

import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { CardEffect } from "@tcg/gundam-types";
import type { PlayerId } from "../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockBase,
  createMockCommand,
  createMockPilot,
  createMockResource,
  enumerateAvailableMovesDetailed,
} from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

function getDetailed(engine: GundamTestEngine, playerId: string) {
  const runtime = engine.getRuntime() as unknown as {
    state: unknown;
    staticResources: unknown;
  };
  return enumerateAvailableMovesDetailed(
    runtime.state as Parameters<typeof enumerateAvailableMovesDetailed>[0],
    playerId as PlayerId,
    runtime.staticResources as Parameters<typeof enumerateAvailableMovesDetailed>[2],
  );
}

describe("enumerateAvailableMovesDetailed", () => {
  it("lists hand units under deployUnit.selectableCardIds in main-phase", () => {
    const unit1 = createMockUnit({ level: 1, cost: 1 });
    const unit2 = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit1, unit2],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const deploy = moves.find((m) => m.moveName === "deployUnit");
    expect(deploy).toBeDefined();
    expect(deploy!.requiresCardSelection).toBe(true);
    expect(deploy!.selectableCardIds.length).toBe(2);
  });

  it("omits deployUnit when hand has no playable units", () => {
    const unit = createMockUnit({ level: 5, cost: 5 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(1),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    expect(moves.find((m) => m.moveName === "deployUnit")).toBeUndefined();
  });

  it("lists hand bases under deployBase when the base section is empty", () => {
    const base = createMockBase({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [base],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const deploy = moves.find((m) => m.moveName === "deployBase");
    expect(deploy).toBeDefined();
    expect(deploy!.selectableCardIds.length).toBe(1);
  });

  it("lists hand pilots under assignPilot when a pairable unit exists", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const pair = moves.find((m) => m.moveName === "assignPilot");
    expect(pair).toBeDefined();
    expect(pair!.selectableCardIds.length).toBe(1);
  });

  it("omits assignPilot when no pairable unit is on the field", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    expect(moves.find((m) => m.moveName === "assignPilot")).toBeUndefined();
  });

  it("includes playCommand candidates when a main-timing command is playable", () => {
    const cmd = createMockCommand({
      level: 1,
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "no-op",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [cmd],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const play = moves.find((m) => m.moveName === "playCommand");
    expect(play).toBeDefined();
    expect(play!.selectableCardIds).toContain(
      engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0],
    );
  });

  it("returns [] when the game has ended", () => {
    const engine = GundamTestEngine.create({ hand: [createMockUnit()] });
    engine.getRuntime().state.ctx.status.gameEnded = true;
    const moves = getDetailed(engine, PLAYER_ONE);
    expect(moves).toEqual([]);
  });

  it("returns passTurn with no card selection in main-phase", () => {
    const engine = GundamTestEngine.create({ hand: [] });
    const moves = getDetailed(engine, PLAYER_ONE);
    const pass = moves.find((m) => m.moveName === "passTurn");
    expect(pass).toBeDefined();
    expect(pass!.requiresCardSelection).toBe(false);
    expect(pass!.selectableCardIds).toEqual([]);
  });

  it("omits resolveEffect when no effect is pending", () => {
    const engine = GundamTestEngine.create({ hand: [] });
    const moves = getDetailed(engine, PLAYER_ONE);

    expect(engine.getG().pendingEffects).toEqual([]);
    expect(moves.find((move) => move.moveName === "resolveEffect")).toBeUndefined();
  });

  it("excludes moves from the non-active player when move is active-player-only", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const moves = getDetailed(engine, PLAYER_TWO);
    expect(moves.find((m) => m.moveName === "deployUnit")).toBeUndefined();
  });

  it("lists only active Units with <Blocker> as declareBlock candidates", () => {
    const attacker = createMockUnit();
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const nonBlocker = createMockUnit();
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [blocker, nonBlocker] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [blockerId, nonBlockerId] = p2.getCardsInZone("battleArea");

    expect(p1.enterBattle(attackerId, "direct").success).toBe(true);

    const declareBlock = getDetailed(engine, PLAYER_TWO).find(
      (move) => move.moveName === "declareBlock",
    );
    expect(declareBlock?.selectableCardIds).toEqual([blockerId]);
    expect(declareBlock?.selectableCardIds).not.toContain(nonBlockerId);
  });

  it("keeps concede available and executable for the non-active player", () => {
    const engine = GundamTestEngine.create({ hand: [] });
    const moves = getDetailed(engine, PLAYER_TWO);

    expect(moves.find((m) => m.moveName === "concede")).toMatchObject({
      requiresCardSelection: false,
      selectableCardIds: [],
    });

    const result = engine.getRuntime().executeCommand(
      {
        commandID: "non-active-player-concede",
        move: "concede",
        prevStateID: engine.getRuntime().getState().ctx._stateID,
        actorRole: "player",
        args: {},
      },
      PLAYER_TWO as PlayerId,
    );

    expect(result.success).toBe(true);
    expect(engine.getRuntime().getState().ctx.status).toMatchObject({
      gameEnded: true,
      winner: PLAYER_ONE,
    });
  });

  // ── Pass-window legality boundaries ──────────────────────────────────────
  //
  // The simulator's "auto-pass when no valid action" automation (and the
  // card highlighting) treats any enumerated candidate as a real option.
  // A pass window must therefore enumerate a move only when a fully legal
  // play exists — cards with no legal targets, unpayable costs, or
  // attackers that cannot be blocked must not suppress an auto-pass.

  /** 【Action】 "Rest 1 enemy Unit" — requires an opponent Unit on board. */
  function makeActionRestCommand(cost = 1, level = 1) {
    const effect: CardEffect = {
      type: "command",
      activation: { timing: ["action"] },
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "【Action】 Rest 1 enemy Unit",
    };
    return createMockCommand({
      name: "Test Action Rest Command",
      level,
      cost,
      effect: effect.sourceText,
      effects: [effect],
    });
  }

  /** Reach the end-phase action-step with PLAYER_ONE (turn player) holding the decision. */
  function reachEndPhaseActionStep(engine: GundamTestEngine): void {
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expect(p1.passPhase().success).toBe(true);
    // Standby player (next-turn player) decides first in the action step.
    expect(p2.passActionStep().success).toBe(true);
    const status = engine.getState().ctx.status;
    expect(status.phase).toBe("end-phase");
    expect(status.step).toBe("action-step");
    expect(status.activePlayer).toBe(PLAYER_ONE);
  }

  describe("end-phase action step — playCommand enumeration", () => {
    it("omits playCommand when the only Action Command has no legal target", () => {
      const cmd = makeActionRestCommand();
      const engine = GundamTestEngine.create({
        hand: [cmd],
        resourceArea: resources(2),
      });
      reachEndPhaseActionStep(engine);

      const moves = getDetailed(engine, PLAYER_ONE);
      expect(moves.find((m) => m.moveName === "playCommand")).toBeUndefined();
      expect(moves.find((m) => m.moveName === "passActionStep")).toBeDefined();
    });

    it("lists playCommand when the Action Command has a legal target", () => {
      const enemy = createMockUnit();
      const cmd = makeActionRestCommand();
      const engine = GundamTestEngine.create(
        { hand: [cmd], resourceArea: resources(2) },
        { play: [enemy] },
      );
      reachEndPhaseActionStep(engine);

      const handInstanceId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;
      const moves = getDetailed(engine, PLAYER_ONE);
      const play = moves.find((m) => m.moveName === "playCommand");
      expect(play?.selectableCardIds).toContain(handInstanceId);
    });

    it("omits playCommand when a Choose-One Action Command has no legal option", () => {
      // GD05-102 shape: "Choose one — return 1 enemy Unit with HP <= 5 to
      // hand; a Unit recovers 3 HP." Real modal options stage counted target
      // picks through resolveThenQueue (a modal cannot halt twice). With no
      // Units in play neither option can resolve.
      const effect: CardEffect = {
        type: "command",
        activation: { timing: ["action"] },
        directives: [
          {
            kind: "chooseOne",
            options: [
              {
                label: "Return 1 enemy Unit with HP <= 5",
                directives: [
                  {
                    action: {
                      action: "resolveThenQueue",
                      followUp: {
                        type: "triggered",
                        activation: { timing: [] },
                        directives: [
                          {
                            action: {
                              action: "returnToHand",
                              target: {
                                owner: "opponent",
                                cardType: "unit",
                                attributeFilters: [
                                  { attribute: "hp", comparison: "lte", value: 5 },
                                ],
                                count: 1,
                              },
                            },
                          },
                        ],
                        sourceText: "Return 1 enemy Unit with HP <= 5",
                      },
                    },
                  },
                ],
              },
              {
                label: "A Unit recovers 3 HP",
                directives: [
                  {
                    action: {
                      action: "resolveThenQueue",
                      followUp: {
                        type: "triggered",
                        activation: { timing: [] },
                        directives: [
                          {
                            action: {
                              action: "recoverHP",
                              amount: 3,
                              target: { cardType: "unit", count: 1, owner: "any" },
                            },
                          },
                        ],
                        sourceText: "A Unit recovers 3 HP",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        sourceText: "【Action】 Choose one — bounce a small enemy Unit or heal a Unit",
      };
      const cmd = createMockCommand({ effect: effect.sourceText, effects: [effect] });

      const noOption = GundamTestEngine.create({
        hand: [cmd],
        resourceArea: resources(2),
      });
      reachEndPhaseActionStep(noOption);
      expect(
        getDetailed(noOption, PLAYER_ONE).find((m) => m.moveName === "playCommand"),
      ).toBeUndefined();

      const enemy = createMockUnit({ hp: 3 });
      const withOption = GundamTestEngine.create(
        { hand: [cmd], resourceArea: resources(2) },
        { play: [enemy] },
      );
      reachEndPhaseActionStep(withOption);
      const handInstanceId = withOption.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;
      expect(
        getDetailed(withOption, PLAYER_ONE).find((m) => m.moveName === "playCommand")
          ?.selectableCardIds,
      ).toContain(handInstanceId);
    });

    it("omits playCommand when the Action Command cost cannot be paid", () => {
      const enemy = createMockUnit();
      const cmd = makeActionRestCommand(3);
      const engine = GundamTestEngine.create(
        { hand: [cmd], resourceArea: resources(1) },
        { play: [enemy] },
      );
      reachEndPhaseActionStep(engine);

      const moves = getDetailed(engine, PLAYER_ONE);
      expect(moves.find((m) => m.moveName === "playCommand")).toBeUndefined();
      expect(moves.find((m) => m.moveName === "passActionStep")).toBeDefined();
    });
  });

  describe("end-phase action step — activateAbility enumeration", () => {
    /** 【Activate・Action】 "Rest 1 enemy Unit" source ability. */
    function makeRestEnemyActionAbility(): CardEffect {
      return {
        type: "activated",
        activation: { timing: ["activate:action"] },
        directives: [
          {
            action: {
              action: "rest",
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Activate・Action】 Rest 1 enemy Unit.",
      };
    }

    it("omits activateAbility when the Activate·Action effect has no legal target", () => {
      const source = createMockUnit({ effects: [makeRestEnemyActionAbility()] });
      const engine = GundamTestEngine.create({ play: [source], resourceArea: resources(2) });
      reachEndPhaseActionStep(engine);

      const moves = getDetailed(engine, PLAYER_ONE);
      expect(moves.find((m) => m.moveName === "activateAbility")).toBeUndefined();
      expect(moves.find((m) => m.moveName === "passActionStep")).toBeDefined();
    });

    it("lists activateAbility when the Activate·Action effect has a legal target", () => {
      const source = createMockUnit({ effects: [makeRestEnemyActionAbility()] });
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { play: [source], resourceArea: resources(2) },
        { play: [enemy] },
      );
      reachEndPhaseActionStep(engine);

      const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
      const moves = getDetailed(engine, PLAYER_ONE);
      expect(moves.find((m) => m.moveName === "activateAbility")?.selectableCardIds).toContain(
        unitId,
      );
    });
  });

  describe("block step — declareBlock enumeration", () => {
    it("omits declareBlock entirely when the attacker has <High-Maneuver> (13-1-6)", () => {
      const attacker = createMockUnit({ keywordEffects: [{ keyword: "HighManeuver" }] });
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create({ play: [attacker] }, { play: [blocker] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.enterBattle(attackerId, "direct").success).toBe(true);
      expect(engine.getState().ctx.status.step).toBe("block-step");

      const moves = getDetailed(engine, PLAYER_TWO);
      expect(moves.find((m) => m.moveName === "declareBlock")).toBeUndefined();
      expect(moves.find((m) => m.moveName === "passBlock")).toBeDefined();
    });

    it("lists declareBlock candidates against an ordinary attacker", () => {
      const attacker = createMockUnit();
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create({ play: [attacker] }, { play: [blocker] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.enterBattle(attackerId, "direct").success).toBe(true);

      const blockerId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const moves = getDetailed(engine, PLAYER_TWO);
      expect(moves.find((m) => m.moveName === "declareBlock")?.selectableCardIds).toEqual([
        blockerId,
      ]);
    });

    it("excludes the originally targeted Unit even if readied during the block step (8-3-3)", () => {
      const attacker = createMockUnit();
      const target = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: target, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expect(p1.enterBattle(attackerId, targetId).success).toBe(true);
      expect(engine.getState().ctx.status.step).toBe("block-step");

      // Simulate a mid-block-step "set active" effect readying the attacked
      // Unit. `readyCard` drives the production setActive handler so Gundam
      // state and card metadata stay in sync the way a live match would.
      engine.readyCard(targetId);

      const moves = getDetailed(engine, PLAYER_TWO);
      const declareBlock = moves.find((m) => m.moveName === "declareBlock");
      expect(declareBlock?.selectableCardIds ?? []).not.toContain(targetId);
    });

    it("excludes a Unit under a cannot-activate-blocker restriction and rejects its block", () => {
      const attacker = createMockUnit();
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create({ play: [attacker] }, { play: [blocker] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;
      expect(p1.enterBattle(attackerId, "direct").success).toBe(true);
      expect(engine.getState().ctx.status.step).toBe("block-step");

      // Same continuous-effect payload the production `restrictUnit` action
      // pushes (GD05-127 "It can't activate <Blocker> this turn").
      engine.getG().continuousEffects.push({
        id: `test_cannotActivateBlocker_${blockerId}`,
        sourceId: attackerId,
        targetId: blockerId,
        payload: { kind: "restriction", restriction: "cannot-activate-blocker" },
        duration: "this-turn",
        createdAtTurn: engine.getState().ctx.status.turn,
      });

      const moves = getDetailed(engine, PLAYER_TWO);
      expect(moves.find((m) => m.moveName === "declareBlock")).toBeUndefined();
      expect(moves.find((m) => m.moveName === "passBlock")).toBeDefined();

      expect(p2.declareBlock(blockerId)).toMatchObject({
        success: false,
        errorCode: "CANNOT_BLOCK",
      });
    });
  });
});
