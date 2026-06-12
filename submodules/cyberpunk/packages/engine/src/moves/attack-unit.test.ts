import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import { CyberpunkTestEngine, P1, P2, createMockUnit, registerMatchers } from "../testing/index.ts";

beforeAll(() => {
  registerMatchers();
});

/**
 * Build an engine in the main phase with `attacker` ready on P1's field and
 * `defender` spent on P2's field — the canonical "P1 may attack the spent
 * defender" setup.
 */
function setupAttack(
  attacker = createMockUnit({ name: "Attacker", power: 3 }),
  defender = createMockUnit({ name: "Defender", power: 2 }),
) {
  const engine = CyberpunkTestEngine.createWithFixture(
    { field: [{ card: attacker, spent: false, playedThisTurn: false }] },
    { field: [{ card: defender, spent: true }] },
  );
  // Fixtures start in main phase; no phase transition needed for attacks.
  return { engine, attacker, defender };
}

const moveIds = (engine: CyberpunkTestEngine, pid = P1) =>
  engine.getPrompt(pid).availableMoves.map((m) => m.moveId);

describe("attackUnit", () => {
  describe("available()", () => {
    it("is listed when an active, ready unit exists in the main phase", () => {
      const { engine } = setupAttack();
      expect(moveIds(engine)).toContain("attackUnit");
    });

    it("is not listed outside the main phase", () => {
      const attacker = createMockUnit();
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: attacker, spent: false }] },
        undefined,
        { gamePhase: "setup" },
      );
      expect(engine.getPhase()).toBe("setup");
      expect(moveIds(engine)).not.toContain("attackUnit");
    });

    it("is not listed when every friendly unit is spent or summoning-sick", () => {
      const sick = createMockUnit({ name: "Sick" });
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: sick, spent: false, playedThisTurn: true }],
      });
      expect(moveIds(engine)).not.toContain("attackUnit");
    });
  });

  describe("validate()", () => {
    it("succeeds for a ready attacker against a spent defender", () => {
      const { engine, attacker, defender } = setupAttack();
      expect(engine.attackUnit(attacker, defender)).toBeSuccessfulCommand();
    });

    it("fails with WRONG_PHASE outside the main phase", () => {
      const attacker = createMockUnit();
      const defender = createMockUnit();
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: attacker, spent: false }] },
        { field: [{ card: defender, spent: true }] },
        { gamePhase: "setup" },
      );
      const failure = engine.expectFailure(() => engine.attackUnit(attacker, defender));
      expect(failure.errorCode).toBe("WRONG_PHASE");
    });

    it("fails with CARD_SPENT when the attacker is exhausted", () => {
      const attacker = createMockUnit({ name: "Spent Attacker" });
      const defender = createMockUnit({ name: "Defender" });
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: attacker, spent: true }] },
        { field: [{ card: defender, spent: true }] },
      );
      const failure = engine.expectFailure(() => engine.attackUnit(attacker, defender));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("fails with SUMMONING_SICKNESS when the attacker was played this turn", () => {
      const attacker = createMockUnit({ name: "Fresh" });
      const defender = createMockUnit({ name: "Defender" });
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: attacker, spent: false, playedThisTurn: true }] },
        { field: [{ card: defender, spent: true }] },
      );
      const failure = engine.expectFailure(() => engine.attackUnit(attacker, defender));
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    it("fails with TARGET_READY when the defender is not spent", () => {
      const attacker = createMockUnit({ name: "Attacker" });
      const defender = createMockUnit({ name: "Ready Defender" });
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: attacker, spent: false }] },
        { field: [{ card: defender, spent: false }] },
      );
      const failure = engine.expectFailure(() => engine.attackUnit(attacker, defender));
      expect(failure.errorCode).toBe("TARGET_READY");
    });

    it("fails with NOT_ON_FIELD when the attacker is not on the active player's field", () => {
      const attacker = createMockUnit({ name: "Hand Attacker" });
      const defender = createMockUnit({ name: "Defender" });
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [attacker] },
        { field: [{ card: defender, spent: true }] },
      );
      const attackerId = engine.findCardId(attacker, "hand", P1);
      const defenderId = engine.findCardId(defender, "field", P2);
      const result = engine.executeMove(
        "attackUnit",
        { args: { attackerId: attackerId as string, defenderId: defenderId as string } },
        P1,
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("NOT_ON_FIELD");
      }
    });
  });

  describe("execute()", () => {
    it("opens an attack window with the offensive step", () => {
      const { engine, attacker, defender } = setupAttack();

      engine.attackUnit(attacker, defender);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack).toMatchObject({
        attackerId: engine.findCardId(attacker, "field", P1),
        defenderId: engine.findCardId(defender, "field", P2),
        rivalId: P2,
        kind: "fight",
        step: "offensive",
      });
    });

    it("spends the attacker and stamps hasAttackedThisTurn", () => {
      const { engine, attacker, defender } = setupAttack();

      engine.attackUnit(attacker, defender);

      const attackerInst = engine.getCard(attacker, "field", P1);
      expect(attackerInst).toBeSpent();
      expect(attackerInst.meta.hasAttackedThisTurn).toBe(true);
    });

    it("emits attackDeclared and actionLog events", () => {
      const { engine, attacker, defender } = setupAttack();

      engine.attackUnit(attacker, defender);

      const declared = engine.getEvents("attackDeclared");
      expect(declared).toHaveLength(1);
      expect(declared[0]).toMatchObject({
        type: "attackDeclared",
        attackKind: "fight",
        playerId: P1,
      });

      const log = engine.getLastActionLog();
      expect(log?.messageKey).toBe("move.attackUnit");
    });

    it("includes power totals on fight resolution action logs", () => {
      const { engine, attacker, defender } = setupAttack(
        createMockUnit({ name: "Heavy", power: 6 }),
        createMockUnit({ name: "Target", power: 2 }),
      );

      engine.attackUnit(attacker, defender);
      engine.resolveAttack({ as: P1 }); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> fight
      engine.resolveAttack({ as: P1 }); // fight -> defeat
      engine.resolveAttack({ as: P1 }); // defeat -> cleared

      const log = engine.getLastActionLog();
      expect(log?.messageKey).toBe("move.resolveAttack.fight.attackerWins");
      expect(log?.params.attackerPower).toBe(6);
      expect(log?.params.defenderPower).toBe(2);
    });

    it("blocks a second attack while one is already in progress", () => {
      const attackerA = createMockUnit({ name: "A" });
      const attackerB = createMockUnit({ name: "B" });
      const defender = createMockUnit({ name: "Def" });
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: attackerA, spent: false, playedThisTurn: false },
            { card: attackerB, spent: false, playedThisTurn: false },
          ],
        },
        { field: [{ card: defender, spent: true }] },
      );

      engine.attackUnit(attackerA, defender);
      const failure = engine.expectFailure(() => engine.attackUnit(attackerB, defender));
      expect(failure.errorCode).toBe("ATTACK_IN_PROGRESS");
    });
  });
});
