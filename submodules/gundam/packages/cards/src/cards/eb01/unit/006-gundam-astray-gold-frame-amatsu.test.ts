import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01GundamAstrayGoldFrameAmatsu006 } from "./006-gundam-astray-gold-frame-amatsu.ts";

describe("Gundam Astray Gold Frame Amatsu (EB01-006)", () => {
  it("【Deploy】 grants Repair 1 to only the chosen friendly Unit", () => {
    const ally = createMockUnit({ name: "Chosen Ally" });
    const engine = GundamTestEngine.create({
      hand: [eb01GundamAstrayGoldFrameAmatsu006],
      play: [ally],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamAstrayGoldFrameAmatsu006));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([allyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId] }));

    expect(p1.getVisibleCard(allyId)?.keywords).toContain("Repair");
  });

  it("removes the granted Repair at the end of the turn", () => {
    const ally = createMockUnit({ name: "Chosen Ally" });
    const engine = GundamTestEngine.create({
      hand: [eb01GundamAstrayGoldFrameAmatsu006],
      play: [ally],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamAstrayGoldFrameAmatsu006));
    expectSuccess(p1.resolveEffect({ targets: [allyId] }));
    expect(p1.getVisibleCard(allyId)?.keywords).toContain("Repair");

    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(allyId)?.keywords).not.toContain("Repair");
  });
});
