import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01LacusClyneEternal089 } from "./089-lacus-clyne-eternal.ts";

describe("Lacus Clyne & Eternal (EB01-089)", () => {
  it("returns a Shield, readies only a rested white G Generation Unit, and prevents it attacking this turn", () => {
    const eligible = createMockUnit({ color: "white", traits: ["g generation"] });
    const wrongColor = createMockUnit({ color: "blue", traits: ["g generation"] });
    const engine = GundamTestEngine.create({
      hand: [eb01LacusClyneEternal089],
      play: [
        { card: eligible, exhausted: true },
        { card: wrongColor, exhausted: true },
      ],
      shieldArea: [createMockUnit({ name: "Shield" })],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [eligibleId, wrongColorId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(eb01LacusClyneEternal089));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.isExhausted(eligibleId!)).toBe(false);
    expect(p1.isExhausted(wrongColorId!)).toBe(true);
    expectFailure(p1.enterBattle(eligibleId!, "direct"), "CANNOT_ATTACK");
  });
});
