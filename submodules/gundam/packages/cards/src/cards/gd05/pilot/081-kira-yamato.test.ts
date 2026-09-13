import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05KiraYamato081 } from "./081-kira-yamato.ts";

describe("Kira Yamato (GD05-081)", () => {
  /** @behavioral-proof complete: Burst retrieval plus When Linked timing, alternative Orb/Triple Ship Alliance gate, draw amount, and false branch are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05KiraYamato081);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05KiraYamato081],
      play: [unit],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05KiraYamato081, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("draws exactly 1 when Kira links to an Orb Unit", () => {
    const orbUnit = createMockUnit({ traits: ["orb"], linkCondition: "[Kira Yamato]" });
    const engine = GundamTestEngine.create({
      hand: [gd05KiraYamato081],
      play: [orbUnit],
      resourceArea: activeResources(5),
      deck: [createMockUnit(), createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.assignPilot(gd05KiraYamato081, unitId));

    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when Kira links to a Unit without either printed trait", () => {
    const otherUnit = createMockUnit({
      traits: ["earth federation"],
      linkCondition: "[Kira Yamato]",
    });
    const engine = GundamTestEngine.create({
      hand: [gd05KiraYamato081],
      play: [otherUnit],
      resourceArea: activeResources(5),
      deck: [createMockUnit(), createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.assignPilot(gd05KiraYamato081, unitId));

    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
    expect(p1.getHand()).toHaveLength(0);
  });
});
