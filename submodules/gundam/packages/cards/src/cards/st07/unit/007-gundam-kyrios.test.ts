import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07GundamKyrios007 } from "./007-gundam-kyrios.ts";

describe("Gundam Kyrios (ST07-007)", () => {
  it("gets AP+2 during your turn while a friendly CB Pilot is in play", () => {
    const allelujah = createMockPilot({
      name: "Allelujah Haptism",
      traits: ["cb"],
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [allelujah],
      play: [st07GundamKyrios007],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [kyriosId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(allelujah, st07GundamKyrios007));

    expect(p1.getVisibleCard(kyriosId!)?.effectiveAp).toBe(5);
  });
});
