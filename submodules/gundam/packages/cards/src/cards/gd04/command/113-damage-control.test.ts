import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
  findStatModifier,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04DamageControl113 } from "./113-damage-control.ts";

describe("Damage Control (GD04-113)", () => {
  it("【Burst】gives an enemy Unit AP-2 during this turn", () => {
    const enemy = createMockUnit({ ap: 4, hp: 4 });
    const engine = GundamTestEngine.create({ deck: [gd04DamageControl113] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId, { targets: [enemyId] });

    expect(findStatModifier(engine, enemyId, "ap")?.modifier).toBe(-2);
  });
  describe("【Action】Choose 1 of your Units. During this battle, reduce battle damage it receives by 3.", () => {
    function setup({
      activePlayer = PLAYER_TWO,
    }: { activePlayer?: typeof PLAYER_ONE | typeof PLAYER_TWO } = {}) {
      const defender = createMockUnit({ ap: 1, hp: 8 });
      const attacker = createMockUnit({ ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DamageControl113],
          resourceArea: activeResources(3),
          play: [{ card: defender, exhausted: true }],
        },
        { play: [attacker] },
      );
      engine.getState().ctx.status.activePlayer = asPlayerId(activePlayer);
      engine.getState().ctx.status.turnPlayer = asPlayerId(activePlayer);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const defenderId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;
      return { engine, p1, p2, defenderId, attackerId, commandId };
    }

    function reachActionStep(ctx: ReturnType<typeof setup>) {
      expectSuccess(ctx.p2.enterBattle(ctx.attackerId, ctx.defenderId));
      expectSuccess(ctx.p1.passBlock());
    }

    it("reduces battle damage the chosen friendly Unit receives by 3 during the current battle", () => {
      const ctx = setup();
      reachActionStep(ctx);

      expectSuccess(ctx.p1.playCommand(gd04DamageControl113, { targets: [ctx.defenderId] }));
      expectSuccess(ctx.p1.passBattleAction());
      expectSuccess(ctx.p2.passBattleAction());

      expect(getDamageCounter(ctx.engine, ctx.defenderId)).toBe(2);
    });

    it("moves the command card to trash after resolving during the Action Step", () => {
      const ctx = setup();
      reachActionStep(ctx);

      expectSuccess(ctx.p1.playCommand(gd04DamageControl113, { targets: [ctx.defenderId] }));

      expectCardInTrash(ctx.engine, ctx.commandId, PLAYER_ONE);
    });

    it("cannot be played during Main timing because the command clause is Action-only", () => {
      const ctx = setup({ activePlayer: PLAYER_ONE });

      expectFailure(
        ctx.p1.playCommand(gd04DamageControl113, { targets: [ctx.defenderId] }),
        "WRONG_TIMING",
      );
    });

    it("cannot target an enemy Unit for the damage reduction", () => {
      const ctx = setup();
      reachActionStep(ctx);

      expectFailure(
        ctx.p1.playCommand(gd04DamageControl113, { targets: [ctx.attackerId] }),
        "INVALID_TARGET",
      );
    });
  });
});
