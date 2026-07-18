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
import { gd02CalamityGundam009 } from "./009-calamity-gundam.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02OrgaCrotAndShani087 } from "../pilot/087-orga-crot-and-shani.ts";
import { restUnitsByAttackingDirectly } from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function apReductionCommand() {
  return createMockCommand({
    name: "Enemy AP Reduction",
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "statModifier",
              stat: "ap",
              amount: -1,
              duration: "thisTurn",
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 enemy Unit. It gets AP-1 during this turn.",
      },
    ],
  });
}

describe("Calamity Gundam (GD02-009)", () => {
  describe("Printed Lv.5 and cost 3", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02CalamityGundam009],
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
        hand: [spender, gd02CalamityGundam009],
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
        hand: [gd02CalamityGundam009, gd02OrgaCrotAndShani087],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02CalamityGundam009));
      const calamityId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, calamityId));
      expectSuccess(p1.enterBattle(calamityId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: calamityId });
    });

    it("cannot attack on its deploy turn after a non-Biological CPU Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02CalamityGundam009, gd02JeridMessa086],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02CalamityGundam009));
      const calamityId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, calamityId));

      expectFailure(p1.enterBattle(calamityId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【Once per Turn】When this Unit's AP is reduced by an enemy effect, choose 1 rested enemy Unit. Deal 2 damage to it.", () => {
    it("asks its controller to choose a rested enemy Unit and deals 2 damage", () => {
      const reduction = apReductionCommand();
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd02CalamityGundam009], shieldArea: [createMockUnit()] },
        { hand: [reduction], play: [enemy], resourceArea: activeResources(1) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const calamityId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      expectSuccess(p2.playCommand(reduction));
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [calamityId],
      });
      expectSuccess(p2.resolveEffect({ targets: [calamityId] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(2);
      expect(p1.getVisibleCard(calamityId)?.effectiveAp).toBe(2);
    });

    it("does not offer an active enemy Unit as the damage target", () => {
      const reduction = apReductionCommand();
      const activeEnemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd02CalamityGundam009] },
        { hand: [reduction], play: [activeEnemy], resourceArea: activeResources(1) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const calamityId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(reduction));
      expectSuccess(p2.resolveEffect({ targets: [calamityId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("triggers only once when two enemy effects reduce its AP in the same turn", () => {
      const firstReduction = apReductionCommand();
      const secondReduction = apReductionCommand();
      const enemy = createMockUnit({ hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [gd02CalamityGundam009], shieldArea: [createMockUnit()] },
        {
          hand: [firstReduction, secondReduction],
          play: [enemy],
          resourceArea: activeResources(2),
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const calamityId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      expectSuccess(p2.playCommand(firstReduction));
      expectSuccess(p2.resolveEffect({ targets: [calamityId] }));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expectSuccess(p2.playCommand(secondReduction));
      expectSuccess(p2.resolveEffect({ targets: [calamityId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(2);
    });
  });
});
