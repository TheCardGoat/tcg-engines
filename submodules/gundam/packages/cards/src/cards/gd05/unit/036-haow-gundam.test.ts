import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05HaowGundam036 } from "./036-haow-gundam.ts";

describe("Haow Gundam (GD05-036)", () => {
  it("【When Paired】 rests another MF Unit and deals 2 to every enemy at or below its level", () => {
    const pilot = createMockPilot();
    const payer = createMockUnit({ level: 4, traits: ["mf"] });
    const wrongTrait = createMockUnit({ level: 6, traits: ["g team"] });
    const eligible = createMockUnit({ level: 4, hp: 5 });
    const ineligible = createMockUnit({ level: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd05HaowGundam036, payer, wrongTrait],
        resourceArea: activeResources(1),
      },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, payerId, wrongTraitId] = p1.getCardsInZone("battleArea");
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, sourceId!));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection")
      throw new Error("Expected Haow Gundam's optional rest");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [payerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [payerId!] }));

    expect(p1.isExhausted(payerId!)).toBe(true);
    expect(p1.isExhausted(wrongTraitId!)).toBe(false);
    expect(p2.getDamage(eligibleId!)).toBe(2);
    expect(p2.getDamage(ineligibleId!)).toBe(0);
  });
});
