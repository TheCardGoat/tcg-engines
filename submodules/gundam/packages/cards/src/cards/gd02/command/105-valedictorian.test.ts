import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasPreventDamage,
} from "@tcg/gundam-engine";
import { gd02Valedictorian105 } from "./105-valedictorian.ts";

describe("Valedictorian (GD02-105)", () => {
  it("【Action】: applies prevent-damage to the chosen Unit token only — non-chosen token and non-token untouched", () => {
    const tokenA = createMockUnit({ ap: 1, hp: 2 });
    const tokenB = createMockUnit({ ap: 1, hp: 2 });
    const nonToken = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd02Valedictorian105],
      play: [tokenA, tokenB, nonToken],
      resourceArea: activeResources(3),
    });
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [idA, idB, idNon] = p1.getCardsInZone("battleArea");

    // Flag tokenA/tokenB as Unit tokens so the isToken filter matches them.
    const state = engine.getState();
    state.ctx.zones.private.cardMeta[idA!] = { isToken: true };
    state.ctx.zones.private.cardMeta[idB!] = { isToken: true };

    expectSuccess(p1.playCommand(gd02Valedictorian105, { targets: [idA!] }));

    expect(hasPreventDamage(engine, idA!)).toBe(true);
    expect(hasPreventDamage(engine, idB!)).toBe(false);
    expect(hasPreventDamage(engine, idNon!)).toBe(false);
  });
});
