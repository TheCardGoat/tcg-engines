import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01GundamGeminass02057 } from "./057-gundam-geminass-02.ts";

describe("Gundam Geminass 02 (EB01-057)", () => {
  it("【Deploy】 may rest an active friendly Lv.3 Unit, then returns an enemy Lv.2 Unit", () => {
    const payer = createMockUnit({ level: 3 });
    const wrongLevel = createMockUnit({ level: 2 });
    const eligible = createMockUnit({ level: 2 });
    const ineligible = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01GundamGeminass02057],
        play: [payer, wrongLevel],
        resourceArea: activeResources(4),
      },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [payerId, wrongLevelId] = p1.getCardsInZone("battleArea");
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(eb01GundamGeminass02057));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection")
      throw new Error("Expected Geminass 02's optional cost");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [payerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [payerId!] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.isExhausted(payerId!)).toBe(true);
    expect(p1.isExhausted(wrongLevelId!)).toBe(false);
    expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not return an enemy Unit when the optional friendly rest is declined", () => {
    const payer = createMockUnit({ level: 3 });
    const enemy = createMockUnit({ level: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01GundamGeminass02057],
        play: [payer],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const payerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamGeminass02057));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected the optional friendly rest");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

    expect(p1.isExhausted(payerId)).toBe(false);
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
