import { describe, expect, it } from "vite-plus/test";
import { canAttackThisTurn } from "../../../../../../cyberpunk/packages/engine/src/automation/util/attack-readiness.ts";
import type { FilteredCardView } from "../../../../../../cyberpunk/packages/engine/src/view/filter.ts";
import { NativeEngine, matchCatalog, playerId, semanticNativeHash } from "./native-engine.ts";
import { loadReferenceRuntime, type NativeAction, type Seat } from "./runtime.ts";
const worker = process.env.CHOOMBATTLER_REFERENCE_WORKER;
const catalog = process.env.CHOOMBATTLER_REFERENCE_CATALOG;
describe.skipIf(!worker || !catalog)("native information projection", () => {
  function fixture(emptyFixer = false) {
    if (!worker || !catalog) throw new Error("Missing external fixture");
    const runtime = loadReferenceRuntime(worker, catalog);
    const setup = {
      userId: "projection",
      deck: Array<string>(30).fill("cb-6th-street-recruits"),
      legends: [],
    };
    const state = runtime.api.setup(
      { gameId: "projection", seed: 419, players: { 1: setup, 2: setup } },
      { startPhase: "playing", shuffleDeck: false },
    );
    if (emptyFixer) state.players[state.currentPlayer].fixerDice = [];
    const engine = new NativeEngine(state, runtime, matchCatalog(runtime));
    function place(
      seat: Seat,
      definitionId: string,
      zone: "field" | "hand" | "legends" | "eddies" | "trash" = "field",
    ) {
      const id = engine.state.players[seat].deck.shift();
      const instance = id && engine.state.instances[id];
      if (!instance) throw new Error("Missing fixture instance");
      instance.definitionId = definitionId;
      instance.faceDown = zone !== "field";
      engine.state.players[seat][zone].push(instance.instanceId);
      return instance;
    }
    function act(action: NativeAction) {
      expect(
        runtime.api.actions(engine.state, runtime.cards, runtime.api.actor(engine.state) ?? 1),
      ).toContainEqual(action);
      const result = engine.applyNativeAction(action);
      expect(result.error).toBeUndefined();
      return result;
    }
    function card(id: string, oracle = true): FilteredCardView {
      const view = oracle ? engine.getOracleView(playerId(1)) : engine.getFilteredView(playerId(1));
      for (const player of Object.values(view.players))
        for (const cards of Object.values(player.zones)) {
          if (!Array.isArray(cards)) continue;
          const match = cards.find((card) => card.instanceId === id);
          if (match) return match;
        }
      throw new Error(`Missing projected card ${id}`);
    }
    return { engine, runtime, place, act, card };
  }
  it("supplies native restrictions and lag permissions to our readiness evaluator", () => {
    const { place, card } = fixture();
    const corpo = place(1, "cb-corpo-security");
    expect(card(corpo.instanceId).grantedRules).toContain("cantAttack");
    expect(canAttackThisTurn(card(corpo.instanceId), false)).toBe(false);
    const unit = place(1, "cb-6th-street-recruits");
    unit.hasLag = true;
    unit.modifiers.push({
      id: "lag",
      source: corpo.instanceId,
      kind: "lagExempt",
      value: "unit",
      duration: "thisTurn",
    });
    expect(card(unit.instanceId).grantedRules).toContain("canAttackOnPlayedTurnAgainstUnits");
    expect(canAttackThisTurn(card(unit.instanceId), false)).toBe(true);
  });
  it("expires native modifiers through the reducer without changing the parent fork", () => {
    const { engine, place, card, act } = fixture();
    const unit = place(1, "cb-6th-street-recruits");
    unit.modifiers.push({
      id: "power",
      source: unit.instanceId,
      kind: "power",
      value: 3,
      duration: "thisTurn",
    });
    expect(card(unit.instanceId).effectivePower).toBe(9);
    expect(card(unit.instanceId).activeEffects).toContainEqual(
      expect.objectContaining({ modifierLabel: "+3", durationLabel: "this turn" }),
    );
    const child = engine.fork();
    expect(child.applyNativeAction({ type: "END_TURN" }).error).toBeUndefined();
    expect(child.getOracleView(playerId(1)).players.p1?.zones.field).toContainEqual(
      expect.objectContaining({ effectivePower: 6, activeEffects: [] }),
    );
    expect(card(unit.instanceId).effectivePower).toBe(9);
    act({ type: "END_TURN" });
    expect(card(unit.instanceId).activeEffects).toEqual([]);
  });
  it("projects pending combat, fight power, and real attack and steal events", () => {
    const { engine, place, act, card } = fixture();
    const attacker = place(1, "cb-6th-street-recruits");
    const blocker = place(2, "cb-corpo-security");
    attacker.modifiers.push({
      id: "fight",
      source: attacker.instanceId,
      kind: "power",
      value: 3,
      duration: "thisTurn",
      whileFighting: true,
    });
    engine.state.players[2].gigDice = [{ id: "rival-gig", sides: 4, value: 4, owner: 2 }];
    expect(card(attacker.instanceId).effectivePower).toBe(6);
    const child = engine.fork();
    const attack = { type: "ATTACK", attackerId: attacker.instanceId, target: { kind: "gig" } };
    expect(child.applyNativeAction(attack).error).toBeUndefined();
    expect(child.getOracleView(playerId(1)).players.p1?.zones.field).toContainEqual(
      expect.objectContaining({ hasAttackedThisTurn: true }),
    );
    expect(card(attacker.instanceId).hasAttackedThisTurn).toBe(false);
    act(attack);
    expect(engine.getOracleView(playerId(1)).attackState).toMatchObject({
      kind: "direct",
      step: "react",
      defenderId: null,
      gigsToSteal: 1,
      rivalId: "p2",
    });
    const blocked = engine.fork();
    expect(
      blocked.applyNativeAction({
        type: "REACT",
        reaction: { kind: "block", blockerId: blocker.instanceId },
      }).error,
    ).toBeUndefined();
    expect(blocked.state.players[2].trash).toContain(blocker.instanceId);
    expect(blocked.getOracleView(playerId(1)).attackState).toBeNull();
    // A pending fight snapshot must use the same power context as native fight resolution.
    if (!engine.state.pendingCombat) throw new Error("Missing combat");
    const fight = new NativeEngine(
      {
        ...engine.state,
        pendingCombat: {
          ...engine.state.pendingCombat,
          target: { kind: "unit", instanceId: blocker.instanceId },
        },
      },
      engine.runtime,
      engine.join,
    );
    expect(fight.getOracleView(playerId(1)).players.p1?.zones.field).toContainEqual(
      expect.objectContaining({ effectivePower: 9 }),
    );
    expect(fight.getOracleView(playerId(1)).attackState).toMatchObject({
      kind: "fight",
      defenderId: blocker.instanceId,
    });
    act({ type: "REACT", reaction: { kind: "pass" } });
    expect(card(attacker.instanceId).hasStolenGigThisTurn).toBe(true);
    expect(engine.getOracleView(playerId(1)).attackState).toBeNull();
    act({ type: "END_TURN" });
    expect(card(attacker.instanceId).hasAttackedThisTurn).toBe(false);
    expect(card(attacker.instanceId).hasStolenGigThisTurn).toBe(false);
  });
  it("treats Go Solo Legends as field Units", () => {
    const { place, card } = fixture();
    const legend = place(1, "cb-goro-takemura-hands-unclean");
    expect(card(legend.instanceId).type).toBe("unit");
    expect(card(legend.instanceId).keywords).toContain("goSolo");
  });
  it("redacts face-down Legends, hidden Eddies, and hidden effect sources", () => {
    const { place, engine, card } = fixture();
    const legend = place(1, "cb-alt-cunningham-soulkiller-architect", "legends");
    const eddie = place(2, "cb-cyberpsychosis", "eddies");
    const unit = place(1, "cb-6th-street-recruits");
    unit.modifiers.push({
      id: "hidden-source",
      source: eddie.instanceId,
      kind: "power",
      value: 3,
      duration: "thisTurn",
    });
    expect(card(legend.instanceId, false).cardName).toBeNull();
    expect(card(eddie.instanceId, false).definitionId).toBe("");
    expect(card(unit.instanceId, false).activeEffects[0]).toMatchObject({ sourceName: "Effect" });
    expect(card(unit.instanceId, false).activeEffects[0]).not.toHaveProperty("sourceCardId");
    expect(card(unit.instanceId).activeEffects[0]).toMatchObject({
      sourceCardId: eddie.instanceId,
      sourceName: "Cyberpsychosis",
    });
    expect(typeof engine.getFilteredView(playerId(1)).players.p2?.zones.hand).toBe("number");
    legend.revealedTo = [1];
    expect(card(legend.instanceId, false).cardName).toBe("Alt Cunningham: Soulkiller Architect");
  });
  it("exposes discounts, shields, steal bans, and armed delayed defeat without mutation", () => {
    const { place, engine, card } = fixture();
    const source = place(1, "cb-cyberpsychosis", "trash");
    const unit = place(1, "cb-6th-street-recruits");
    const program = place(1, "cb-cyberpsychosis", "hand");
    const turnNumber = engine.state.turnNumber;
    engine.state.players[1].nextProgramDiscount = { amount: 2, minCost: 1, turnNumber };
    engine.state.combatShields.push({
      controller: 1,
      source: source.instanceId,
      turnNumber,
      expires: "nextFight",
    });
    engine.state.stealBans.push({
      controller: 1,
      source: source.instanceId,
      turnNumber,
      thief: "Unit",
      protects: "aboveThiefPower",
    });
    engine.state.delayedEffects.push({
      id: "delayed",
      definitionId: "cb-cyberpsychosis",
      source: source.instanceId,
      controller: 1,
      targetId: unit.instanceId,
      key: "reckoning",
      turnNumber,
      expires: "thisTurn",
    });
    engine.state.delayedEffects.push({
      id: "player-delayed",
      definitionId: "cb-safety-override",
      source: source.instanceId,
      controller: 1,
      key: "revenge",
      turnNumber,
      expires: "thisTurn",
    });
    expect(card(program.instanceId).costEffects).toHaveLength(1);
    expect(card(unit.instanceId).grantedRules).toContain("cantBeDefeatedInFight");
    expect(card(unit.instanceId).activeEffects).toContainEqual(
      expect.objectContaining({ defeatIfAttacksAtEndOfTurn: true, defeatsAtEndOfTurn: false }),
    );
    unit.turnFlags = { cyberpsychosis: turnNumber };
    expect(card(unit.instanceId).activeEffects).toContainEqual(
      expect.objectContaining({ defeatsAtEndOfTurn: true, defeatIfAttacksAtEndOfTurn: false }),
    );
    expect(
      engine
        .getOracleView(playerId(1))
        .players.p1?.activeEffects.map((effect) => effect.effectKind),
    ).toEqual([
      "costModifier",
      "preventNextRivalFightDefeat",
      "nativeStealBan",
      "nativeDelayedEffect",
    ]);
    const before = semanticNativeHash(engine.state);
    engine.getOracleView(playerId(1));
    engine.getFilteredView(playerId(2));
    expect(semanticNativeHash(engine.state)).toBe(before);
  });
  it("uses native aura predicates, attached keywords, and Go Solo costs", () => {
    const { engine, runtime, place, card } = fixture();
    const ally = place(1, "cb-6th-street-recruits");
    const saul = place(1, "cb-saul-bright-stormrider");
    expect(card(ally.instanceId).effectivePower).toBe(6);
    const raid = new NativeEngine(
      {
        ...engine.state,
        pendingCombat: {
          attackerId: ally.instanceId,
          attackerController: 1,
          target: { kind: "gig" },
          phase: "declare",
          blocked: false,
        },
      },
      runtime,
      engine.join,
    );
    expect(raid.getOracleView(playerId(1)).players.p1?.zones.field).toContainEqual(
      expect.objectContaining({
        instanceId: ally.instanceId,
        effectivePower: 8,
        activeEffects: expect.arrayContaining([
          expect.objectContaining({ sourceCardId: saul.instanceId, modifierLabel: "2" }),
        ]),
      }),
    );
    const rival = place(2, "cb-meredith-stout-stone-cold-corpo");
    const legend = place(1, "cb-goro-takemura-hands-unclean", "legends");
    legend.faceDown = false;
    const fight = new NativeEngine(
      {
        ...engine.state,
        pendingCombat: {
          attackerId: legend.instanceId,
          attackerController: 1,
          target: { kind: "unit", instanceId: rival.instanceId },
          phase: "declare",
          blocked: false,
        },
      },
      runtime,
      engine.join,
    );
    expect(fight.getOracleView(playerId(1)).players.p2?.zones.field).toContainEqual(
      expect.objectContaining({
        effectivePower: 7,
        activeEffects: expect.arrayContaining([
          expect.objectContaining({ effectKind: "powerModifier", modifierLabel: "2" }),
        ]),
      }),
    );
    const gear = place(1, "cb-riot-shield", "trash");
    engine.state.players[1].trash = engine.state.players[1].trash.filter(
      (id) => id !== gear.instanceId,
    );
    ally.attachedGearIds.push(gear.instanceId);
    expect(card(ally.instanceId).keywords).toContain("blocker");
    expect(card(ally.instanceId).activeEffects).toContainEqual(
      expect.objectContaining({ sourceCardId: gear.instanceId, rule: "blocker" }),
    );
    const expectedCost = runtime.api.goSoloCost(engine.state, runtime.cards, legend.instanceId, 1);
    engine.state.goSoloDiscounts.push({
      controller: 1,
      source: gear.instanceId,
      amount: 2,
      minCost: 1,
      turnNumber: engine.state.turnNumber,
    });
    expect(card(legend.instanceId).effectiveCost).toBe(Math.max(1, expectedCost - 2));
    expect(card(legend.instanceId).costEffects).toHaveLength(1);
    expect(engine.getOracleView(playerId(1)).players.p1?.activeEffects).toContainEqual(
      expect.objectContaining({ label: "Go Solo costs 2 less (minimum 1)" }),
    );
  });
  it("keeps a block target and redirect history while native effects await a choice", () => {
    const { engine, place, act } = fixture();
    const attacker = place(1, "cb-6th-street-recruits");
    const blocker = place(2, "cb-corpo-security");
    const goro = place(2, "cb-goro-takemura-vengeful-bodyguard", "legends");
    goro.faceDown = false;
    engine.state.players[2].gigDice = [{ id: "rival-gig", sides: 4, value: 4, owner: 2 }];
    act({ type: "ATTACK", attackerId: attacker.instanceId, target: { kind: "gig" } });
    act({ type: "REACT", reaction: { kind: "block", blockerId: blocker.instanceId } });
    expect(engine.getOracleView(playerId(1)).attackState).toMatchObject({
      attackerId: attacker.instanceId,
      defenderId: blocker.instanceId,
      kind: "fight",
      step: "fight",
      redirectedByBlocker: true,
      redirectedTargets: [null],
    });
  });
  it("separates own-turn and rival-turn Calls and clears them on the next turn", () => {
    const { engine, act } = fixture();
    engine.state.players[1].hasCalledLegendThisTurn = true;
    engine.state.players[2].hasCalledLegendThisTurn = true;
    expect(engine.getOracleView(playerId(1)).players.p1).toMatchObject({
      calledLegendThisTurn: true,
      calledLegendThisRivalTurn: false,
    });
    expect(engine.getOracleView(playerId(1)).players.p2).toMatchObject({
      calledLegendThisTurn: false,
      calledLegendThisRivalTurn: true,
    });
    act({ type: "END_TURN" });
    for (const player of Object.values(engine.getOracleView(playerId(1)).players))
      expect(player).toMatchObject({
        calledLegendThisTurn: false,
        calledLegendThisRivalTurn: false,
      });
  });
  it("records empty Fixers at turn start and projects their real zone", () => {
    const { engine, act } = fixture();
    engine.state.players[1].fixerDice = [];
    expect(engine.getOracleView(playerId(1)).turnBeganWithEmptyFixer).toBe(false);
    engine.state.players[2].fixerDice = [];
    act({ type: "END_TURN" });
    expect(engine.getOracleView(playerId(1))).toMatchObject({
      turnBeganWithEmptyFixer: true,
      previousTurnBeganWithEmptyFixer: false,
    });
    act({ type: "END_TURN" });
    expect(engine.getOracleView(playerId(1))).toMatchObject({
      turnBeganWithEmptyFixer: true,
      previousTurnBeganWithEmptyFixer: true,
    });
    expect(fixture(true).engine.getOracleView(playerId(1)).turnBeganWithEmptyFixer).toBe(true);
    expect(fixture().engine.getOracleView(playerId(1)).players.p1?.zones.fixerArea).toContainEqual(
      expect.objectContaining({ zone: "fixerArea" }),
    );
  });
});
