import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01BigZam027 } from "./027-big-zam.ts";

describe("Big Zam (GD01-027)", () => {
  it("<Breach 4> deals 4 damage to the top shield after destroying an enemy Unit", () => {
    const defender = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd01BigZam027] },
      { play: [defender], deck: 3 },
    );
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const attackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const defenderId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    // Make sure attacker is ready.
    engine.getG().exhausted[attackerId] = false;

    engine.resolveCombat({ attackerId, target: defenderId });

    // Defender destroyed (AP 5 vs HP 3) → Breach 4 hits the top shield.
    expect(engine.getState().ctx.zones.private.cardIndex[defenderId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    expect(engine.getG().damage[shieldId] ?? 0).toBe(4);
  });

  describe("【Deploy】If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with <Blocker>.", () => {
    // Blocker mock unit — card-data keyword array is read by getEffectiveStats.
    const blockerEnemy = () =>
      createMockUnit({
        ap: 2,
        hp: 5,
        keywordEffects: [{ keyword: "Blocker" }],
      });

    it("fires when ≥10 (Zeon)/(Neo Zeon) Unit cards are in the trash (trait-OR)", () => {
      // 6 Zeon + 4 Neo Zeon = 10 matching, plus 2 non-matching to prove OR.
      const trashUnits = [
        ...Array.from({ length: 6 }, () => createMockUnit({ traits: ["zeon"] })),
        ...Array.from({ length: 4 }, () => createMockUnit({ traits: ["neo zeon"] })),
        createMockUnit({ traits: ["earth federation"] }),
        createMockUnit({ traits: ["titans"] }),
      ];
      const enemyA = blockerEnemy();
      const enemyB = blockerEnemy();
      const enemyNoBlocker = createMockUnit({ ap: 2, hp: 5 });

      const engine = GundamTestEngine.create(
        {
          hand: [gd01BigZam027],
          trash: trashUnits,
          resourceArea: activeResources(10),
          deck: 5,
        },
        { play: [enemyA, enemyB, enemyNoBlocker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyAId, enemyBId, noBlockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01BigZam027));

      // Blocker units take 4 damage each; the non-blocker is untouched.
      expect(p2.getDamage(enemyAId!)).toBe(4);
      expect(p2.getDamage(enemyBId!)).toBe(4);
      expect(p2.getDamage(noBlockerId!)).toBe(0);
    });

    it("does NOT fire when fewer than 10 matching trash cards are present", () => {
      // 5 Zeon + 4 Neo Zeon = 9 matching (just under the threshold).
      const trashUnits = [
        ...Array.from({ length: 5 }, () => createMockUnit({ traits: ["zeon"] })),
        ...Array.from({ length: 4 }, () => createMockUnit({ traits: ["neo zeon"] })),
      ];
      const enemy = blockerEnemy();

      const engine = GundamTestEngine.create(
        {
          hand: [gd01BigZam027],
          trash: trashUnits,
          resourceArea: activeResources(10),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd01BigZam027));

      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("does NOT fire when trash has 10 cards but none carry the matching traits", () => {
      const trashUnits = Array.from({ length: 10 }, () =>
        createMockUnit({ traits: ["earth federation"] }),
      );
      const enemy = blockerEnemy();

      const engine = GundamTestEngine.create(
        {
          hand: [gd01BigZam027],
          trash: trashUnits,
          resourceArea: activeResources(10),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd01BigZam027));

      expect(p2.getDamage(enemyId)).toBe(0);
    });
  });
});
