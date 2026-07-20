import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd04DamageControl113 } from "./113-damage-control.ts";

describe("Damage Control (GD04-113)", () => {
  describe("【Burst】Choose 1 enemy Unit. It gets AP-2 during this turn.", () => {
    function revealBurst() {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd04DamageControl113] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: expect.any(String),
        directiveIndex: -1,
      });

      return { p1, p2, attackerId };
    }

    it("reduces the chosen enemy Unit's visible AP by 2 when accepted", () => {
      const { p1, p2, attackerId } = revealBurst();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: expect.any(String),
        directiveIndex: 0,
      });
      expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

      expect(p2.getVisibleCard(attackerId)).toMatchObject({ effectiveAp: 2 });
      expect(p1.getCardZone(gd04DamageControl113)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("leaves the enemy Unit's AP unchanged when the Burst is declined", () => {
      const { p1, p2, attackerId } = revealBurst();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: false } }));

      expect(p2.getVisibleCard(attackerId)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getCardZone(gd04DamageControl113)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("【Action】Choose 1 of your Units. During this battle, reduce battle damage it receives by 3.", () => {
    function setup({ canPay = true } = {}) {
      const defender = createMockUnit({ ap: 1, hp: 8 });
      const attacker = createMockUnit({ ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DamageControl113],
          resourceArea: canPay ? activeResources(3) : restedResources(3),
          play: [{ card: defender, exhausted: true }],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const defenderId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;
      expectSuccess(p2.enterBattle(attackerId, defenderId));
      expectSuccess(p1.passBlock());

      return { p1, p2, defenderId, attackerId, commandId };
    }

    it("reduces battle damage the chosen friendly Unit receives by 3 during the current battle", () => {
      const ctx = setup();

      expectSuccess(ctx.p1.playCommand(ctx.commandId, { targets: [ctx.defenderId] }));
      expectSuccess(ctx.p2.passBattleAction());
      expectSuccess(ctx.p1.passBattleAction());

      expect(ctx.p1.getDamage(ctx.defenderId)).toBe(2);
      expect(ctx.p1.getCardZone(ctx.commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot target the enemy Unit for the damage reduction", () => {
      const ctx = setup();

      expectFailure(
        ctx.p1.playCommand(ctx.commandId, { targets: [ctx.attackerId] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played without an active Resource for its cost", () => {
      const ctx = setup({ canPay: false });

      expectFailure(
        ctx.p1.playCommand(ctx.commandId, { targets: [ctx.defenderId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });

    it("cannot be played during Main timing because the Command clause is Action-only", () => {
      const defender = createMockUnit({ hp: 8 });
      const engine = GundamTestEngine.create({
        hand: [gd04DamageControl113],
        play: [defender],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const defenderId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [defenderId] }), "WRONG_TIMING");
    });
  });
});
