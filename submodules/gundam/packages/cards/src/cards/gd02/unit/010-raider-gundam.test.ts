import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02RaiderGundam010 } from "./010-raider-gundam.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02OrgaCrotAndShani087 } from "../pilot/087-orga-crot-and-shani.ts";

function damageCommand(owner: "friendly" | "opponent") {
  return createMockCommand({
    name: `${owner} Effect Damage`,
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 1,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Choose 1 ${owner} Unit. Deal 1 damage to it.`,
      },
    ],
  });
}

describe("Raider Gundam (GD02-010)", () => {
  describe("Printed Lv.5 and cost 3", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02RaiderGundam010],
        resourceArea: activeResources(4),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02RaiderGundam010],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: (Biological CPU) Trait", () => {
    it("can attack on its deploy turn after a Biological CPU Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02RaiderGundam010, gd02OrgaCrotAndShani087],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02RaiderGundam010));
      const raiderId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, raiderId));
      expectSuccess(p1.enterBattle(raiderId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: raiderId });
    });

    it("cannot attack on its deploy turn after a non-Biological CPU Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02RaiderGundam010, gd02JeridMessa086],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02RaiderGundam010));
      const raiderId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, raiderId));

      expectFailure(p1.enterBattle(raiderId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【Once per Turn】When this Unit receives enemy effect damage, draw 1.", () => {
    it("draws a card after an enemy Command deals effect damage to it", () => {
      const enemyDamage = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        { play: [gd02RaiderGundam010], deck: 3 },
        { hand: [enemyDamage], resourceArea: activeResources(1) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const raiderId = p1.getCardsInZone("battleArea")[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p2.playCommand(enemyDamage));
      const damageChoice = p2.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(raiderId);
      expectSuccess(p2.resolveEffect({ targets: [raiderId] }));

      expect(p1.getDamage(raiderId)).toBe(1);
      expect(p1.getHand()).toHaveLength(handBefore + 1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(2);
    });

    it("does not draw after its controller deals effect damage to it", () => {
      const friendlyDamage = damageCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [friendlyDamage],
        play: [gd02RaiderGundam010],
        resourceArea: activeResources(1),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const raiderId = p1.getCardsInZone("battleArea")[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.playCommand(friendlyDamage));
      const damageChoice = p1.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(raiderId);
      expectSuccess(p1.resolveEffect({ targets: [raiderId] }));

      expect(p1.getDamage(raiderId)).toBe(1);
      expect(p1.getHand()).toHaveLength(handBefore - 1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(3);
    });

    it("draws only once after two enemy damage effects in the same turn", () => {
      const firstDamage = damageCommand("opponent");
      const secondDamage = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        { play: [gd02RaiderGundam010], deck: 3 },
        { hand: [firstDamage, secondDamage], resourceArea: activeResources(2) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const raiderId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(firstDamage));
      const firstDamageChoice = p2.getBoardView().pendingChoice;
      if (firstDamageChoice?.kind !== "targetSelection") {
        throw new Error("Expected the first visible damage target choice");
      }
      expect(firstDamageChoice.legalTargetIds).toContain(raiderId);
      expectSuccess(p2.resolveEffect({ targets: [raiderId] }));
      expectSuccess(p2.playCommand(secondDamage));
      const secondDamageChoice = p2.getBoardView().pendingChoice;
      if (secondDamageChoice?.kind !== "targetSelection") {
        throw new Error("Expected the second visible damage target choice");
      }
      expect(secondDamageChoice.legalTargetIds).toContain(raiderId);
      expectSuccess(p2.resolveEffect({ targets: [raiderId] }));

      expect(p1.getDamage(raiderId)).toBe(2);
      expect(p1.getHand()).toHaveLength(1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(2);
    });
  });
});
