import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09ForceImpulseGundam002 } from "./002-force-impulse-gundam.ts";

describe("Force Impulse Gundam (ST09-002)", () => {
  it("can be deployed with 5 resources by paying 4", () => {
    const engine = GundamTestEngine.create({
      hand: [st09ForceImpulseGundam002],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5, effectiveHp: 4 });
  });

  it("cannot be deployed below its printed Lv.5 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [st09ForceImpulseGundam002],
      resourceArea: activeResources(4),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st09ForceImpulseGundam002),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  describe('【Destroyed】Choose 1 (Minerva Squad) Unit card without "Force Impulse Gundam" in its card name from your trash. Add it to your hand.', () => {
    it("adds a non-Force Minerva Squad Unit from your trash to your hand", () => {
      const sword = createMockUnit({
        name: "Sword Impulse Gundam",
        traits: ["minerva squad"],
      });
      const attacker = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st09ForceImpulseGundam002, exhausted: true }],
          trash: [sword],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const forceId = p1.getCardsInZone("battleArea")[0]!;
      const swordId = p1.getCardsInZone("trash")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, forceId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: forceId,
        legalTargetIds: [swordId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [swordId] }));

      expect(p1.getHand()).toContain(swordId);
      expect(p1.getCardZone(forceId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not add a Force Impulse Gundam or a non-Minerva Unit", () => {
      const forceCopy = createMockUnit({
        name: "Force Impulse Gundam",
        traits: ["minerva squad"],
      });
      const wrongTrait = createMockUnit({
        name: "Sword Impulse Gundam",
        traits: ["zaft"],
      });
      const attacker = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st09ForceImpulseGundam002, exhausted: true }],
          trash: [forceCopy, wrongTrait],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const forceId = p1.getCardsInZone("battleArea")[0]!;
      const trashBefore = p1.getCardsInZone("trash");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, forceId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getCardsInZone("trash")).toEqual([...trashBefore, forceId]);
    });

    it("offers every eligible own-trash Unit but excludes names containing Force Impulse Gundam", () => {
      const first = createMockUnit({ name: "Sword Impulse Gundam", traits: ["minerva squad"] });
      const second = createMockUnit({ name: "Blast Impulse Gundam", traits: ["minerva squad"] });
      const excluded = createMockUnit({
        name: "Force Impulse Gundam Spec II",
        traits: ["minerva squad"],
      });
      const attacker = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st09ForceImpulseGundam002, exhausted: true }],
          trash: [first, second, excluded],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const forceId = p1.getCardsInZone("battleArea")[0]!;
      const [firstId, secondId] = p1.getCardsInZone("trash");
      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, forceId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        legalTargetIds: [firstId, secondId],
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));
      expect(p1.getHand()).toEqual([secondId]);
      expect(p1.getCardZone(firstId!)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("Link [Shinn Asuka]", () => {
    it("can attack on its deploy turn after pairing with Shinn Asuka", () => {
      const shinn = createMockPilot({ name: "Shinn Asuka", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st09ForceImpulseGundam002, shinn], resourceArea: activeResources(5), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st09ForceImpulseGundam002));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(shinn, unitId));
      expectSuccess(p1.enterBattle(unitId, "direct"));
    });

    it("cannot attack on its deploy turn after pairing with another Pilot", () => {
      const pilot = createMockPilot({ name: "Wrong Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st09ForceImpulseGundam002, pilot], resourceArea: activeResources(5), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st09ForceImpulseGundam002));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });
  });
});
