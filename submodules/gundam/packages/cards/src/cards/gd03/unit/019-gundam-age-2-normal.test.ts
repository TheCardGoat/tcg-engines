import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AsemuAsuno088 } from "../pilot/088-asemu-asuno.ts";
import { gd03GundamAge2Normal019 } from "./019-gundam-age-2-normal.ts";

describe("Gundam AGE-2 Normal (GD03-019)", () => {
  describe("【During Pair】Enemy Units choose this rested Unit as their attack target if possible when attacking.", () => {
    function setup({ paired = true, rested = true }: { paired?: boolean; rested?: boolean } = {}) {
      const pilot = createMockPilot({ name: "Pair Pilot", level: 1, cost: 1 });
      const otherTarget = createMockUnit({ name: "Other Target", hp: 6 });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: paired ? [pilot] : [],
          play: [
            { card: gd03GundamAge2Normal019, exhausted: rested },
            { card: otherTarget, exhausted: true },
          ],
          resourceArea: activeResources(5),
        },
        { play: [attacker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [age2Id, otherTargetId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      if (paired) {
        expectSuccess(p1.assignPilot(pilot, age2Id!));
      }
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
      engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);
      engine.getRuntime().runTestMutation(asPlayerId(PLAYER_ONE), ({ G, framework }) => {
        G.exhausted[age2Id!] = rested;
        framework.cards.patchMeta(age2Id!, { exhausted: rested });
      });

      return { engine, p2, age2Id: age2Id!, otherTargetId: otherTargetId!, attackerId };
    }

    it("prevents an enemy Unit from attacking a different rested Unit", () => {
      const { p2, otherTargetId, attackerId } = setup();

      expectFailure(p2.enterBattle(attackerId, otherTargetId), "INVALID_TARGET");
    });

    it("prevents an enemy Unit from attacking directly", () => {
      const { p2, attackerId } = setup();

      expectFailure(p2.enterBattle(attackerId, "direct"), "INVALID_TARGET");
    });

    it("allows an enemy Unit to attack the paired rested AGE-2", () => {
      const { p2, age2Id, attackerId } = setup();

      expectSuccess(p2.enterBattle(attackerId, age2Id));
    });

    it("does not restrict attacks while AGE-2 is unpaired", () => {
      const { p2, otherTargetId, attackerId } = setup({ paired: false });

      expectSuccess(p2.enterBattle(attackerId, otherTargetId));
    });

    it("does not restrict attacks while AGE-2 is active", () => {
      const { p2, otherTargetId, attackerId } = setup({ rested: false });

      expectSuccess(p2.enterBattle(attackerId, otherTargetId));
    });
  });

  describe("【When Linked】Place 1 EX Resource.", () => {
    it("places an active EX Resource token without moving AGE-2 out of battleArea", () => {
      const engine = GundamTestEngine.create({
        hand: [gd03AsemuAsuno088],
        play: [gd03GundamAge2Normal019],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.assignPilot(gd03AsemuAsuno088, unitId));

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      const newResourceId = resourcesAfter.find((id) => !resourcesBefore.includes(id));
      const framework = engine.getRuntime().getFrameworkReadAPI();

      expect(p1.getCardsInZone("battleArea")).toContain(unitId);
      expect(resourcesAfter).toHaveLength(resourcesBefore.length + 1);
      expect(newResourceId).toBeDefined();
      expect(framework.cards.getDefinition(newResourceId!)?.name).toBe("EX Resource");
      expect(engine.getG().exhausted[newResourceId!] ?? false).toBe(false);
    });

    it("does not place an EX Resource when the pairing is not a link", () => {
      const nonLinkPilot = createMockPilot({ name: "Non-Link Pilot", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [nonLinkPilot],
        play: [gd03GundamAge2Normal019],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea").length;

      expectSuccess(p1.assignPilot(nonLinkPilot, unitId));

      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore);
    });
  });
});
