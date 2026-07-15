import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasPreventDamage,
} from "@tcg/gundam-engine";
import { st06FierceUnity013 } from "./013-fierce-unity.ts";

describe("Fierce Unity (ST06-013)", () => {
  it("【Action】: applies prevent-damage to the two chosen (Clan) Units only — non-chosen (Clan) Units untouched", () => {
    const clanA = createMockUnit({ ap: 2, hp: 3, traits: ["clan"] });
    const clanB = createMockUnit({ ap: 2, hp: 3, traits: ["clan"] });
    const clanC = createMockUnit({ ap: 2, hp: 3, traits: ["clan"] });
    const engine = GundamTestEngine.create({
      hand: [st06FierceUnity013],
      play: [clanA, clanB, clanC],
      resourceArea: activeResources(3),
    });
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [idA, idB, idC] = p1.getCardsInZone("battleArea");

    // Choose 2 of 3 Clan Units.
    expectSuccess(p1.playCommand(st06FierceUnity013, { targets: [idA!, idB!] }));

    expect(hasPreventDamage(engine, idA!)).toBe(true);
    expect(hasPreventDamage(engine, idB!)).toBe(true);
    expect(hasPreventDamage(engine, idC!)).toBe(false);
  });
});
