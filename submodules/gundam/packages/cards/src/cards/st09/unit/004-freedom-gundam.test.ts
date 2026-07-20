import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st09FreedomGundam004 } from "./004-freedom-gundam.ts";

describe("Freedom Gundam (ST09-004)", () => {
  it("deploys with printed 4 AP/5 HP for Lv.6 and cost 5", () => {
    const engine = GundamTestEngine.create({
      hand: [st09FreedomGundam004],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(st09FreedomGundam004));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 5 });
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(5);
  });

  it("requires Lv.6", () => {
    const engine = GundamTestEngine.create({
      hand: [st09FreedomGundam004],
      resourceArea: activeResources(5),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st09FreedomGundam004),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires five active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st09FreedomGundam004],
      resourceArea: restedResources(6),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st09FreedomGundam004),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("satisfies its printed Link Condition with Kira Yamato", () => {
    const kira = createMockPilot({
      name: "Kira Yamato",
      level: 1,
      cost: 1,
      apBonus: 0,
      effects: [
        {
          type: "constant",
          activation: { conditions: [{ type: "duringLink" }] },
          directives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 1,
                duration: "permanent",
                target: { owner: "self", cardType: "unit" },
              },
            },
          ],
          sourceText: "【During Link】This Unit gets AP+1.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [kira],
      play: [st09FreedomGundam004],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(kira, unitId));

    expect(p1.getPilotId(unitId)).toBeDefined();
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
  });

  describe("<Blocker>", () => {
    it("is visibly present and intercepts an attack aimed at another friendly Unit", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, st09FreedomGundam004] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, freedomId] = p2.getCardsInZone("battleArea");

      expect(p2.getVisibleCard(freedomId!)?.keywords).toContain("Blocker");
      expectSuccess(p1.enterBattle(attackerId, defenderId!));
      expectSuccess(p2.declareBlock(freedomId!));
      expect(p1.getBoardView().pendingCombat).toMatchObject({
        blockerId: freedomId,
        target: defenderId,
      });
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(freedomId!)).toBe(3);
      expect(p2.getDamage(defenderId!)).toBe(0);
    });
  });

  describe("friendly-Base Suppression", () => {
    it("visibly gains Suppression while a friendly Base is in play", () => {
      const engine = GundamTestEngine.create({
        play: [st09FreedomGundam004],
        baseSection: [createMockBase()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getVisibleCard(p1.getCardsInZone("battleArea")[0]!)?.keywords).toContain(
        "Suppression",
      );
      expectSuccess(p1.passPhase());
    });

    it("does not gain Suppression without a friendly Base", () => {
      const engine = GundamTestEngine.create({ play: [st09FreedomGundam004] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getVisibleCard(p1.getCardsInZone("battleArea")[0]!)?.keywords).not.toContain(
        "Suppression",
      );
      expectSuccess(p1.passPhase());
    });

    it("does not gain Suppression from an opponent's Base", () => {
      const engine = GundamTestEngine.create(
        { play: [st09FreedomGundam004] },
        { baseSection: [createMockBase()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getVisibleCard(p1.getCardsInZone("battleArea")[0]!)?.keywords).not.toContain(
        "Suppression",
      );
      expectSuccess(p1.passPhase());
    });

    it("destroys the first two Shields simultaneously on a direct attack", () => {
      const engine = GundamTestEngine.create(
        { play: [st09FreedomGundam004], baseSection: [createMockBase()] },
        { shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const freedomId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(freedomId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
      expect(p2.getCardsInZone("trash")).toHaveLength(2);
    });

    it("destroys only one Shield without a friendly Base", () => {
      const engine = GundamTestEngine.create(
        { play: [st09FreedomGundam004] },
        { shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(2);
      expect(p2.getCardsInZone("trash")).toHaveLength(1);
    });
  });
});
