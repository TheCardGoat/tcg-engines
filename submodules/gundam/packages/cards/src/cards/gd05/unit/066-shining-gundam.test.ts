import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  createMockResource,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd05ShiningGundam066 } from "./066-shining-gundam.ts";

describe("Shining Gundam (GD05-066)", () => {
  /** @behavioral-proof complete: Deploy optional MF exile, exact count/trait filter, dependent Special Move retrieval, decline branch, and Attack rested-Resource result are public. */
  it("【Deploy】 exiles exactly two MF Units before offering a Special Move Command from trash", () => {
    const firstMf = createMockUnit({ traits: ["mf"] });
    const secondMf = createMockUnit({ traits: ["mf"] });
    const nonMf = createMockUnit({ traits: ["shuffle alliance"] });
    const specialMove = createMockCommand({ traits: ["special move"] });
    const nonSpecialCommand = createMockCommand({ traits: ["mf"] });
    const engine = GundamTestEngine.create({
      hand: [gd05ShiningGundam066],
      trash: [firstMf, secondMf, nonMf, specialMove, nonSpecialCommand],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [firstMfId, secondMfId, nonMfId, specialMoveId] = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(gd05ShiningGundam066));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection") throw new Error("Expected Shining's optional exile");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));

    const exileChoice = p1.getBoardView().pendingChoice;
    if (exileChoice?.kind !== "targetSelection") throw new Error("Expected the MF exile choice");
    expect(exileChoice.legalTargetIds).toEqual(expect.arrayContaining([firstMfId, secondMfId]));
    expect(exileChoice.legalTargetIds).not.toContain(nonMfId);
    expect(exileChoice.minTargets).toBe(2);
    expect(exileChoice.maxTargets).toBe(2);
    expectSuccess(p1.resolveEffect({ targets: [firstMfId!, secondMfId!] }));

    expect(p1.getCardZone(firstMfId!)).toBe("removalArea");
    expect(p1.getCardZone(secondMfId!)).toBe("removalArea");
    const commandChoice = p1.getBoardView().pendingChoice;
    if (commandChoice?.kind !== "targetSelection") {
      throw new Error("Expected the dependent Special Move choice");
    }
    expect(commandChoice.legalTargetIds).toEqual([specialMoveId]);
    expectSuccess(p1.resolveEffect({ targets: [specialMoveId!] }));

    expect(p1.getCardZone(specialMoveId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(nonMfId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("may decline the Deploy exile and leaves the trash unchanged", () => {
    const firstMf = createMockUnit({ traits: ["mf"] });
    const secondMf = createMockUnit({ traits: ["mf"] });
    const specialMove = createMockCommand({ traits: ["special move"] });
    const engine = GundamTestEngine.create({
      hand: [gd05ShiningGundam066],
      trash: [firstMf, secondMf, specialMove],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashBefore = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(gd05ShiningGundam066));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection") throw new Error("Expected Shining's optional exile");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

    expect(p1.getCardsInZone("trash")).toEqual(trashBefore);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("【Attack】【Once per Turn】 sets one chosen rested Resource active", () => {
    const engine = GundamTestEngine.create({
      play: [gd05ShiningGundam066],
      resourceArea: [{ card: createMockResource(), exhausted: true }],
      deck: 2,
      shieldArea: [createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const resourceId = p1.getCardsInZone("resourceArea")[0]!;

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [resourceId],
    });
    expectSuccess(p1.resolveEffect({ targets: [resourceId] }));

    expect(p1.isExhausted(resourceId)).toBe(false);
  });
});
