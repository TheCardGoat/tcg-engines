import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd05GyuneiSJagdDoga057 } from "./057-gyunei-s-jagd-doga.ts";

describe("Gyunei's Jagd Doga (GD05-057)", () => {
  it("【Activate･Main】 destroys another friendly Unit, sets itself active, and forbids direct attacks", () => {
    const sacrifice = createMockUnit();
    const engine = GundamTestEngine.create({
      play: [{ card: gd05GyuneiSJagdDoga057, exhausted: true }, sacrifice],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, sacrificeId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(sourceId!, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [sacrificeId],
    });
    expectSuccess(p1.resolveEffect({ targets: [sacrificeId!] }));

    expect(p1.getCardZone(sacrificeId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.isExhausted(sourceId!)).toBe(false);
    expectFailure(p1.enterBattle(sourceId!, "direct"), "CANNOT_TARGET_PLAYER");
  });

  it("cannot activate its sacrifice effect twice in one turn", () => {
    const firstSacrifice = createMockUnit();
    const secondSacrifice = createMockUnit();
    const engine = GundamTestEngine.create({
      play: [{ card: gd05GyuneiSJagdDoga057, exhausted: true }, firstSacrifice, secondSacrifice],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, firstSacrificeId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(sourceId!, 0));
    expectSuccess(p1.resolveEffect({ targets: [firstSacrificeId!] }));

    expectFailure(p1.activateAbility(sourceId!, 0), "ABILITY_LIMIT_REACHED");
  });
});
