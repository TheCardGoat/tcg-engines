import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09ImpulseGundam001 } from "./001-impulse-gundam.ts";

describe("Impulse Gundam (ST09-001)", () => {
  const createTrashImpulse = (overrides = {}) =>
    createMockUnit({
      name: "Force Impulse Gundam",
      level: 4,
      cost: 4,
      ap: 4,
      hp: 4,
      color: "purple",
      ...overrides,
    });

  it("can be deployed with 3 resources by paying 2", () => {
    const engine = GundamTestEngine.create({
      hand: [st09ImpulseGundam001],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });

  describe('【Activate･Main】②, return this Unit to the bottom of its owner\'s deck：Choose 1 Unit card with "Impulse Gundam" in its card name that is Lv.4 or higher from your trash. Deploy it.', () => {
    it("pays 2 resources, returns itself to deck bottom, and deploys a Lv.4+ Impulse from trash", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(2),
          deck: 2,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.activateAbility(selfId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [targetId],
      });
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));

      expect(p1.getCardsInZone("battleArea")).toEqual([targetId]);
      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore + 1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("matches an Impulse Gundam variant by card-name inclusion", () => {
      const target = createTrashImpulse({ name: "Blast Impulse Gundam" });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.activateAbility(selfId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [targetId],
      });
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));

      expect(p1.getCardsInZone("battleArea")).toEqual([targetId]);
    });

    it("lets the controller choose which legal Impulse Gundam is deployed", () => {
      const first = createTrashImpulse({ name: "Force Impulse Gundam" });
      const second = createTrashImpulse({ name: "Sword Impulse Gundam" });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [first, second],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const [firstId, secondId] = p1.getCardsInZone("trash");

      expectSuccess(p1.activateAbility(selfId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p1.getCardsInZone("battleArea")).toEqual([secondId]);
      expect(p1.getCardsInZone("trash")).toEqual([firstId]);
    });

    it("prompts for a trash target when activated without a chosen target", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateAbility(selfId, 0));

      const pending = p1.getBoardView().pendingChoice;
      expect(pending?.kind).toBe("targetSelection");
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
    });

    it("cannot activate without 2 active resources", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(1),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(selfId, 0, { targets: [targetId] }),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p1.getCardsInZone("trash")).toEqual([targetId]);
    });

    it("rejects a trash Unit below Lv.4", () => {
      const lowLevel = createTrashImpulse({ level: 3 });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [lowLevel],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const lowLevelId = p1.getCardsInZone("trash")[0]!;

      expectFailure(p1.activateAbility(selfId, 0, { targets: [lowLevelId] }), "ILLEGAL_TARGET");
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p1.getCardsInZone("trash")).toEqual([lowLevelId]);
    });

    it('rejects a Lv.4+ trash Unit without "Impulse Gundam" in its card name', () => {
      const wrongName = createTrashImpulse({ name: "Destiny Gundam", level: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [wrongName],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const wrongNameId = p1.getCardsInZone("trash")[0]!;

      expectFailure(p1.activateAbility(selfId, 0, { targets: [wrongNameId] }), "ILLEGAL_TARGET");
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p1.getCardsInZone("trash")).toEqual([wrongNameId]);
    });

    it("rejects an opponent's matching trash Unit", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          resourceArea: activeResources(2),
        },
        { trash: [target] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const opponentTargetId = p2.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(selfId, 0, { targets: [opponentTargetId] }),
        "ILLEGAL_TARGET",
      );
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p2.getCardsInZone("trash")).toEqual([opponentTargetId]);
    });
  });
});
