import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { st10PhoenixGundamPowerUnleashedEx006 } from "./006-phoenix-gundam-power-unleashed-ex.ts";

describe("Phoenix Gundam (Power Unleashed) (EX) (ST10-006)", () => {
  it("【During Pair】 after destroying a Unit in battle returns only a chosen enemy with 3 or less HP", () => {
    const pilot = createMockPilot();
    const defender = createMockUnit({ hp: 1, ap: 0 });
    const eligible = createMockUnit({ hp: 3 });
    const ineligible = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [st10PhoenixGundamPowerUnleashedEx006],
        resourceArea: activeResources(1),
      },
      { play: [{ card: defender, exhausted: true }, eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(pilot, sourceId));

    expectSuccess(p1.enterBattle(sourceId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getCardZone(defenderId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not offer a return target when it destroys a Unit without a paired Pilot", () => {
    const defender = createMockUnit({ hp: 1, ap: 0 });
    const eligible = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [st10PhoenixGundamPowerUnleashedEx006] },
      { play: [{ card: defender, exhausted: true }, eligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, eligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sourceId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(eligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
