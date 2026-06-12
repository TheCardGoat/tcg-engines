import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
  createMockUnit,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04Backup115 } from "./115-backup.ts";

describe("Backup (GD04-115)", () => {
  it("【Burst】deals 1 damage to an enemy Unit", () => {
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create({ deck: [gd04Backup115] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId, { targets: [enemyId] });

    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });

  describe("【Main】Choose 1 of your Units. When it deals battle damage to an enemy Unit that is Lv.5 or lower during this turn, destroy that enemy Unit.", () => {
    function setup({ enemyLevel = 5 }: { enemyLevel?: number } = {}) {
      const chosen = createMockUnit({ name: "Chosen Attacker", ap: 3, hp: 6 });
      const otherFriendly = createMockUnit({ name: "Other Friendly", ap: 3, hp: 6 });
      const enemy = createMockUnit({ name: "Enemy Target", level: enemyLevel, ap: 0, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04Backup115],
          play: [chosen, otherFriendly],
          resourceArea: activeResources(3),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [chosenId, otherFriendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      return {
        engine,
        p1,
        chosenId: chosenId!,
        otherFriendlyId: otherFriendlyId!,
        enemyId,
        commandId,
      };
    }

    it("destroys an enemy Lv.5 or lower Unit damaged by the chosen Unit", () => {
      const { engine, p1, chosenId, enemyId } = setup();

      expectSuccess(p1.playCommand(gd04Backup115, { targets: [chosenId] }));
      expectSuccess(engine.resolveCombat({ attackerId: chosenId, target: enemyId }));

      expectCardInTrash(engine, enemyId, PLAYER_TWO);
    });

    it("does not destroy an enemy Lv.6 Unit", () => {
      const { engine, p1, chosenId, enemyId } = setup({ enemyLevel: 6 });

      expectSuccess(p1.playCommand(gd04Backup115, { targets: [chosenId] }));
      expectSuccess(engine.resolveCombat({ attackerId: chosenId, target: enemyId }));

      expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).toContain(enemyId);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("does not apply when a different friendly Unit deals the battle damage", () => {
      const { engine, p1, otherFriendlyId, chosenId, enemyId } = setup();

      expectSuccess(p1.playCommand(gd04Backup115, { targets: [chosenId] }));
      expectSuccess(engine.resolveCombat({ attackerId: otherFriendlyId, target: enemyId }));

      expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).toContain(enemyId);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("moves the command card to trash after resolution", () => {
      const { engine, p1, chosenId, commandId } = setup();

      expectSuccess(p1.playCommand(gd04Backup115, { targets: [chosenId] }));

      expectCardInTrash(engine, commandId, PLAYER_ONE);
    });

    it("cannot be played without enough active resources", () => {
      const { engine, p1, chosenId } = setup();
      for (const resourceId of p1.getCardsInZone("resourceArea")) {
        engine.getG().exhausted[resourceId] = true;
      }

      expectFailure(
        p1.playCommand(gd04Backup115, { targets: [chosenId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
