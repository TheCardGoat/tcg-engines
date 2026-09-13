import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05GundamFlaurosRyuseiGo060 } from "./060-gundam-flauros-ryusei-go.ts";

describe("Gundam Flauros (Ryusei-Go) (GD05-060)", () => {
  /** @behavioral-proof complete: Deploy and Attack timing, enemy ownership, Lv.2 boundary, target choice, and destruction are public. */
  it("【Deploy】 destroys a chosen enemy Unit at the printed Lv.2 limit", () => {
    const eligible = createMockUnit({ name: "Lv.2 enemy", level: 2 });
    const ineligible = createMockUnit({ name: "Lv.3 enemy", level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05GundamFlaurosRyuseiGo060],
        resourceArea: activeResources(5),
      },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd05GundamFlaurosRyuseiGo060));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection")
      throw new Error("Expected Flauros's Deploy target choice");
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expectFailure(p1.resolveEffect({ targets: [ineligibleId!] }), "ILLEGAL_TARGET");
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getCardZone(eligibleId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("【Attack】 presents the same target choice and destroys the selected eligible enemy", () => {
    const eligible = createMockUnit({ name: "Lv.2 enemy", level: 2 });
    const ineligible = createMockUnit({ name: "Lv.3 enemy", level: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamFlaurosRyuseiGo060] },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection")
      throw new Error("Expected Flauros's Attack target choice");
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getCardZone(eligibleId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
