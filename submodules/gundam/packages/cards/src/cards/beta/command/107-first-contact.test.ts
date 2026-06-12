import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  asPlayerId,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaFirstContact107 } from "./107-first-contact.ts";
describe("First Contact (GD01-107, beta reprint)", () => {
  it("【Burst】Place 1 EX Resource.", () => {
    const engine = GundamTestEngine.create({ deck: [betaFirstContact107] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaFirstContact107.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    engine.fireShieldBurst(shieldId);

    // `placeResource` moves the command card itself from its current zone
    // (trash, after shield-destruction) into the resource area.
    expect(p1.getCardsInZone("resourceArea").length).toBe(resourcesBefore + 1);
    expect(p1.getCardsInZone("resourceArea")).toContain(shieldId);
  });

  it("【Main】places the command card as a rested Resource", () => {
    const engine = GundamTestEngine.create({
      hand: [betaFirstContact107],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.playCommand(betaFirstContact107));

    // The command card is now a resource (placeResource moved it), the
    // move-to-trash postAction was suppressed, and `state: "rested"`
    // flagged the new resource as exhausted.
    const after = p1.getCardsInZone("resourceArea");
    expect(after.length).toBe(resourcesBefore + 1);
    expect(after).toContain(cmdId);
    expect(engine.getG().exhausted[cmdId]).toBe(true);
    // Card is not in trash.
    expect(p1.getCardsInZone("trash")).not.toContain(cmdId);
  });
});
