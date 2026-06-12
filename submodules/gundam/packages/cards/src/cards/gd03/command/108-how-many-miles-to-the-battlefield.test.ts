import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03HowManyMilesToTheBattlefield108 } from "./108-how-many-miles-to-the-battlefield.ts";

describe("How Many Miles to the Battlefield? (GD03-108)", () => {
  it("【Main】 deploys an active Hy-Gogg Cyclops Team token", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03HowManyMilesToTheBattlefield108],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03HowManyMilesToTheBattlefield108));

    const tokenId = p1.getCardsInZone("battleArea")[0]!;
    const token = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId);
    expect(token?.name).toBe("Hy-Gogg");
    expect(token?.traits).toContain("cyclops team");
    expect("ap" in token! ? token!.ap : undefined).toBe(2);
    expect("hp" in token! ? token!.hp : undefined).toBe(1);
    expect(engine.getG().exhausted[tokenId]).not.toBe(true);
  });

  it("cannot be played during the action step because it is main-only", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03HowManyMilesToTheBattlefield108],
      resourceArea: activeResources(3),
    });
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd03HowManyMilesToTheBattlefield108), "WRONG_TIMING");
  });
});
