import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Rouei067 } from "./067-rouei.ts";

describe("Rouei (GD03-067)", () => {
  it("【Deploy】 may deal 1 damage to a friendly Unit and give it AP+1", () => {
    const ally = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Rouei067],
        play: [ally],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03Rouei067, { targets: [allyId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p1.getDamage(allyId)).toBe(1);
    expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(3);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(2);
  });

  it("may decline to damage and strengthen a friendly Unit", () => {
    const ally = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd03Rouei067],
      play: [ally],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03Rouei067));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getDamage(allyId)).toBe(0);
    expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(2);
  });
});
