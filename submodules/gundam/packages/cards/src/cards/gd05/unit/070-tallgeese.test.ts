import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05Tallgeese070 } from "./070-tallgeese.ts";

describe("Tallgeese Ⅲ (GD05-070)", () => {
  it("readies one rested Preventer Link Unit after winning a battle but prevents it attacking", () => {
    const companion = createMockUnit({
      traits: ["preventer"],
      linkCondition: "[Test Pilot]",
    });
    const pilot = createMockPilot({ name: "Test Pilot" });
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd05Tallgeese070, { card: companion, exhausted: true }],
        resourceArea: activeResources(1),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, companionId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, companionId!));

    expectSuccess(p1.enterBattle(sourceId!, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [companionId],
    });
    expectSuccess(p1.resolveEffect({ targets: [companionId!] }));

    expect(p1.isExhausted(companionId!)).toBe(false);
    expectFailure(p1.enterBattle(companionId!, "direct"), "CANNOT_ATTACK");
  });
});
