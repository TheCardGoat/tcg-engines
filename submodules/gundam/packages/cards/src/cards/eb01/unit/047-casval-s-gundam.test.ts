import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import {
  acceptDevelopment,
  expectDevelopmentExiled,
} from "../../../test-helpers/development-behavior-test-helpers.ts";
import { eb01CasvalSGundam047 } from "./047-casval-s-gundam.ts";

describe("Casval's Gundam (EB01-047)", () => {
  it("【When Paired・Development 1】 exiles a G Generation card and gains High-Maneuver", () => {
    const pilot = createMockPilot();
    const development = createMockUnit({ traits: ["g generation"] });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01CasvalSGundam047],
      trash: [development],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const developmentId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(pilot, sourceId));
    acceptDevelopment(p1, [developmentId]);

    expectDevelopmentExiled(p1, [developmentId]);
    expect(p1.getVisibleCard(sourceId)?.keywords).toContain("HighManeuver");
  });

  it("does not gain High-Maneuver when its optional Development is declined", () => {
    const pilot = createMockPilot();
    const development = createMockUnit({ traits: ["g generation"] });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01CasvalSGundam047],
      trash: [development],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const developmentId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(pilot, sourceId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected Casval's Development choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

    expect(p1.getCardZone(developmentId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(sourceId)?.keywords).not.toContain("HighManeuver");
  });
});
