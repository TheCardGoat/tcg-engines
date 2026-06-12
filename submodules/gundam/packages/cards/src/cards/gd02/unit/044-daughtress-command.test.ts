import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02DaughtressCommand044 } from "./044-daughtress-command.ts";

describe("Daughtress Command (GD02-044)", () => {
  it("【Destroyed】 deploys a rested Daughtress token when another (New UNE) Unit is in play", () => {
    // Daughtress Command (AP 3, HP 1) has the "new une" trait. Add a
    // second (New UNE) unit on p2's side so the Destroyed condition
    // "another (New UNE) Unit in play" is satisfied. An AP-1 attacker
    // destroys Daughtress Command in combat.
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const friendlyNewUne = createMockUnit({
      ap: 1,
      hp: 5,
      traits: ["new une"],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [gd02DaughtressCommand044, friendlyNewUne] },
    );
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const attackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const daughtressId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    engine.getG().exhausted[attackerId] = false;
    const battleCountBefore = engine.getCardCount({ zone: "battleArea", playerId: PLAYER_TWO });

    engine.resolveCombat({ attackerId, target: daughtressId });

    // Daughtress Command destroyed (AP 1 vs HP 1).
    expect(engine.getState().ctx.zones.private.cardIndex[daughtressId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    // Destroyed trigger deployed the token: one new unit entered p2's
    // battle area (Daughtress Command left, token entered, net 0 vs
    // pre-combat; but pre-combat had 2 units, post-combat has 2).
    expect(engine.getCardCount({ zone: "battleArea", playerId: PLAYER_TWO })).toBe(
      battleCountBefore,
    );
  });
});
