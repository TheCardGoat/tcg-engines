import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Gundam067 } from "./067-gundam.ts";

describe("∀ Gundam (GD04-067)", () => {
  it("prompts for a keyword Unit in trash, then copies only the chosen Unit's keywords", () => {
    const chosenKeywordUnit = createMockUnit({
      name: "Chosen Keyword Unit",
      keywordEffects: [{ keyword: "Repair" }, { keyword: "Blocker" }],
    });
    const otherKeywordUnit = createMockUnit({
      name: "Other Keyword Unit",
      keywordEffects: [{ keyword: "Breach", value: 2 }],
    });
    const unitWithoutKeywords = createMockUnit({ name: "Unit Without Keywords" });
    const engine = GundamTestEngine.create({
      play: [gd04Gundam067],
      trash: [chosenKeywordUnit, otherKeywordUnit, unitWithoutKeywords],
      resourceArea: activeResources(5),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const turnAId = p1.getCardsInZone("battleArea")[0]!;
    const [chosenKeywordUnitId, otherKeywordUnitId, unitWithoutKeywordsId] =
      p1.getCardsInZone("trash");

    expectSuccess(p1.activateAbility(turnAId, 0));
    const prompt = p1.getBoardView().pendingChoice;
    expect(prompt).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: turnAId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [chosenKeywordUnitId, otherKeywordUnitId],
    });
    expect(prompt?.kind === "targetSelection" ? prompt.legalTargetIds : []).not.toContain(
      unitWithoutKeywordsId,
    );
    expectSuccess(p1.resolveEffect({ targets: [chosenKeywordUnitId!] }));

    const visibleCard = p1.getVisibleCard(turnAId);
    expect(visibleCard?.effectiveAp).toBe(5);
    expect(visibleCard?.keywords).toEqual(expect.arrayContaining(["Repair", "Blocker"]));
    expect(visibleCard?.keywords).not.toContain("Breach");

    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(turnAId)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(turnAId)?.keywords).not.toEqual(
      expect.arrayContaining(["Repair", "Blocker"]),
    );
  });
});
