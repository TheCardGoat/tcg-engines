import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd02Barzam016 } from "./016-barzam.ts";

describe("Barzam (GD02-016)", () => {
  it("【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.", () => {
    const titansFriend = createMockUnit({ ap: 3, hp: 4, traits: ["titans"] });

    const engine = GundamTestEngine.create(
      {
        hand: [gd02Barzam016],
        play: [titansFriend],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [friendId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02Barzam016, { targets: [friendId!] }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(friendId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(4);
  });
});
