import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01StrikeRouge069 } from "./069-strike-rouge.ts";

describe("Strike Rouge (GD01-069)", () => {
  it("【Activate･Main】 sets only the chosen rested white <Blocker> active", () => {
    // Two rested white <Blocker> friendlies — without chosenTargets
    // forwarding, setActive would refresh both.
    const blocker1 = createMockUnit({
      ap: 3,
      hp: 3,
      color: "white",
      keywordEffects: [{ keyword: "Blocker" }],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const blocker2 = createMockUnit({
      ap: 3,
      hp: 3,
      color: "white",
      keywordEffects: [{ keyword: "Blocker" }],
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      {
        play: [
          gd01StrikeRouge069,
          { card: blocker1, exhausted: true },
          { card: blocker2, exhausted: true },
        ],
        // 1 active resource to pay `payResources: 1` cost.
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [strikeId, b1Id, b2Id] = p1.getCardsInZone("battleArea");
    if (!strikeId || !b1Id || !b2Id) throw new Error("setup failed");

    expectSuccess(p1.activateAbility(gd01StrikeRouge069, 0, { targets: [b1Id] }));

    // Only the chosen blocker is set active.
    expect(engine.getG().exhausted[b1Id]).toBe(false);
    expect(engine.getG().exhausted[b2Id]).toBe(true);
  });
});
