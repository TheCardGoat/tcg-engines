import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd01NoinSAries007 } from "./007-noin-s-aries.ts";

describe("Noin's Aries (GD01-007)", () => {
  it("【Destroyed】 draws 1 when another (OZ) Unit is in play", () => {
    // Noin (AP 2, HP 3) trait: "oz". Put a second (OZ) unit on p2's
    // side so the Destroyed condition "another (OZ) Unit in play" is
    // satisfied. An AP-3 attacker destroys Noin in combat.
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const friendlyOz = createMockUnit({ ap: 1, hp: 5, traits: ["oz"] } as unknown as Parameters<
      typeof createMockUnit
    >[0]);
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [gd01NoinSAries007, friendlyOz], deck: 5 },
    );
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const attackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const noinId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    engine.getG().exhausted[attackerId] = false;

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_TWO });
    engine.resolveCombat({ attackerId, target: noinId });

    // Noin destroyed (AP 3 vs HP 3).
    expect(engine.getState().ctx.zones.private.cardIndex[noinId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    // Destroyed trigger fired with the condition met → p2 drew 1.
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_TWO })).toBe(handBefore + 1);
  });
});
