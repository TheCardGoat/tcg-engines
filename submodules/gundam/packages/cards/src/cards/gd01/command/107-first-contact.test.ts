import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  asPlayerId,
  expectSuccess,
  expectFailure,
  activeResources,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01FirstContact107 } from "./107-first-contact.ts";
describe("First Contact (GD01-107)", () => {
  it("【Burst】Place 1 EX Resource.", () => {
    const engine = GundamTestEngine.create({ deck: [gd01FirstContact107] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01FirstContact107.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    engine.fireShieldBurst(shieldId);

    // `placeResource` moves the command card itself from its current zone
    // (trash, after shield-destruction) into the resource area.
    expect(p1.getCardsInZone("resourceArea").length).toBe(resourcesBefore + 1);
    expect(p1.getCardsInZone("resourceArea")).toContain(shieldId);
  });

  describe("【Main】Place 1 rested Resource.", () => {
    it("cannot be played during action-phase (main-only timing)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01FirstContact107],
        resourceArea: activeResources(3),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01FirstContact107), "WRONG_TIMING");
    });

    it("places the command card as a rested resource in resourceArea", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01FirstContact107],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea").length;

      expectSuccess(p1.playCommand(gd01FirstContact107));

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      expect(resourcesAfter.length).toBe(resourcesBefore + 1);
      expect(resourcesAfter).toContain(cmdId);
      expect(engine.getG().exhausted[cmdId]).toBe(true);
      expect(p1.getCardsInZone("trash")).not.toContain(cmdId);
    });
  });
});
