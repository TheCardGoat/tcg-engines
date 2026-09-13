import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01Hildolfr052 } from "./052-hildolfr.ts";

describe("Hildolfr (EB01-052)", () => {
  it("【Deploy】 against three enemy Units returns only a chosen Unit with 2 or less HP", () => {
    const eligible = createMockUnit({ hp: 2 });
    const ineligible = createMockUnit({ hp: 3 });
    const third = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [eb01Hildolfr052], resourceArea: activeResources(3) },
      { play: [eligible, ineligible, third] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleId, ineligibleId, thirdId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(eb01Hildolfr052));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p2.getCardZone(thirdId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not trigger while fewer than three enemy Units are in play", () => {
    const engine = GundamTestEngine.create(
      { hand: [eb01Hildolfr052], resourceArea: activeResources(3) },
      { play: [createMockUnit({ hp: 2 }), createMockUnit({ hp: 2 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(eb01Hildolfr052));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
