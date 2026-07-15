import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaDarilbalde075 } from "./075-darilbalde.ts";

describe("Darilbalde (GD01-075)", () => {
  it("【Deploy】 offers only a 1-HP enemy Unit and returns the player's choice", () => {
    const fragile = createMockUnit({ ap: 2, hp: 1 });
    const sturdy = createMockUnit({ ap: 2, hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [betaDarilbalde075], resourceArea: activeResources(3) },
      { play: [fragile, sturdy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [fragileId, sturdyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(betaDarilbalde075));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [fragileId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [fragileId!] }));

    expect(p2.getCardZone(fragileId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(sturdyId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not open a return prompt when every enemy Unit has more than 1 HP", () => {
    const sturdy = createMockUnit({ ap: 2, hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [betaDarilbalde075], resourceArea: activeResources(3) },
      { play: [sturdy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sturdyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(betaDarilbalde075));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(sturdyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
