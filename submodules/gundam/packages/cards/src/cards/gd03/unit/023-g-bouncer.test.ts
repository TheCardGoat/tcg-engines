import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  enqueueOwnCardTriggers,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd03GBouncer023 } from "./023-g-bouncer.ts";

describe("G-Bouncer (GD03-023)", () => {
  it("when an EX Resource is placed, grants High-Maneuver to a friendly AGE System Unit", () => {
    const ageUnit = createMockUnit({ traits: ["age system"] });
    const engine = GundamTestEngine.create({ play: [gd03GBouncer023, ageUnit] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [bouncerId, ageUnitId] = p1.getCardsInZone("battleArea");

    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "exResourcePlaced", cardId: "ex-token", playerId: PLAYER_ONE, ownerId: PLAYER_ONE },
        bouncerId!,
        PLAYER_ONE,
        framework,
        { chosenTargets: [ageUnitId!] },
      );
    });
    engine.tickFlow();

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(ageUnitId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("HighManeuver");
  });
});
