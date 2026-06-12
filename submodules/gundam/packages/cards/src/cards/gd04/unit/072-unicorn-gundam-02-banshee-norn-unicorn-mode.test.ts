import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04UnicornGundam02BansheeNornUnicornMode072 } from "./072-unicorn-gundam-02-banshee-norn-unicorn-mode.ts";

describe("Unicorn Gundam 02 Banshee Norn (Unicorn Mode) (GD04-072)", () => {
  it("【When Linked】 returns the chosen enemy Unit with 3 or less HP to its owner's hand", () => {
    const riddhe = createMockPilot({ name: "Riddhe Marcenas", level: 5, cost: 1 });
    const fragile = createMockUnit({ ap: 2, hp: 3 });
    const heavy = createMockUnit({ ap: 4, hp: 6 });

    const engine = GundamTestEngine.create(
      {
        hand: [riddhe],
        play: [gd04UnicornGundam02BansheeNornUnicornMode072],
        resourceArea: activeResources(5),
      },
      { play: [fragile, heavy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bansheeId = p1.getCardsInZone("battleArea")[0]!;
    const [fragileId, heavyId] = p2.getCardsInZone("battleArea");

    const p2HandBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_TWO });

    expectSuccess(p1.assignPilot(riddhe, bansheeId));
    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [fragileId!] }));
    }

    expect(engine.getState().ctx.zones.private.cardIndex[fragileId!]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_TWO })).toBe(p2HandBefore + 1);
    // The 6-HP unit cannot be chosen (filter is HP ≤ 3) so it stays in play.
    expect(engine.getState().ctx.zones.private.cardIndex[heavyId!]?.zoneKey).toBe(
      `battleArea:${PLAYER_TWO}`,
    );
  });
});
