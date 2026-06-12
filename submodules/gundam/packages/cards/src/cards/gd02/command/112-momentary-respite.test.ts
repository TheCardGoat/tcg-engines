import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  asPlayerId,
  expectSuccess,
  activeResources,
  createMockPilot,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02MomentaryRespite112 } from "./112-momentary-respite.ts";
describe("Momentary Respite (GD02-112)", () => {
  it("【Burst】Draw 1.", () => {
    const engine = GundamTestEngine.create({
      deck: [gd02MomentaryRespite112, gd02MomentaryRespite112, gd02MomentaryRespite112],
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd02MomentaryRespite112.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;
    const deckBefore = p1.getCardsInZone("deck").length;

    engine.fireShieldBurst(shieldId);

    expect(p1.getHand().length).toBe(handBefore + 1);
    expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
  });

  it("【Main】: moves exactly the chosen purple Pilot from trash to hand — other purple pilots stay", () => {
    const purpleA = createMockPilot({ color: "purple" });
    const purpleB = createMockPilot({ color: "purple" });
    const bluePilot = createMockPilot({ color: "blue" });
    const engine = GundamTestEngine.create({
      hand: [gd02MomentaryRespite112],
      resourceArea: activeResources(5),
      trash: [purpleA, purpleB, bluePilot],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashBefore = p1.getCardsInZone("trash");
    // The trash has: [purpleA, purpleB, bluePilot].
    const [purpleAId, purpleBId, bluePilotId] = trashBefore;

    expectSuccess(p1.playCommand(gd02MomentaryRespite112, { targets: [purpleBId!] }));

    // Only purpleB moved to hand.
    const hand = p1.getHand();
    expect(hand).toContain(purpleBId);
    expect(hand).not.toContain(purpleAId);
    expect(hand).not.toContain(bluePilotId);
    const trashAfter = p1.getCardsInZone("trash");
    expect(trashAfter).toContain(purpleAId);
    expect(trashAfter).toContain(bluePilotId);
    expect(trashAfter).not.toContain(purpleBId);
  });
});
