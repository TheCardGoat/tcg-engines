import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02GrazeRitterGroundType083 } from "./083-graze-ritter-ground-type.ts";

describe("Graze Ritter (Ground Type) (GD02-083)", () => {
  it("【Destroyed】 on the opponent's turn sets a friendly (Gjallarhorn) Unit as active", () => {
    // Graze Ritter (AP 3, HP 2) is destroyed by an AP-2 attacker on
    // p1's turn. The Destroyed trigger checks "opponent's turn" (true
    // from p2's perspective) and sets a friendly Gjallarhorn active.
    // We seed an exhausted ally so the setActive flip is observable.
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const friendlyGjallarhorn = createMockUnit({
      ap: 1,
      hp: 5,
      traits: ["gjallarhorn"],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [gd02GrazeRitterGroundType083, { card: friendlyGjallarhorn, exhausted: true }],
      },
    );
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const attackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const grazeId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;
    const allyId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[1]!;

    engine.getG().exhausted[attackerId] = false;
    engine.getG().exhausted[allyId] = true;

    engine.resolveCombat({ attackerId, target: grazeId });

    // Graze Ritter destroyed (AP 2 vs HP 2).
    expect(engine.getState().ctx.zones.private.cardIndex[grazeId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    // Destroyed trigger (on opponent's turn) sets the ally active.
    expect(engine.getG().exhausted[allyId]).toBe(false);
  });
});
