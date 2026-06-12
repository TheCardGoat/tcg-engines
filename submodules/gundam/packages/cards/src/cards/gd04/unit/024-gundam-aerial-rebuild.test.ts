import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamAerialRebuild024 } from "./024-gundam-aerial-rebuild.ts";

describe("Gundam Aerial Rebuild (GD04-024)", () => {
  it("【Deploy】 reveals top 3 and tutors an (Academy) card to hand", () => {
    const academyTutor = createMockUnit({
      ap: 1,
      hp: 1,
      traits: ["academy"],
    });
    const filler1 = createMockUnit({ ap: 1, hp: 1, traits: ["unrelated-1"] });
    const filler2 = createMockUnit({ ap: 1, hp: 1, traits: ["unrelated-2"] });

    const engine = GundamTestEngine.create({
      hand: [gd04GundamAerialRebuild024],
      deck: [academyTutor, filler1, filler2],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    expectSuccess(p1.deployUnit(gd04GundamAerialRebuild024));

    // -1 (rebuild deployed) + 1 (academy tutored) = 0 net change.
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore);
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const handIds = p1.getCardsInZone("hand");
    const academyInHand = handIds.some((id) => {
      const def = framework.cards.getDefinition(id) as { traits?: readonly string[] } | undefined;
      return def?.traits?.includes("academy");
    });
    expect(academyInHand).toBe(true);
  });
});
