import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05WingsOfLight102 } from "./102-wings-of-light.ts";

describe("Wings of Light (GD05-102)", () => {
  it("lets the player choose to return an eligible enemy Unit to hand", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd05WingsOfLight102], resourceArea: activeResources(5) },
      { play: [createMockUnit({ hp: 5 }), createMockUnit({ hp: 6 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligible, ineligible] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd05WingsOfLight102));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "chooseOne" });
    expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: 0 } }));
    expectSuccess(p1.resolveEffect({ targets: [eligible!] }));

    expect(p2.getCardZone(eligible!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligible!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not offer or accept the return mode when no enemy Unit has 5 or less HP", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd05WingsOfLight102], resourceArea: activeResources(5) },
      { play: [createMockUnit({ hp: 6 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd05WingsOfLight102));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "chooseOne",
      options: [{ index: 1, label: "Choose 1 Unit. It recovers 3 HP." }],
    });
    expectFailure(p1.resolveEffect({ chooseOneAnswers: { 0: 0 } }), "NO_LEGAL_TARGETS");
    expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: 1 } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: p2.getCardsInZone("battleArea"),
    });
  });
});
