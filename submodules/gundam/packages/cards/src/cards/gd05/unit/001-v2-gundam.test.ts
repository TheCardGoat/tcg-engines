import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectRepairAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05V2Gundam001 } from "./001-v2-gundam.ts";

describe("V2 Gundam (GD05-001)", () => {
  it("<Repair 2> recovers exactly 2 HP at its controller's End Phase", () => {
    expectRepairAbility(gd05V2Gundam001, 2);
  });

  it("rests exactly 2 active friendly Units to set itself as active", () => {
    const firstHelper = createMockUnit({ name: "First Helper" });
    const secondHelper = createMockUnit({ name: "Second Helper" });
    const thirdHelper = createMockUnit({ name: "Third Helper" });
    const alreadyRested = createMockUnit({ name: "Already Rested" });
    const engine = GundamTestEngine.create({
      play: [
        { card: gd05V2Gundam001, exhausted: true },
        firstHelper,
        secondHelper,
        thirdHelper,
        { card: alreadyRested, exhausted: true },
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [v2Id, firstHelperId, secondHelperId, thirdHelperId, alreadyRestedId] =
      p1.getCardsInZone("battleArea");

    const [costStep] = p1.getMoveProcedure("activateAbility", {
      cardId: v2Id!,
      effectIndex: 0,
    });
    expect(costStep).toMatchObject({
      kind: "selectTarget",
      role: "cost",
      candidateIds: [firstHelperId, secondHelperId, thirdHelperId],
      minTargets: 2,
      maxTargets: 2,
    });
    if (costStep?.kind !== "selectTarget") throw new Error("Expected the rest cost");
    expect(costStep.candidateIds).not.toContain(v2Id);
    expect(costStep.candidateIds).not.toContain(alreadyRestedId);

    expectSuccess(
      p1.activateAbility(v2Id!, 0, {
        targets: [firstHelperId!, secondHelperId!],
      }),
    );

    expect(p1.isExhausted(v2Id!)).toBe(false);
    expect(p1.isExhausted(firstHelperId!)).toBe(true);
    expect(p1.isExhausted(secondHelperId!)).toBe(true);
    expect(p1.isExhausted(thirdHelperId!)).toBe(false);
  });

  it("cannot activate with fewer than 2 active friendly Units available for the cost", () => {
    const onlyHelper = createMockUnit({ name: "Only Helper" });
    const engine = GundamTestEngine.create({
      play: [{ card: gd05V2Gundam001, exhausted: true }, onlyHelper],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [v2Id] = p1.getCardsInZone("battleArea");

    expectFailure(p1.activateAbility(v2Id!, 0), "COST_NOT_PAYABLE");
    expect(p1.isExhausted(v2Id!)).toBe(true);
  });
});
