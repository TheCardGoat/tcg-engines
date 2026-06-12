import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  getEffectiveStats,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07GundamVirtue004 } from "./004-gundam-virtue.ts";

describe("Gundam Virtue (ST07-004)", () => {
  it("gains Blocker while a friendly CB Pilot is in play", () => {
    const tieria = createMockPilot({ name: "Tieria Erde", traits: ["cb"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [tieria],
      play: [st07GundamVirtue004],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [virtueId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(tieria, st07GundamVirtue004));
    const fw = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(virtueId!, engine.getG(), fw.cards, fw).keywords).toContain("Blocker");
  });
});
