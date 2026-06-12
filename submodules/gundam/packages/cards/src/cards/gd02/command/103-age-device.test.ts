import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02AgeDevice103 } from "./103-age-device.ts";
describe("AGE Device (GD02-103)", () => {
  it("【Burst】Choose 1 (Asuno Family) Pilot card from your trash. Add it to your hand.", () => {
    const asunoPilot = createMockPilot({ traits: ["Asuno Family"] });
    const engine = GundamTestEngine.create({
      deck: [gd02AgeDevice103],
      trash: [asunoPilot],
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd02AgeDevice103.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const [pilotId] = p1.getCardsInZone("trash");
    const handBefore = p1.getHand().length;

    engine.fireShieldBurst(shieldId);

    expect(p1.getHand()).toContain(pilotId);
    expect(p1.getHand().length).toBe(handBefore + 1);
  });

  it("【Main】places an EX Resource when an (AGE System) Unit is in play", () => {
    const ageSystemUnit = createMockUnit({ ap: 2, hp: 3, traits: ["age system"] });
    const engine = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      resourceArea: activeResources(4),
      play: [ageSystemUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.playCommand(gd02AgeDevice103));

    const after = p1.getCardsInZone("resourceArea");
    expect(after.length).toBe(resourcesBefore + 1);
    expect(after).toContain(cmdId);
    // `state: "active"` — this resource is NOT exhausted on placement.
    expect(engine.getG().exhausted[cmdId] ?? false).toBe(false);
    expect(p1.getCardsInZone("trash")).not.toContain(cmdId);
  });

  it("【Main】without an (AGE System) Unit: effect fires but no resource is placed; card lands in trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.playCommand(gd02AgeDevice103));

    // Conditional thenDirectives skipped — no resource placed, card goes
    // to trash per 3-4-4.
    expect(p1.getCardsInZone("resourceArea").length).toBe(resourcesBefore);
    expect(p1.getCardsInZone("trash")).toContain(cmdId);
  });
});
